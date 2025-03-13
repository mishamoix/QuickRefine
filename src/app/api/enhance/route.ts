import { NextRequest, NextResponse } from 'next/server';
import anthropic from '@/libs/anthropicClient';
import openai from '@/libs/openaiClient';
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
	const isProd = true; // process.env.NODE_ENV === 'production';
	try {
		if (isProd) {
			const user = await getUser();

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
		console.log('Gpt requested with text:', trimmedText);

		const systemPrompt = await getSystemPrompt();

		let data: string | null = null;
		if (USE_CHAT_GPT) {
			const response = await openai.chat.completions.create({
				model: OPENAI_MODEL,
				messages: [
					{ role: 'system', content: systemPrompt },
					{ role: 'user', content: `User's input: "${trimmedText}"` },
				],
				response_format: { type: 'json_object' },
				temperature: 1.0,
			});
			data = response.choices[0].message.content;
			console.log('GPT done');
		} else {
			const response = await anthropic.messages.create({
				max_tokens: 1024,
				messages: [
					{ role: 'assistant', content: systemPrompt },
					{ role: 'user', content: `User's input: "${trimmedText}"` },
				],
				model: ANTHROPIC_MODEL,
			});
			if (response.content[0].type === 'text') {
				data = cleanTextForJson(response.content[0].text);
			}
			console.log('Anthropic done');
			console.log('Anthropic response:', data);
		}

		if (!data) {
			return NextResponse.json({ error: 'No data' }, { status: 400 });
		}
		const jsonData = JSON.parse(data);
		console.log('GPT Response', jsonData);
		return NextResponse.json(jsonData);
	} catch (error) {
		console.error('Error in enhance route:', error);
		return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
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
