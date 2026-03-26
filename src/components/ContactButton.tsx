'use client';

import React from 'react';
import { EnvelopeIcon } from '@heroicons/react/24/outline';
import { SUPPORT_EMAIL } from '@/config';

const ContactButton: React.FC = () => {
	return (
		<a
			href={`mailto:${SUPPORT_EMAIL}`}
			className='btn btn-primary fixed bottom-5 right-4 z-50 gap-2 rounded-full border-0 shadow-lg shadow-primary/25 ring-2 ring-base-100 max-sm:btn-sm'
		>
			<EnvelopeIcon className='size-5 sm:size-6' aria-hidden='true' />
			<span className='max-sm:hidden'>Contact</span>
		</a>
	);
};

export default ContactButton;
