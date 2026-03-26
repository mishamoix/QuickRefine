import { ImageResponse } from 'next/og';
import { IconMarkContent } from './og-icon-mark';

export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

export default function AppleIcon() {
	const markSize = 128;

	return new ImageResponse(
		(
			<div
				style={{
					width: '100%',
					height: '100%',
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					justifyContent: 'center',
					background:
						'radial-gradient(ellipse 90% 80% at 35% 15%, rgba(13, 92, 99, 0.12), transparent 45%), linear-gradient(168deg, #faf8f5 0%, #efe8dc 55%, #e5d9c8 100%)',
					fontFamily:
						'ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, sans-serif',
				}}
			>
				<div
					style={{
						display: 'flex',
						flexDirection: 'row',
						alignItems: 'center',
						justifyContent: 'center',
						filter: 'drop-shadow(0 14px 28px rgba(13, 92, 99, 0.35))',
					}}
				>
					<IconMarkContent sizePx={markSize} />
				</div>
			</div>
		),
		{
			...size,
		},
	);
}
