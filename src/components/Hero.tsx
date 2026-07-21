'use client';

import React from 'react';

export default function Hero() {
	return (
		<div className='relative mx-auto mt-20 max-w-3xl max-sm:mt-8'>
			<p className='font-sans text-sm font-medium uppercase tracking-[0.2em] text-primary opacity-90 motion-safe:animate-fade-up'>
				Write with clarity
			</p>
			<h1 className='font-display mt-4 pb-5 text-5xl font-semibold leading-[1.08] tracking-tight text-base-content max-md:pb-4 max-md:text-4xl max-sm:text-[2rem] lg:text-6xl'>
				<span className='inline-block motion-safe:animate-fade-up'>Your English,</span>{' '}
				<span className='inline-block font-semibold italic text-primary motion-safe:animate-fade-up motion-safe:animate-delay-100'>
					refined
				</span>
				<span className='inline-block motion-safe:animate-fade-up motion-safe:animate-delay-200'>
					{' '}
					and explained.
				</span>
			</h1>
			<p className='mx-auto max-w-xl text-lg leading-relaxed text-base-content/65 motion-safe:animate-fade-up motion-safe:animate-delay-300 max-md:text-base'>
				Instant analysis fixes grammar and punctuation, smooths tone, and shows
				why each change matters—so you learn while you edit.
			</p>
		</div>
	);
}
