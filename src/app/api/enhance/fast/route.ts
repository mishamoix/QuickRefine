import { NextRequest, NextResponse } from 'next/server';
import { MAX_CHARACTERS } from '@/config';
import { cleanText } from '@/libs';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/libs/next-auth';
import User from '@/app/models/User';
import connectMongo from '@/libs/mongoose';
import { langfuse } from '@/libs/langfuse';
import { fastModeEnhance, createTraceGeneration } from '@/libs/llm';
import { loadFastModePrompt } from '@/libs/prompts';

const getUser = async () => {
	const session = await getServerSession(authOptions);

	if (!session) {
		return null;
	}

	await connectMongo();

	const result = await User.findById(session.user.id);
	return result;
};

export async function POST(req: NextRequest) {
	const isProd = process.env.NODE_ENV !== 'development';
	const user = await getUser();
	const trace = langfuse.trace({
		name: 'enhance-request-fast',
		userId: user?.email || 'anonymous',
	});

	try {
		// Authentication and authorization checks
		if (isProd) {
			if (!user) {
				return NextResponse.json(
					{ error: 'Unauthorized, please login' },
					{ status: 401 }
				);
			}

			if (user.isBlocked) {
				return NextResponse.json(
					{ error: 'You have been blocked, please contact support' },
					{ status: 403 }
				);
			}

			user.numberOfRequests++;
			await user.save();
		}

		const { text } = await req.json();
		const trimmedText = cleanText(text);

		trace.update({
			input: {
				text: trimmedText,
				isProd,
				mode: 'fast',
			},
			tags: isProd ? ['production', 'fast-mode'] : ['development', 'fast-mode'],
		});

		// Validation
		if (!trimmedText || trimmedText === '') {
			return NextResponse.json({ error: 'Text is required' }, { status: 200 });
		}
		if (trimmedText.length > MAX_CHARACTERS) {
			return NextResponse.json(
				{
					error: `Text exceeds maximum character limit of ${MAX_CHARACTERS}`,
				},
				{ status: 200 }
			);
		}

		console.log(
			`[${trace.id}] Starting fast mode enhancement for text:`,
			trimmedText.substring(0, 100)
		);

		// Load fast mode prompt
		const fastModePrompt = await loadFastModePrompt();

		// Single-shot enhancement
		const generation = createTraceGeneration(trace, 'fast-mode', {
			text: trimmedText,
		});

		const result = await fastModeEnhance(
			trimmedText,
			fastModePrompt,
			generation
		);

		console.log(`[${trace.id}] Fast mode enhancement completed`);

		// Check if there's an error from the fast mode
		if (result.data.error) {
			trace.update({
				output: { error: result.data.error },
			});
			return NextResponse.json({ error: result.data.error });
		}

		const finalResult = {
			text: result.data.text,
			meaning: result.data.meaning,
		};

		trace.update({
			output: finalResult,
		});

		console.log(`[${trace.id}] Fast mode completed successfully`);
		console.log('finalResult', finalResult);
		return NextResponse.json(finalResult);
	} catch (error) {
		console.error(`[${trace.id}] Error in fast mode route:`, error);
		return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
	} finally {
		await langfuse.shutdownAsync();
	}
}

export function GET() {
	return NextResponse.json(
		{ error: 'GET method not allowed' },
		{ status: 405 }
	);
}
