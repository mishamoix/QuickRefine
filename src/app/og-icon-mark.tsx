/** Shared neobrutalist proofreading mark for generated icons. */
export function IconMarkContent({ sizePx }: { sizePx: number }) {
	const border = Math.max(2, Math.round(sizePx * 0.08));
	const pad = Math.max(4, Math.round(sizePx * 0.18));
	const gap = Math.max(2, Math.round(sizePx * 0.1));
	const barH = Math.max(2, Math.round(sizePx * 0.1));
	const innerW = sizePx - pad * 2;

	return (
		<div
			style={{
				width: sizePx,
				height: sizePx,
				boxSizing: 'border-box',
				border: `${border}px solid #000000`,
				display: 'flex',
				flexDirection: 'column',
				justifyContent: 'center',
				padding: pad - border,
				gap,
				background: '#ffeb3b',
			}}
		>
			<div style={{ display: 'flex', width: innerW, height: barH, background: '#000000' }} />
			<div
				style={{
					display: 'flex',
					width: Math.round(innerW * 0.62),
					height: barH,
					alignSelf: 'flex-end',
					background: '#ff4081',
					border: `${Math.max(1, Math.round(border / 2))}px solid #000000`,
				}}
			/>
			<div style={{ display: 'flex', width: innerW, height: barH, background: '#000000' }} />
		</div>
	);
}
