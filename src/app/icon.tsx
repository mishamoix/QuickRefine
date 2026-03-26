import { ImageResponse } from 'next/og';
import { IconMarkContent } from './og-icon-mark';

export const size = { width: 32, height: 32 };
export const contentType = 'image/png';

export default function Icon() {
	return new ImageResponse(<IconMarkContent sizePx={32} />, {
		...size,
	});
}
