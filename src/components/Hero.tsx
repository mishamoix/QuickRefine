'use client';

export default function Hero() {
	return (
		<div className='relative mx-auto mt-16 max-w-4xl text-left max-sm:mt-8'>
			<p className='inline-block border-2 border-black bg-secondary px-3 py-1 font-sans text-sm font-bold uppercase tracking-wider text-black shadow-[3px_3px_0_#000] motion-safe:animate-fade-up'>
				English that makes sense
			</p>
			<h1 className='mt-6 font-display text-[clamp(2.75rem,8vw,6.5rem)] uppercase leading-[0.9] tracking-[-0.04em] text-black motion-safe:animate-fade-up motion-safe:animate-delay-100'>
				Fix it.
				<br />
				<span className='inline-block bg-primary px-2'>Understand it.</span>
			</h1>
			<div className='mt-7 grid items-start gap-5 md:grid-cols-[1fr_auto] motion-safe:animate-fade-up motion-safe:animate-delay-200'>
				<p className='max-w-2xl text-lg font-medium leading-relaxed text-black md:text-xl'>
					Proofread short English texts, see every correction, and confirm what
					your message actually means.
				</p>
				<span className='inline-block rotate-2 border-2 border-black bg-accent px-4 py-2 font-display text-sm uppercase text-black shadow-[4px_4px_0_#000]'>
					Up to 600 characters
				</span>
			</div>
		</div>
	);
}
