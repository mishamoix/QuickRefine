'use client';

import SignInButton from './SignInButton';
import { useSession, signOut } from 'next-auth/react';

export default function Header() {
	const { data: session, status } = useSession();

	return (
		<header className='fixed inset-x-0 top-0 z-50 flex h-16 items-center justify-between border-b-[3px] border-black bg-primary px-4 sm:px-8 lg:px-12'>
			<a
				href='/'
				className='font-display text-lg uppercase tracking-tight text-black focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-black sm:text-xl'
			>
				QuickRefine
			</a>
			{status === 'loading' ? (
				<div className='loading loading-dots loading-sm text-black' />
			) : status === 'authenticated' && session ? (
				<div className='flex items-center gap-3'>
					<p className='hidden text-sm font-bold text-black sm:block'>
						HEY, {(session.user.name || 'FRIEND').toUpperCase()}
					</p>
					<button
						type='button'
						className='btn btn-sm neo-button bg-white'
						onClick={() => signOut()}
					>
						Sign out
					</button>
				</div>
			) : (
				<SignInButton />
			)}
		</header>
	);
}
