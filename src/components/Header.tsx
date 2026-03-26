'use client';
import React from 'react';
import config from '@/config';
import SignInButton from './SignInButton';
import { useSession, signOut } from 'next-auth/react';

const Header: React.FC = () => {
	const { data: session, status } = useSession();

	const handleSignOut = () => {
		signOut();
	};

	const ButtonElement = () => {
		if (status === 'loading') {
			return <div className='loading loading-dots loading-sm text-slate-500' />;
		}

		if (status === 'authenticated' && session) {
			return (
				<div className='flex items-center gap-3'>
					<p className='hidden text-sm font-medium text-base-content/80 sm:block'>
						Hey, {session.user.name || 'friend'}
					</p>
					<button
						type='button'
						className='btn btn-ghost btn-sm font-medium text-base-content/70 hover:bg-base-200'
						onClick={handleSignOut}
					>
						Sign out
					</button>
				</div>
			);
		}

		return <SignInButton />;
	};

	return (
		<header className='fixed left-0 right-0 top-0 z-50 flex h-16 items-center justify-between border-b border-base-300/70 bg-base-100/85 px-6 backdrop-blur-md sm:px-10 lg:px-14'>
			<a
				href='/'
				className='font-display text-xl font-semibold tracking-tight text-base-content transition-colors hover:text-primary sm:text-2xl'
			>
				QuickRefine
			</a>
			<ButtonElement />
		</header>
	);
};

export default Header;
