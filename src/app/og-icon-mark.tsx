/**
 * Shared mark for favicon / apple-icon (next/og + Satori).
 * “Lines with edit” — suggests proofreading without a plain letter Q.
 */
export function IconMarkContent({ sizePx }: { sizePx: number }) {
	const pad = Math.max(4, Math.round(sizePx * 0.2));
	const gap = Math.max(2, Math.round(sizePx * 0.12));
	const barH = Math.max(2, Math.round(sizePx * 0.1));
	const innerW = sizePx - pad * 2;
	const midW = Math.round(innerW * 0.52);
	const radius = Math.max(2, Math.round(barH * 0.5));

	return (
		<div
			style={{
				width: sizePx,
				height: sizePx,
				borderRadius: Math.round(sizePx * 0.22),
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'stretch',
				justifyContent: 'center',
				paddingLeft: pad,
				paddingRight: pad,
				paddingTop: pad,
				paddingBottom: pad,
				gap,
				background:
					'linear-gradient(155deg, #0f7a85 0%, #0d5c63 38%, #084249 72%, #062f34 100%)',
				boxShadow:
					'inset 0 1px 0 rgba(255,255,255,0.18), inset 0 -2px 6px rgba(0,0,0,0.22)',
			}}
		>
			<div
				style={{
					display: 'flex',
					flexDirection: 'row',
					alignItems: 'center',
					height: barH,
					width: innerW,
					borderRadius: radius,
					background: 'rgba(250, 248, 245, 0.94)',
				}}
			/>
			<div
				style={{
					display: 'flex',
					flexDirection: 'row',
					alignItems: 'center',
					justifyContent: 'flex-end',
					height: barH,
					width: innerW,
				}}
			>
				<div
					style={{
						height: barH,
						width: midW,
						borderRadius: radius,
						background: 'linear-gradient(90deg, #e8c088 0%, #c17f59 100%)',
						boxShadow: '0 0 0 1px rgba(0,0,0,0.08)',
					}}
				/>
			</div>
			<div
				style={{
					display: 'flex',
					flexDirection: 'row',
					alignItems: 'center',
					height: barH,
					width: innerW,
					borderRadius: radius,
					background: 'rgba(250, 248, 245, 0.94)',
				}}
			/>
		</div>
	);
}
