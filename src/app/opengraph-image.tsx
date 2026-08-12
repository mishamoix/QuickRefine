import { ImageResponse } from 'next/og';
import { getQuickRefineOgFonts } from '@/libs/og-fonts';
import { OpenGraphImageContent } from './og-image-inner';

export const alt = 'QuickRefine — Fix it. Understand it.';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function OpenGraphImage() {
	const fonts = await getQuickRefineOgFonts();
	return new ImageResponse(<OpenGraphImageContent />, {
		...size,
		fonts,
	});
}
