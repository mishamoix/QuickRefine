'use client';
import React from 'react';

export default function HowItWorks() {
	return (
		<section className='border-y border-base-300/60 bg-base-200/40 padding'>
			<div className='mx-auto max-w-4xl text-center'>
				<h2 className='font-display text-3xl font-semibold tracking-tight text-base-content md:text-4xl'>
					How it works
				</h2>
				<p className='mx-auto mt-3 max-w-2xl text-lg text-base-content/65'>
					Watch a short video: paste your draft, get the corrected text with
					alternative versions, and read the reason for each change.
				</p>
				<div className='mt-10 overflow-hidden rounded-2xl border border-base-300/90 bg-base-100 shadow-sm'>
					<div className='aspect-video'>
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
