import { generateObject } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';
import { createAnthropic } from '@ai-sdk/anthropic';
import { z } from 'zod';
import { USE_CHAT_GPT, OPENAI_MODEL, ANTHROPIC_MODEL } from '@/config';

// Response schemas
const fixTextSchema = z.object({
	text: z.string().optional(),
	error: z.string().optional(),
});

const explainSchema = z.object({
	text: z.string(),
	mistakes: z.array(
		z.object({
			error: z.string(),
			corrected: z.string(),
			explanation: z.string(),
			rule: z.string(),
			example: z.string(),
		})
	),
});

export interface LLMUsage {
	inputTokens?: number;
	outputTokens?: number;
}

export interface LLMResponse<T> {
	data: T;
	usage: LLMUsage;
}

// Initialize providers with API keys
const openai = createOpenAI({
	apiKey: process.env.LLM_API_KEY,
});

const anthropic = createAnthropic({
	apiKey: process.env.ANTHROPIC_API_KEY,
});

/**
 * Generate a response using the configured LLM provider
 */
async function generateWithProvider<T>(
	prompt: string,
	userInput: string,
	schema: z.ZodSchema<T>,
	traceGeneration?: any
): Promise<LLMResponse<T>> {
	const model = USE_CHAT_GPT
		? openai(OPENAI_MODEL)
		: anthropic(ANTHROPIC_MODEL);

	const result = await generateObject({
		model,
		prompt: `${prompt}\n\nUser input: ${userInput}`,
		schema,
		temperature: 1,
	});

	// Update trace if provided
	if (traceGeneration) {
		traceGeneration.update({
			output: result.object,
			usage: {
				input: result.usage?.promptTokens,
				output: result.usage?.completionTokens,
			},
		});
	}

	return {
		data: result.object,
		usage: {
			inputTokens: result.usage?.promptTokens,
			outputTokens: result.usage?.completionTokens,
		},
	};
}

/**
 * First step: Fix text using fix_text.md prompt
 */
export async function fixText(
	text: string,
	prompt: string,
	traceGeneration?: any
): Promise<LLMResponse<z.infer<typeof fixTextSchema>>> {
	return generateWithProvider(prompt, text, fixTextSchema, traceGeneration);
}

/**
 * Second step: Explain corrections using explain.md prompt
 */
export async function explainCorrections(
	originalText: string,
	correctedText: string,
	prompt: string,
	traceGeneration?: any
): Promise<LLMResponse<z.infer<typeof explainSchema>>> {
	const userInput = `Incorrect: ${originalText}\nCorrect: ${correctedText}`;
	return generateWithProvider(
		prompt,
		userInput,
		explainSchema,
		traceGeneration
	);
}

/**
 * Helper to create trace generation for langfuse
 */
export function createTraceGeneration(trace: any, name: string, input: any) {
	return trace.generation({
		name,
		input,
		model: USE_CHAT_GPT ? OPENAI_MODEL : ANTHROPIC_MODEL,
	});
}
