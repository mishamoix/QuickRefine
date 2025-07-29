import path from 'path';
import fs from 'fs/promises';

/**
 * Load a prompt file from the prompts directory
 */
export async function loadPrompt(filename: string): Promise<string> {
	try {
		const filePath = path.join(process.cwd(), 'prompts', filename);
		return await fs.readFile(filePath, 'utf8');
	} catch (error) {
		console.error(`Error reading prompt file ${filename}:`, error);
		throw new Error(`Failed to load prompt: ${filename}`);
	}
}

/**
 * Load all required prompts for the enhance API
 */
export async function loadEnhancePrompts() {
	const [fixTextPrompt, explainPrompt] = await Promise.all([
		loadPrompt('fix_text.md'),
		loadPrompt('explain.md'),
	]);

	return {
		fixTextPrompt,
		explainPrompt,
	};
}
