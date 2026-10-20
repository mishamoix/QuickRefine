'use client';

import { useRef, useState } from 'react';

export default function HowItWorks() {
	const video = useRef<HTMLVideoElement>(null);
	const hideTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
	const [playing, setPlaying] = useState(false);
	const [active, setActive] = useState(false);
	const showControls = !playing || active;

	// Mouse move or tap reveals the controls; they fade again after a pause.
	const reveal = () => {
		setActive(true);
		clearTimeout(hideTimer.current);
		hideTimer.current = setTimeout(() => setActive(false), 2500);
	};

	const toggle = () => {
		const v = video.current;
		if (!v) return;
		if (v.paused) v.play().catch(() => {});
		else v.pause();
	};

	return (
		<section className='border-y-[3px] border-black bg-accent padding'>
			<div className='mx-auto max-w-5xl'>
				<div className='grid gap-5 text-left md:grid-cols-[1fr_1fr] md:items-end'>
					<h2 className='neo-section-title'>See it in action</h2>
					<p className='text-lg font-bold leading-relaxed text-black'>
						Paste your draft. Get a clean revision, useful alternatives, short
						explanations, and a one-sentence meaning check.
					</p>
				</div>
				<div className='mt-10 border-[3px] border-black bg-white p-2 shadow-[8px_8px_0_#000]'>
					<div
						className={`relative aspect-video border-2 border-black ${showControls ? '' : 'cursor-none'}`}
						onPointerMove={reveal}
						onPointerDown={reveal}
						onMouseLeave={() => setActive(false)}
					>
						<video
							ref={video}
							src='/demo.mp4'
							poster='/demo-poster.jpg'
							preload='metadata'
							playsInline
							loop
							aria-label='How QuickRefine works'
							onPlay={() => setPlaying(true)}
							onPause={() => setPlaying(false)}
							className='h-full w-full'
						/>
						<div className='pointer-events-none absolute inset-0 grid place-items-center'>
							<button
								type='button'
								onClick={toggle}
								aria-label={playing ? 'Pause demo' : 'Play demo'}
								className={`btn neo-button h-16 w-16 p-0 transition-opacity duration-200 focus-visible:opacity-100 md:h-20 md:w-20 ${showControls ? 'pointer-events-auto opacity-100' : 'opacity-0'}`}
							>
								{playing ? (
									<svg viewBox='0 0 24 24' className='h-8 w-8' aria-hidden='true'>
										<path d='M6 4h4v16H6zM14 4h4v16h-4z' fill='currentColor' />
									</svg>
								) : (
									<svg viewBox='0 0 24 24' className='h-8 w-8' aria-hidden='true'>
										<path d='M7 4v16l13-8z' fill='currentColor' />
									</svg>
								)}
							</button>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
