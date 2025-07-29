import { NextRequest, NextResponse } from 'next/server';
import { MAX_CHARACTERS } from '@/config';
import { cleanText } from '@/libs';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/libs/next-auth';
import User from '@/app/models/User';
import connectMongo from '@/libs/mongoose';
import { langfuse } from '@/libs/langfuse';
import { fixText, explainCorrections, createTraceGeneration } from '@/libs/llm';
import { loadEnhancePrompts } from '@/libs/prompts';

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
		name: 'enhance-request',
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
			},
			tags: isProd ? ['production'] : ['development'],
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
			`[${trace.id}] Starting two-step enhancement for text:`,
			trimmedText.substring(0, 100)
		);

		// Load prompts
		const { fixTextPrompt, explainPrompt } = await loadEnhancePrompts();

		// Step 1: Fix text
		const fixGeneration = createTraceGeneration(trace, 'fix-text', {
			text: trimmedText,
		});

		const fixResult = await fixText(trimmedText, fixTextPrompt, fixGeneration);

		console.log(`[${trace.id}] Fix text step completed`);

		// Check if there's an error from the fix step
		if (fixResult.data.error) {
			trace.update({
				output: { error: fixResult.data.error },
			});
			return NextResponse.json({ error: fixResult.data.error });
		}

		// Step 2: Check if there are fixes and explain them
		if (!fixResult.data.text || fixResult.data.text.trim() == '') {
			const noCorrectionsResult = {
				text: trimmedText,
				mistakes: [],
			};

			trace.update({
				output: noCorrectionsResult,
			});

			console.log(`[${trace.id}] No corrections needed`);
			return NextResponse.json(noCorrectionsResult);
		}

		console.log(
			`[${trace.id}] Text has corrections, proceeding to explain step`
		);

		const explainGeneration = createTraceGeneration(
			trace,
			'explain-corrections',
			{
				originalText: trimmedText,
				correctedText: fixResult.data.text,
			}
		);

		const explainResult = await explainCorrections(
			trimmedText,
			fixResult.data.text,
			explainPrompt,
			explainGeneration
		);

		const finalResult = explainResult.data;

		trace.update({
			output: finalResult,
		});

		console.log(`[${trace.id}] Enhancement completed with explanations`);
		return NextResponse.json(finalResult);
	} catch (error) {
		console.error(`[${trace.id}] Error in enhance route:`, error);
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
