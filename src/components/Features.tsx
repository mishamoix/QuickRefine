import React, { useMemo } from 'react';
import {
	AcademicCapIcon,
	PencilSquareIcon,
	RocketLaunchIcon,
} from '@heroicons/react/24/outline';

export default function Features() {
	const features = useMemo(
		() => [
			{
				title: 'Expert Guidance',
				description:
					'Receive expert feedback and insights to level up your writing.',
				icon: AcademicCapIcon,
			},
			{
				title: 'Instant Proofreading',
				description:
					'Get instant proofreading opinion to improve your English.',
				icon: PencilSquareIcon,
			},
			{
				title: 'Boost Productivity',
				description:
					'Enhance efficiency with smart tools designed for learners.',
				icon: RocketLaunchIcon,
			},
		],
		[]
	);

	return (
		<section className='mx-auto max-w-5xl padding'>
			<h2 className='text-center font-display text-3xl font-semibold tracking-tight text-base-content md:text-4xl'>
				Why writers use it
			</h2>
			<p className='mx-auto mt-3 max-w-xl text-center text-base text-base-content/65'>
				Built for learners and professionals who want corrections with context—not
				just a red underline.
			</p>
			<div className='mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3'>
				{features.map((feature, index) => {
					const Icon = feature.icon;
					return (
						<article
							key={index}
							className='group relative overflow-hidden rounded-2xl border border-base-300/80 bg-base-100/90 p-6 text-left shadow-sm transition duration-300 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md'
						>
							<div className='mb-4 inline-flex rounded-xl bg-primary/10 p-3 text-primary transition group-hover:bg-primary/15'>
								<Icon className='size-8' aria-hidden />
							</div>
							<h3 className='font-display text-xl font-semibold text-base-content'>
								{feature.title}
							</h3>
							<p className='mt-2 text-sm leading-relaxed text-base-content/70'>
								{feature.description}
							</p>
						</article>
					);
				})}
			</div>
		</section>
	);
}
