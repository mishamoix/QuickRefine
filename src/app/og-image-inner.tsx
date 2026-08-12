import { IconMarkContent } from './og-icon-mark';

/** Neobrutalist social card for next/og ImageResponse. */
export function OpenGraphImageContent() {
	return (
		<div
			style={{
				height: '100%',
				width: '100%',
				display: 'flex',
				flexDirection: 'column',
				padding: '48px 56px',
				background: '#f5f0e6',
				color: '#000000',
				fontFamily: 'Space Grotesk',
			}}
		>
			<div
				style={{
					display: 'flex',
					flexDirection: 'row',
					alignItems: 'center',
					justifyContent: 'space-between',
				}}
			>
				<div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
					<div style={{ display: 'flex', border: '3px solid #000000', boxShadow: '6px 6px 0 #000000' }}>
						<IconMarkContent sizePx={76} />
					</div>
					<div
						style={{
							fontFamily: 'Archivo Black',
							fontSize: 34,
							textTransform: 'uppercase',
						}}
					>
						QuickRefine
					</div>
				</div>
				<div
					style={{
						display: 'flex',
						background: '#ff4081',
						border: '3px solid #000000',
						boxShadow: '5px 5px 0 #000000',
						padding: '10px 16px',
						fontWeight: 700,
						textTransform: 'uppercase',
					}}
				>
					English proofreading
				</div>
			</div>

			<div
				style={{
					display: 'flex',
					flexDirection: 'column',
					flexGrow: 1,
					justifyContent: 'center',
					fontFamily: 'Archivo Black',
					fontSize: 82,
					lineHeight: 0.94,
					letterSpacing: '-0.04em',
					textTransform: 'uppercase',
				}}
			>
				<div style={{ display: 'flex' }}>Fix it.</div>
				<div
					style={{
						display: 'flex',
						alignSelf: 'flex-start',
						background: '#ffeb3b',
						border: '3px solid #000000',
						padding: '4px 12px',
					}}
				>
					Understand it.
				</div>
			</div>
		</div>
	);
}
