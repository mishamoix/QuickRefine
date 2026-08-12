import { CodeBracketIcon, EnvelopeIcon } from '@heroicons/react/24/outline';
import { GITHUB_URL, SUPPORT_EMAIL } from '@/config';

export default function Footer() {
	return (
		<footer className='mt-auto border-t-[3px] border-black bg-black px-6 py-8 text-white sm:px-10 lg:px-14'>
			<div className='mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 sm:flex-row'>
				<div className='text-center sm:text-left'>
					<div className='font-display text-lg uppercase'>QuickRefine</div>
					<p className='mt-1 text-sm font-medium'>Fix it. Understand it.</p>
				</div>
				<div className='flex flex-wrap items-center justify-center gap-3'>
					<a href={GITHUB_URL} className='btn btn-sm neo-button gap-1.5 bg-primary focus-visible:outline-white'>
						<CodeBracketIcon className='size-5' />
						GitHub
					</a>
					<a
						href={`mailto:${SUPPORT_EMAIL}`}
						className='btn btn-sm neo-button gap-1.5 bg-secondary focus-visible:outline-white'
					>
						<EnvelopeIcon className='size-5' />
						Email
					</a>
				</div>
				<p className='text-center text-sm font-bold sm:text-right'>
					© {new Date().getFullYear()} QUICKREFINE
				</p>
			</div>
		</footer>
	);
}
