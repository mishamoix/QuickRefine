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
				sans: ['var(--font-sans)', 'Arial', 'sans-serif'],
				display: ['var(--font-display)', 'Impact', 'sans-serif'],
			},
			animation: {
				'fade-up': 'fade-up 0.7s ease-out both',
				'fade-in': 'fade-in 0.5s ease-out both',
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
					primary: '#ffeb3b',
					'primary-content': '#000000',
					secondary: '#ff4081',
					'secondary-content': '#000000',
					accent: '#2196f3',
					'accent-content': '#000000',
					neutral: '#000000',
					'neutral-content': '#ffffff',
					'base-100': '#ffffff',
					'base-200': '#f5f0e6',
					'base-300': '#000000',
					'base-content': '#000000',
					info: '#2196f3',
					success: '#4caf50',
					warning: '#ff9800',
					error: '#ff5252',
				},
			},
		],
	},
	plugins: [require('daisyui')],
} satisfies Config;
