const benefits = [
	{
		number: '01',
		title: 'A reason for every fix',
		text: 'Every correction comes with a short explanation in plain English.',
		color: 'bg-primary',
	},
	{
		number: '02',
		title: 'Better ways to say it',
		text: 'Choose a version that sounds more natural, concise, or professional.',
		color: 'bg-secondary',
	},
	{
		number: '03',
		title: 'A meaning check',
		text: 'Confirm your message says what you intended before you send it.',
		color: 'bg-accent',
	},
];

export default function Features() {
	return (
		<section className='mx-auto max-w-6xl padding'>
			<div className='grid gap-5 md:grid-cols-[1fr_1fr] md:items-end'>
				<h2 className='neo-section-title'>Learn from every edit</h2>
				<p className='text-lg font-bold leading-relaxed text-black'>
					QuickRefine does not just hand back polished text. It shows what
					changed and helps you understand why.
				</p>
			</div>

			<div className='mt-12 grid gap-8 lg:grid-cols-5'>
				<div className='card text-left lg:col-span-3'>
					<p className='font-display text-lg uppercase text-black'>Your draft</p>
					<p className='mt-3 border-[3px] border-black bg-base-200 px-4 py-3 text-base font-medium leading-relaxed text-black'>
						Dear Professor, I am writing for ask about the deadline. I have
						finish my essay, but I need one more day for check it.
					</p>

					<div className='prose-panel mt-5 bg-primary'>
						<p className='mb-2 font-display text-sm uppercase text-black'>
							Revised text
						</p>
						<p className='text-base font-medium leading-relaxed'>
							Dear Professor, I am writing <strong>to ask</strong> about the
							deadline. I have <strong>finished</strong> my essay, but I need
							one more day <strong>to check</strong> it.
						</p>
					</div>

					<p className='mt-5 font-display text-base uppercase text-black'>
						Why it changed
					</p>
					<div className='mt-3 space-y-3'>
						<div className='border-2 border-black bg-white px-4 py-3'>
							<p className='text-sm font-medium leading-relaxed text-black'>
								<strong>for ask → to ask.</strong> After “writing”, use “to”
								with a verb. The same rule fixes “for check it”.
							</p>
						</div>
						<div className='border-2 border-black bg-white px-4 py-3'>
							<p className='text-sm font-medium leading-relaxed text-black'>
								<strong>have finish → have finished.</strong> After “have”, use
								the past participle.
							</p>
						</div>
					</div>
				</div>

				<div className='grid gap-5 lg:col-span-2'>
					{benefits.map((benefit) => (
						<article
							key={benefit.number}
							className={`${benefit.color} border-[3px] border-black p-5 shadow-[5px_5px_0_#000]`}
						>
							<p className='font-display text-sm text-black'>{benefit.number}</p>
							<h3 className='mt-4 font-display text-xl uppercase leading-tight text-black'>
								{benefit.title}
							</h3>
							<p className='mt-2 font-medium leading-relaxed text-black'>
								{benefit.text}
							</p>
						</article>
					))}
				</div>
			</div>
		</section>
	);
}
