'use client';

import React, { useEffect, useState } from 'react';
import {
	BookOpenIcon,
	CheckCircleIcon,
	ClipboardDocumentListIcon,
	DocumentDuplicateIcon,
	ExclamationCircleIcon,
	LanguageIcon,
	ShieldExclamationIcon,
	XCircleIcon,
} from '@heroicons/react/24/outline';
import { cleanText } from '@/libs';
import { useMutation, QueryClient } from '@tanstack/react-query';
import { ApiResponse, EnhancedText } from '@/app/models';
import { toast } from 'react-hot-toast';
import config, { MAX_CHARACTERS } from '@/config';
import { signIn, useSession } from 'next-auth/react';

export default function TextAnalyzer() {
	const [currentText, setCurrentText] = useState('');

	const cleanedText = cleanText(currentText);
	const characterCount = cleanedText.length;
	const isOverLimit = characterCount > MAX_CHARACTERS;
	const hasAnyText = cleanedText.length > 0;
	const isTextValid = hasAnyText && !isOverLimit;
	const { data: session, status } = useSession();

	useEffect(() => {
		const savedText = localStorage.getItem('current_user_text');
		if (savedText) {
			setCurrentText(savedText);
			localStorage.removeItem('current_user_text');
		}
	}, []);

	const { mutate, data, error, isPending } = useMutation<
		EnhancedText,
		Error,
		{ text: string }
	>({
		mutationFn: async ({ text }) => {
			const response = await fetch('/api/enhance', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ text }),
			});

			const data: ApiResponse = await response.json();
			console.log('data', data);

			if ('error' in data) {
				throw new Error(data.error);
			}

			if (!response.ok) {
				throw new Error('Failed to fetch data');
			}

			return data;
		},
		retry: 0,
	});

	const hasMistakes = data?.mistakes && data?.mistakes.length > 0;

	const isLoggedIn = status === 'authenticated' && session;

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		sendRequestIfCan();
	};

	const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault();
			sendRequestIfCan();
		}
	};

	const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		setCurrentText(e.target.value);
	};

	const sendRequestIfCan = () => {
		if (!isLoggedIn) {
			handleLogin();
			return;
		}

		if (isTextValid && !isPending) {
			mutate({ text: currentText });
		}
	};

	const copyText = (text?: string) => {
		if (text) {
			navigator.clipboard.writeText(text.replace(/\*\*(.*?)\*\*/g, '$1'));
			toast.success('Text copied to clipboard', {
				id: 'copy-text',
				duration: 2000,
			});
		}
	};

	const handleLogin = () => {
		localStorage.setItem('current_user_text', currentText);
		signIn('google', { callbackUrl: config.auth.callbackUrl });
	};

	return (
		<div className='mt-20 space-y-10 max-md:mt-10'>
			<div className='card'>
				<form onSubmit={handleSubmit}>
					<div className='relative pt-4'>
						<textarea
							name='text'
							value={currentText}
							onChange={handleTextChange}
							onKeyDown={handleKeyDown}
							placeholder='Write your text here. e.g. "I has went to the market yesterday, and buyed some apples and they was fresh."'
							className={`w-full max-md:min-h-[25vh] max-sm:min-h-[20vh] min-h-40 text-base-content text-base border rounded-lg px-3 py-2 focus:outline-none focus:ring-1 ${
								isOverLimit
									? 'border-error focus:border-error focus:ring-error'
									: 'border-slate-200 focus:border-primary focus:ring-primary'
							}`}
						/>
						<div className='absolute -top-3 right-1'>
							<p
								className={`text-xs px-1 py-1 max-sm:py-2 rounded ${
									isOverLimit ? 'text-error' : 'text-slate-300'
								}`}
							>
								{characterCount}/{MAX_CHARACTERS}
							</p>
						</div>
					</div>
					<div className='flex items-center justify-between gap-4 pt-4'>
						{error && (
							<div className='flex items-start gap-2'>
								<LanguageIcon className='size-6 text-error' />
								<span className='text-left text-error'>{error.message}</span>
							</div>
						)}
						<p className='flex items-start gap-2 text-slate-800'>
							{data && (
								<>
									{hasMistakes ? (
										<XCircleIcon className='size-6 text-error' />
									) : (
										<CheckCircleIcon className='text-green-500 size-6' />
									)}
									<span className='text-left'>
										{hasMistakes ? 'Mistakes found' : 'No mistakes, excellent!'}
									</span>
								</>
							)}
						</p>
						<button
							type='submit'
							className={`btn btn-primary ${
								!isTextValid || isPending ? 'btn-disabled' : ''
							}`}
						>
							{isPending || status === 'loading' ? (
								<span className='loading loading-dots loading-sm'></span>
							) : isLoggedIn ? (
								'Analyze text'
							) : (
								'Sign In & Analyze'
							)}
						</button>
					</div>
				</form>
				{data && data.mistakes && data.mistakes.length > 0 && data.text && (
					<div className='relative py-2 pl-3 pr-20 mt-4 text-left border border-green-200 rounded text-slate-800 bg-green-50/70'>
						<button
							onClick={() => copyText(data.text)}
							className='absolute top-1 right-1 btn btn-ghost btn-sm'
							title='Copy Text'
						>
							<DocumentDuplicateIcon className='size-4 text-slate-800' />
						</button>
						<span
							dangerouslySetInnerHTML={{
								__html: data.text.replace(
									/\*\*(.*?)\*\*/g,
									'<strong>$1</strong>'
								),
							}}
						/>
					</div>
				)}
			</div>
			{data && data.mistakes && data.mistakes.length > 0 && (
				<div className='space-y-3 card'>
					<p className='flex items-center gap-2 text-lg font-medium text-slate-800'>
						<ExclamationCircleIcon className='size-6 text-error' />
						Grammar Analysis
					</p>
					<div className='flex flex-col gap-4'>
						{data.mistakes.map((mistake, idx) => (
							<div
								key={idx}
								className='p-4 space-y-4 text-left border rounded-md shadow-[inset_0px_0px_8px_rgba(244,63,94,0.3)] border-rose-200 hover:shadow-[inset_0px_2px_4px_rgba(0,0,0,0)] transition-shadow duration-300'
							>
								<div>
									<p className='flex items-center gap-2 mb-3 text-sm font-medium text-error'>
										<ShieldExclamationIcon className='size-4 ' />
										Mistake {idx + 1}:
									</p>
									<p className='text-base font-medium text-emerald-500'>
										<span className='line-through text-error'>
											{mistake.error}
										</span>
										{' →  '}
										{mistake.corrected}
									</p>
									<p className='text-sm text-slate-500'>{mistake.rule}</p>
								</div>
								<div className='border-b border-rose-200 opacity-85' />
								<div className=''>
									<p className='flex items-center gap-2 mb-3 text-sm font-medium text-blue-600 '>
										<BookOpenIcon className='size-4' />
										Explanation:
									</p>
									<p className='block mb-1 text-sm text-blue-600'>
										{mistake.explanation}
									</p>
									<p className='text-sm text-slate-500'>
										<span className='font-medium text-slate-800'>Example:</span>{' '}
										{mistake.example}
									</p>
								</div>
							</div>
						))}
					</div>
				</div>
			)}
		</div>
	);
}
