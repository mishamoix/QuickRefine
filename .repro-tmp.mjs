import { generateObject } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';
import { z } from 'zod';
import { readFileSync } from 'node:fs';

const root = '/Users/mike/Documents/WorkNStudy/Projects/bizarre_fusion/fix_english';

// load OPENROUTER_API_KEY from .env
for (const line of readFileSync(`${root}/.env`, 'utf8').split('\n')) {
	const m = line.match(/^([A-Z_]+)=(.*)$/);
	if (m) process.env[m[1]] ??= m[2];
}

const openrouter = createOpenAI({
	apiKey: process.env.OPENROUTER_API_KEY,
	baseURL: 'https://openrouter.ai/api/v1',
});

const fastModeSchema = z.object({
	text: z.string(),
	error: z.string().nullable(),
});

const promptFile = process.argv[2] || `${root}/prompts/fast_mode.md`;
const prompt = readFileSync(promptFile, 'utf8');
const userInput = 'Yes, it should be something different than our current SSR';

const result = await generateObject({
	model: openrouter('openai/gpt-5.2-chat'),
	output: 'object',
	prompt: `${prompt}\n\nUser input: ${userInput}`,
	schema: fastModeSchema,
	temperature: 1,
});

const { text, error } = result.object;
console.log('=== error field ===');
console.log(JSON.stringify(error));
console.log('=== text field (JSON-escaped) ===');
console.log(JSON.stringify(text));
console.log('=== diagnostics ===');
console.log('text starts with "{":', text.trimStart().startsWith('{'));
const trailingNewlines = text.length - text.replace(/\n+$/, '').length;
console.log('trailing newlines:', trailingNewlines);
