import type { Metadata } from 'next';
import config from '@/config';

export const getSEOTags = ({
	title,
	description,
	keywords,
	openGraph,
	canonicalUrlRelative,
	iosIcon,
	extraTags,
}: Metadata & {
	canonicalUrlRelative?: string;
	iosIcon?: {
		url: string;
		sizes?: string;
	};
	extraTags?: Record<string, any>;
} = {}) => {
	const defaultImageUrl = `https://${config.domainName}/og-image.png`; // Add your default image URL here
	const defaultIconUrl = `https://${config.domainName}/apple-touch-icon.png`; // Default iOS icon

	return {
		title: title || config.appName,
		description: description || config.appDescription,
		keywords: keywords || [config.appName],
		applicationName: config.appName,
		openGraph: {
			title: openGraph?.title || config.appName,
			description: openGraph?.description || config.appDescription,
			url: openGraph?.url || `https://${config.domainName}/`,
			siteName: openGraph?.title || config.appName,
			locale: 'en_US',
			type: 'website',
			images: [
				{
					url: defaultImageUrl,
					alt: openGraph?.title || config.appName,
				},
			],
		},
		twitter: {
			title: openGraph?.title || config.appName,
			description: openGraph?.description || config.appDescription,
			card: 'summary_large_image',
			creator: '',
			images: [defaultImageUrl],
		},
		icons: {
			icon: [{ url: '/favicon.ico' }],
			apple: [
				{
					url: iosIcon?.url || defaultIconUrl,
					sizes: iosIcon?.sizes || '180x180',
					type: 'image/png',
				},
			],
		},
		// iOS specific meta tags
		other: {
			'apple-mobile-web-app-capable': 'yes',
			'apple-mobile-web-app-status-bar-style': 'black',
			'apple-mobile-web-app-title': title || config.appName,
		},
		...(canonicalUrlRelative && {
			alternates: { canonical: canonicalUrlRelative },
		}),
		...extraTags,
	};
};
