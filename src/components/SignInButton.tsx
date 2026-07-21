'use client';

import { signIn } from 'next-auth/react';
import config from '@/config';

const SignInButton = () => {
	const handleClick = () => {
		signIn('google', { callbackUrl: config.auth.callbackUrl });
	};

	return (
		<button
			className='btn btn-ghost btn-sm font-medium text-base-content/70 hover:bg-base-200'
			onClick={handleClick}
		>
			Sign In
		</button>
	);
};

export default SignInButton;
