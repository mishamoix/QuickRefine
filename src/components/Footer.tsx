import React from 'react';
import { CodeBracketIcon, EnvelopeIcon } from '@heroicons/react/24/outline';
import config, { GITHUB_URL } from '@/config';
import { SUPPORT_EMAIL } from '@/config';
const Footer: React.FC = () => {
	const currentYear = new Date().getFullYear();

	return (
		<footer className='mt-auto border-t border-base-300/80 bg-base-200/50 px-6 py-8 text-base-content backdrop-blur-sm sm:px-10 lg:px-14'>
			<div className='mx-auto flex max-w-5xl flex-col items-center justify-between gap-6 sm:flex-row sm:items-start'>
				<div className='text-center sm:text-left'>
					<div className='font-display text-lg font-semibold'>QuickRefine</div>
					<p className='mt-1 text-sm text-base-content/60'>
						AI-assisted proofreading for clearer English
					</p>
				</div>
				<div className='flex flex-wrap items-center justify-center gap-2'>
					<a
						href={GITHUB_URL}
						className='btn btn-ghost btn-sm gap-1.5 font-normal text-base-content/80 hover:bg-base-300/50'
					>
						<CodeBracketIcon className='size-5' />
						GitHub
					</a>
					<a
						href={`mailto:${SUPPORT_EMAIL}`}
						className='btn btn-ghost btn-sm gap-1.5 font-normal text-base-content/80 hover:bg-base-300/50'
					>
						<EnvelopeIcon className='size-5' />
						Email
					</a>
				</div>
				<p className='text-center text-sm text-base-content/50 sm:text-right'>
					© {currentYear} QuickRefine
				</p>
			</div>
		</footer>
	);
};

export default Footer;
