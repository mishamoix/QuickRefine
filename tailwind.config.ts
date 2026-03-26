import type { Config } from 'tailwindcss';

export default {
	content: [
		'./src/pages/**/*.{js,ts,jsx,tsx,mdx}',
		'./src/components/**/*.{js,ts,jsx,tsx,mdx}',
		'./src/app/**/*.{js,ts,jsx,tsx,mdx}',
	],
	theme: {
		extend: {
			colors: {
				background: 'var(--background)',
				foreground: 'var(--foreground)',
			},
			fontFamily: {
				sans: ['var(--font-sans)', 'ui-sans-serif', 'system-ui'],
				display: ['var(--font-display)', 'Georgia', 'serif'],
			},
			animation: {
				'fade-up': 'fade-up 0.7s ease-out forwards',
				'fade-in': 'fade-in 0.5s ease-out forwards',
			},
			keyframes: {
				'fade-up': {
					from: { opacity: '0', transform: 'translateY(12px)' },
					to: { opacity: '1', transform: 'translateY(0)' },
				},
				'fade-in': {
					from: { opacity: '0' },
					to: { opacity: '1' },
				},
			},
		},
	},
	daisyui: {
		themes: [
			{
				quickrefine: {
					primary: '#0d5c63',
					secondary: '#8b5a2b',
					accent: '#1d6f8c',
					neutral: '#292524',
					'base-100': '#faf8f5',
					'base-200': '#f0ebe3',
					'base-300': '#e0d8cc',
					'base-content': '#1c1917',
					info: '#1d6f8c',
					success: '#1b4332',
					warning: '#a16207',
					error: '#991b1b',
				},
			},
		],
	},
	plugins: [require('daisyui')],
} satisfies Config;
