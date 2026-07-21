export default function Features() {
	return (
		<section className='mx-auto max-w-5xl padding'>
			<h2 className='text-center font-display text-3xl font-semibold tracking-tight text-base-content md:text-4xl'>
				It teaches while it fixes
			</h2>
			<p className='mx-auto mt-3 max-w-xl text-center text-base text-base-content/65'>
				Paste your draft and get it back corrected, with a reason for every
				change. Here is a real example.
			</p>

			<div className='mt-12 grid gap-8 lg:grid-cols-5 lg:gap-10'>
				{/* Annotated before/after example, in the product's own visual language */}
				<div className='card text-left lg:col-span-3'>
					<p className='font-display text-lg font-semibold text-base-content'>
						Your draft
					</p>
					<p className='mt-2 rounded-xl border border-base-300 bg-base-100 px-4 py-3 font-sans text-base leading-relaxed text-base-content'>
						Dear Professor, I am writing for ask about the deadline. I have
						finish my essay, but I need one more day for check it.
					</p>

					<div className='prose-panel mt-4 border-primary/15 bg-base-200/50'>
						<p className='mb-2 text-xs font-semibold uppercase tracking-wider text-primary'>
							Revised text
						</p>
						<p className='font-sans text-base leading-relaxed'>
							Dear Professor, I am writing <strong>to ask</strong> about the
							deadline. I have <strong>finished</strong> my essay, but I need
							one more day <strong>to check</strong> it.
						</p>
					</div>
					<p className='mt-2 text-sm text-base-content/65'>
						Bold text shows what changed.
					</p>

					<p className='mt-4 font-display text-base font-semibold text-base-content'>
						Why it changed
					</p>
					<div className='mt-2 space-y-3'>
						<div className='rounded-lg border border-base-300/80 bg-base-200/40 px-4 py-3'>
							<p className='text-sm leading-relaxed text-base-content/80'>
								<strong className='font-semibold text-base-content'>
									for ask → to ask.
								</strong>{' '}
								After “writing”, use “to” with a verb: “I am writing to ask.”
								The same rule fixes “for check it” → “to check it.”
							</p>
						</div>
						<div className='rounded-lg border border-base-300/80 bg-base-200/40 px-4 py-3'>
							<p className='text-sm leading-relaxed text-base-content/80'>
								<strong className='font-semibold text-base-content'>
									have finish → have finished.
								</strong>{' '}
								After “have”, use the past participle: “I have finished.”
							</p>
						</div>
					</div>
				</div>

				{/* Supporting claims — compact list, not a card grid */}
				<aside className='text-left lg:col-span-2 lg:self-center'>
					<h3 className='font-display text-xl font-semibold text-base-content'>
						What you get
					</h3>
					<ul className='mt-2 divide-y divide-base-300/70'>
						<li className='py-4'>
							<p className='font-medium text-base-content'>
								A reason for every fix
							</p>
							<p className='mt-1 text-sm leading-relaxed text-base-content/70'>
								Every correction comes with the rule behind it, in plain words.
							</p>
						</li>
						<li className='py-4'>
							<p className='font-medium text-base-content'>Help with tone</p>
							<p className='mt-1 text-sm leading-relaxed text-base-content/70'>
								When your text sounds too formal or too casual, you get
								alternative versions to choose from.
							</p>
						</li>
						<li className='py-4'>
							<p className='font-medium text-base-content'>
								Made for short texts
							</p>
							<p className='mt-1 text-sm leading-relaxed text-base-content/70'>
								An email, a message, a short paragraph — up to 600 characters,
								checked in seconds.
							</p>
						</li>
					</ul>
				</aside>
			</div>
		</section>
	);
}
