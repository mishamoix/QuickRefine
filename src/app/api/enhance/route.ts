import { NextRequest, NextResponse } from 'next/server';
import anthropic from '@/libs/anthropicClient';
import openai, { langfuse } from '@/libs/openaiClient';
import path from 'path';
import fs from 'fs/promises';
import config, {
	USE_CHAT_GPT,
	MAX_CHARACTERS,
	OPENAI_MODEL,
	ANTHROPIC_MODEL,
} from '@/config';
import { cleanText } from '@/libs';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/libs/next-auth';
import User from '@/app/models/User';
import connectMongo from '@/libs/mongoose';

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
			`[${trace.id}] Gpt requested with text:`,
			trimmedText.substring(0, 100)
		);

		const systemPrompt = await getSystemPrompt();

		let data: string | null = null;
		if (USE_CHAT_GPT) {
			const generation = trace.generation({
				name: 'openai-completion',
				input: [
					{ role: 'system', content: systemPrompt },
					{ role: 'user', content: trimmedText },
					{ role: 'assistant', content: '{' },
				],
				model: OPENAI_MODEL,
			});
			const response = await openai.chat.completions.create({
				model: OPENAI_MODEL,
				messages: [
					{ role: 'system', content: systemPrompt },
					{ role: 'user', content: trimmedText },
					{ role: 'assistant', content: '{' },
				],
				response_format: { type: 'json_object' },
				temperature: 0.7,
			});
			data = response.choices[0].message.content;
			generation.update({
				output: data,
				usage: {
					input: response.usage?.prompt_tokens,
					output: response.usage?.completion_tokens,
				},
			});
			console.log(`[${trace.id}] GPT done`);
		} else {
			const generation = trace.generation({
				name: 'anthropic-completion',
				input: [
					{ role: 'assistant', content: systemPrompt },
					{ role: 'user', content: trimmedText },
				],
				model: ANTHROPIC_MODEL,
			});
			const response = await anthropic.messages.create({
				max_tokens: 1024,
				messages: [
					{ role: 'assistant', content: systemPrompt },
					{ role: 'user', content: trimmedText },
				],
				model: ANTHROPIC_MODEL,
			});
			if (response.content[0].type === 'text') {
				data = cleanTextForJson(response.content[0].text);
			}
			generation.update({
				output: data,
			});
			console.log(`[${trace.id}] Anthropic done`);
		}

		trace.update({
			output: data,
		});

		if (!data) {
			return NextResponse.json({ error: 'No data' }, { status: 400 });
		}
		const jsonData = JSON.parse(data);

		console.log(`[${trace.id}] GPT Response`);
		return NextResponse.json(jsonData);
	} catch (error) {
		console.error(`[${trace.id}] Error in enhance route:`, error);
		const statusMessage =
			error instanceof Error ? error.message : String(error);
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

async function getSystemPrompt(filePath?: string): Promise<string> {
	try {
		// Determine the file path (default location if not provided)
		const defaultPath = path.join(process.cwd(), 'prompts', 'command.md');
		const resolvedPath = filePath || defaultPath;

		// Read and return the file content
		return await fs.readFile(resolvedPath, 'utf8');
	} catch (error) {
		console.error('Error reading system prompt:', error);
		throw new Error('Failed to load system prompt');
	}
}

const cleanTextForJson = (text: string) => {
	return text.replace(/```json/g, '').replace(/```/g, '');
};
