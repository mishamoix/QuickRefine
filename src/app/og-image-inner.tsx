import { IconMarkContent } from './og-icon-mark';

/**
 * JSX for `next/og` ImageResponse — Satori requires explicit display on multi-child divs.
 */
export function OpenGraphImageContent() {
	const markSize = 96;

	return (
		<div
			style={{
				height: '100%',
				width: '100%',
				display: 'flex',
				flexDirection: 'column',
				padding: '56px 64px',
				background:
					'radial-gradient(ellipse 90% 70% at 12% 8%, rgba(13, 92, 99, 0.14), transparent 52%), radial-gradient(ellipse 70% 50% at 92% 88%, rgba(139, 90, 43, 0.1), transparent 45%), linear-gradient(165deg, #faf8f5 0%, #f0ebe3 48%, #e8dfd2 100%)',
				fontFamily: 'DM Sans',
			}}
		>
			<div
				style={{
					display: 'flex',
					flexDirection: 'row',
					alignItems: 'center',
					gap: 24,
				}}
			>
				<div
					style={{
						display: 'flex',
						flexDirection: 'row',
						alignItems: 'center',
						justifyContent: 'center',
						filter: 'drop-shadow(0 10px 22px rgba(13, 92, 99, 0.35))',
					}}
				>
					<IconMarkContent sizePx={markSize} />
				</div>
				<div
					style={{
						fontSize: 40,
						fontWeight: 600,
						color: '#0d5c63',
						letterSpacing: '-0.02em',
					}}
				>
					QuickRefine
				</div>
			</div>

			<div
				style={{
					display: 'flex',
					flexDirection: 'column',
					flexGrow: 1,
					flexShrink: 1,
					justifyContent: 'center',
					paddingTop: 24,
					paddingBottom: 24,
				}}
			>
				<div
					style={{
						display: 'flex',
						flexDirection: 'column',
						gap: 12,
					}}
				>
					<div
						style={{
							display: 'flex',
							flexDirection: 'row',
							flexWrap: 'wrap',
							alignItems: 'baseline',
							fontSize: 88,
							fontWeight: 700,
							lineHeight: 1.05,
							color: '#1c1917',
							letterSpacing: '-0.03em',
						}}
					>
						<span>Your English,</span>
						<span style={{ color: '#0d5c63' }}> refined</span>
					</div>
					<div
						style={{
							fontSize: 88,
							fontWeight: 700,
							lineHeight: 1.05,
							color: '#1c1917',
							letterSpacing: '-0.03em',
						}}
					>
						and explained.
					</div>
				</div>
			</div>
		</div>
	);
}
