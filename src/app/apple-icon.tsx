import { ImageResponse } from 'next/og';
import { IconMarkContent } from './og-icon-mark';

export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

export default function AppleIcon() {
	return new ImageResponse(
		(
			<div
				style={{
					width: '100%',
					height: '100%',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					background: '#2196f3',
				}}
			>
				<div
					style={{
						display: 'flex',
						border: '4px solid #000000',
						boxShadow: '8px 8px 0 #000000',
					}}
				>
					<IconMarkContent sizePx={124} />
				</div>
			</div>
		),
		{ ...size },
	);
}
