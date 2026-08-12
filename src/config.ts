export const GITHUB_URL = 'https://github.com/mishamoix/QuickRefine';
export const SUPPORT_EMAIL = 'quickrefine@bizarrefusion.com';

export const LLM_PROVIDER = (process.env.LLM_PROVIDER || 'anthropic') as
	| 'openai'
	| 'anthropic'
	| 'openrouter';
export const OPENAI_MODEL = 'gpt-4.1-2025-04-14';
export const ANTHROPIC_MODEL = 'claude-sonnet-4-5';
export const OPENROUTER_MODEL = 'openai/gpt-5.6-luna';

export const MAX_CHARACTERS = 600;

const config = {
	appName: 'QuickRefine | Fix It. Understand It.',
	appDescription:
		'Proofread short English texts, understand every correction, and confirm your intended meaning before you send.',
	domainName: 'quickrefine.com',
	auth: {
		loginUrl: '',
		callbackUrl: '/',
	},
};

export default config;
