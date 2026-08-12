import { generateObject } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';
import { createAnthropic } from '@ai-sdk/anthropic';
import { z } from 'zod';
import {
	LLM_PROVIDER,
	OPENAI_MODEL,
	ANTHROPIC_MODEL,
	OPENROUTER_MODEL,
} from '@/config';

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

const fastModeSchema = z.object({
	text: z.string().optional(),
	meaning: z.string().optional(),
	error: z.string().optional(),
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

const openrouter = createOpenAI({
	apiKey: process.env.OPENROUTER_API_KEY,
	baseURL: 'https://openrouter.ai/api/v1',
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
	let model;

	switch (LLM_PROVIDER) {
		case 'openai':
			model = openai(OPENAI_MODEL);
			break;
		case 'openrouter':
			// OpenRouter reliably supports the Chat Completions API; the newer
			// Responses API (the @ai-sdk/openai v4 default) is not consistently
			// supported by every model routed through it, and combined with
			// strict JSON-schema structured outputs was causing some models to
			// degenerate into runaway repetition instead of closing the JSON.
			model = openrouter.chat(OPENROUTER_MODEL);
			break;
		case 'anthropic':
		default:
			model = anthropic(ANTHROPIC_MODEL);
			break;
	}

	const result = await generateObject({
		model,
		output: 'object',
		prompt: `${prompt}\n\nUser input: ${userInput}`,
		schema,
		temperature: 1,
		providerOptions: {
			openai: {
				// Strict grammar-constrained JSON decoding made some models
				// degenerate into runaway repetition on large free-text fields
				// instead of closing the JSON (see llm.ts history).
				strictJsonSchema: false,
			},
		},
	});

	// Update trace if provided
	if (traceGeneration) {
		traceGeneration.update({
			output: result.object,
			usage: {
				input: result.usage?.inputTokens,
				output: result.usage?.outputTokens,
			},
		});
	}

	return {
		data: result.object,
		usage: {
			inputTokens: result.usage?.inputTokens,
			outputTokens: result.usage?.outputTokens,
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
 * Fast mode: Single-shot text enhancement with corrections and explanations
 */
export async function fastModeEnhance(
	text: string,
	prompt: string,
	traceGeneration?: any
): Promise<LLMResponse<z.infer<typeof fastModeSchema>>> {
	return generateWithProvider(prompt, text, fastModeSchema, traceGeneration);
}

/**
 * Helper to create trace generation for langfuse
 */
export function createTraceGeneration(trace: any, name: string, input: any) {
	let modelName;

	switch (LLM_PROVIDER) {
		case 'openai':
			modelName = OPENAI_MODEL;
			break;
		case 'openrouter':
			modelName = OPENROUTER_MODEL;
			break;
		case 'anthropic':
		default:
			modelName = ANTHROPIC_MODEL;
			break;
	}

	return trace.generation({
		name,
		input,
		model: modelName,
	});
}
