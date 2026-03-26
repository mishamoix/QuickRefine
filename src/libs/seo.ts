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
	return {
		metadataBase: new URL(`https://${config.domainName}`),
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
		},
		twitter: {
			title: openGraph?.title || config.appName,
			description: openGraph?.description || config.appDescription,
			card: 'summary_large_image',
			creator: '',
		},
		...(iosIcon && {
			icons: {
				apple: [
					{
						url: iosIcon.url,
						sizes: iosIcon.sizes || '180x180',
						type: 'image/png',
					},
				],
			},
		}),
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
