import './globals.css';
import Navbar from '@/components/Header';
import Footer from '@/components/Footer';
import { getSEOTags } from '@/libs/seo';
import ClientLayout from '@/components/LayoutClient';
import Script from 'next/script';
import { Archivo_Black, Space_Grotesk } from 'next/font/google';
import config from '@/config';

const spaceGrotesk = Space_Grotesk({
	subsets: ['latin'],
	variable: '--font-sans',
	display: 'swap',
});

const archivoBlack = Archivo_Black({
	subsets: ['latin'],
	weight: '400',
	variable: '--font-display',
	display: 'swap',
});

export const metadata = getSEOTags();

const jsonLd = {
	'@context': 'https://schema.org',
	'@type': 'SoftwareApplication',
	name: 'QuickRefine',
	applicationCategory: 'EducationalApplication',
	operatingSystem: 'Web',
	description: config.appDescription,
	url: `https://${config.domainName}/`,
	offers: {
		'@type': 'Offer',
		price: '0',
		priceCurrency: 'USD',
	},
} as const;

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html
			lang='en'
			data-theme='quickrefine'
			className={`${spaceGrotesk.variable} ${archivoBlack.variable} scroll-smooth`}
		>
			<body className='flex min-h-screen flex-col font-sans antialiased'>
				<script
					type='application/ld+json'
					dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
				/>
				<Script
					defer
					strategy='afterInteractive'
					data-domain='quickrefine.com'
					src='https://plausible.bizarrefusion.com/js/script.file-downloads.outbound-links.pageview-props.tagged-events.js'
				/>
				<Script id='plausible-init' strategy='afterInteractive'>
					{`
      window.plausible = window.plausible || function() {
        (window.plausible.q = window.plausible.q || []).push(arguments)
      }
    `}
				</Script>
				<ClientLayout>
					<Navbar />
					<main className='flex-grow'>{children}</main>
				</ClientLayout>
				<Footer />
			</body>
		</html>
	);
}
