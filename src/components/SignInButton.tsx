'use client';

import { signIn } from 'next-auth/react';
import config from '@/config';

const SignInButton = () => {
	const handleClick = () => {
		signIn('google', { callbackUrl: config.auth.callbackUrl });
	};

	return (
		<button
			className='btn btn-sm neo-button bg-white'
			onClick={handleClick}
		>
			Sign In
		</button>
	);
};

export default SignInButton;
