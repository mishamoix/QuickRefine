export const GITHUB_URL = 'https://github.com/mishamoix/QuickRefine';
export const SUPPORT_EMAIL = 'quickrefine@bizarrefusion.com';

export const LLM_PROVIDER = (process.env.LLM_PROVIDER || 'anthropic') as
	| 'openai'
	| 'anthropic'
	| 'openrouter';
export const OPENAI_MODEL = 'gpt-4.1-2025-04-14';
export const ANTHROPIC_MODEL = 'claude-sonnet-4-5';
export const OPENROUTER_MODEL = 'moonshotai/kimi-k2-0905';

export const MAX_CHARACTERS = 600;

const config = {
	appName:
		'QuickRefine | Improve Your English – Instantly Verify and Enhance Your Text',
	appDescription:
		'Check your English writing with AI-powered proofreader. Get instant grammar and punctuation corrections, style refinements, and clear explanations to boost your skills.',
	domainName: 'quickrefine.com',
	auth: {
		loginUrl: '',
		callbackUrl: '/',
	},
};

export default config;
