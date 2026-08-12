export default function HowItWorks() {
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
					<div className='aspect-video border-2 border-black'>
						<iframe
							src='https://www.youtube.com/embed/SCVaz8DoZQQ'
							title='How QuickRefine works'
							allow='accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture'
							allowFullScreen
							className='h-full w-full'
						/>
					</div>
				</div>
			</div>
		</section>
	);
}
