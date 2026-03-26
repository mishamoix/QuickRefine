import { ImageResponse } from 'next/og';
import { getDmSansOgFonts } from '@/libs/og-fonts';
import { OpenGraphImageContent } from './og-image-inner';

export const alt = 'QuickRefine — AI English proofreader';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function OpenGraphImage() {
	const fonts = await getDmSansOgFonts();
	return new ImageResponse(<OpenGraphImageContent />, {
		...size,
		fonts,
	});
}
