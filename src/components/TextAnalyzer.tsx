'use client';

import React, { useEffect, useState } from 'react';
import {
	ClipboardDocumentIcon,
	DocumentDuplicateIcon,
	LanguageIcon,
	XMarkIcon,
} from '@heroicons/react/24/outline';
import { cleanText } from '@/libs';
import { useMutation } from '@tanstack/react-query';
import { ApiResponse, EnhancedText } from '@/app/models';
import { toast } from 'react-hot-toast';
import config, { MAX_CHARACTERS } from '@/config';
import { signIn, useSession } from 'next-auth/react';
import { toFriendlyEnhanceError } from '@/libs/enhance-errors';

const SAMPLE_TEXT =
	'I has went to the market yesterday, and buyed some apples—they was fresh.';

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

	const { mutate, data, error, isPending, reset } = useMutation<
		EnhancedText,
		Error,
		{ text: string }
	>({
		mutationFn: async ({ text }) => {
			let response: Response;
			try {
				response = await fetch('/api/enhance/fast', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({ text }),
				});
			} catch {
				throw new Error(
					'Can’t reach the server. Check your connection and try again.',
				);
			}

			let data: ApiResponse;
			try {
				data = await response.json();
			} catch {
				throw new Error(toFriendlyEnhanceError(undefined, response.status));
			}

			if ('error' in data && data.error) {
				throw new Error(toFriendlyEnhanceError(data.error, response.status));
			}

			if (!response.ok) {
				throw new Error(toFriendlyEnhanceError(undefined, response.status));
			}

			return data as EnhancedText;
		},
		retry: 0,
	});

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

	const handleClearText = () => {
		setCurrentText('');
		reset();
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

	const insertSampleText = () => {
		setCurrentText(SAMPLE_TEXT);
		reset();
	};

	const handlePasteFromClipboard = async () => {
		try {
			if (navigator.permissions && navigator.permissions.query) {
				try {
					const permissionStatus = await navigator.permissions.query({
						name: 'clipboard-read' as PermissionName,
					});
					if (permissionStatus.state === 'denied') {
						toast.error('Clipboard access denied. Please allow it in browser settings.', {
							id: 'clipboard-denied',
							duration: 3000,
						});
						return;
					}
				} catch {
					// Safari/Firefox don't support clipboard-read permission query — proceed anyway
				}
			}

			const clipboardText = await navigator.clipboard.readText();
			if (clipboardText) {
				setCurrentText(clipboardText);
				reset();
				toast.success('Text pasted from clipboard', {
					id: 'paste-text',
					duration: 2000,
				});
			} else {
				toast.error('Clipboard is empty', {
					id: 'clipboard-empty',
					duration: 2000,
				});
			}
		} catch {
			toast.error('Failed to read clipboard. Please paste manually (Ctrl+V / ⌘+V).', {
				id: 'clipboard-error',
				duration: 3000,
			});
		}
	};

	return (
		<div className='mt-16 max-md:mt-12'>
			<div className='space-y-8'>
				<div className='card text-left'>
					<form onSubmit={handleSubmit} className='space-y-4'>
						<div className='flex items-end justify-between gap-3'>
							<label htmlFor='draft-text' className='font-display text-lg font-semibold text-base-content'>
								Your draft
							</label>
							<span
								className={`tabular-nums text-xs font-medium ${
									isOverLimit ? 'text-error' : 'text-base-content/45'
								}`}
								aria-live='polite'
							>
								{characterCount} / {MAX_CHARACTERS}
							</span>
						</div>
						<div className='relative'>
							<textarea
								id='draft-text'
								name='text'
								value={currentText}
								onChange={handleTextChange}
								onKeyDown={handleKeyDown}
								placeholder='Paste or write here. Example: “I has went to the market yesterday, and buyed some apples—they was fresh.”'
								rows={8}
								className={`textarea textarea-bordered w-full resize-y rounded-xl border-base-300 bg-base-100 px-4 py-3 pr-12 font-sans text-base leading-relaxed text-base-content placeholder:text-base-content/35 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 ${
									isOverLimit ? 'textarea-error border-error focus:ring-error/25' : ''
								}`}
							/>
							{currentText ? (
								<button
									type='button'
									onClick={handleClearText}
									className='btn btn-ghost btn-sm btn-square absolute right-2 top-2 text-base-content/50 hover:bg-base-200 hover:text-base-content'
									title='Clear text'
									aria-label='Clear text'
								>
									<XMarkIcon className='size-5' />
								</button>
							) : null}
						</div>

						{!hasAnyText ? (
							<div className='rounded-xl border border-dashed border-base-300/90 bg-base-200/40 px-4 py-3 text-left'>
								<p className='text-sm text-base-content/70'>
									<span className='font-medium text-base-content'>Stuck?</span> Load a sample sentence to
									try the tool.
								</p>
								<button
									type='button'
									onClick={insertSampleText}
									className='btn btn-link h-auto min-h-0 px-0 font-normal text-primary'
								>
									Insert sample text
								</button>
							</div>
						) : null}

						{error ? (
							<div
								className='flex items-start gap-3 rounded-xl border border-error/30 bg-error/5 px-4 py-3 text-sm text-error'
								role='alert'
							>
								<LanguageIcon className='size-5 shrink-0' aria-hidden />
								<span>{error.message}</span>
							</div>
						) : null}

						<div className='flex flex-col gap-3 pt-1 sm:flex-row sm:items-center sm:justify-between'>
							<p className='order-2 text-xs text-base-content/50 sm:order-1'>
								<span className='font-medium text-base-content/70'>Tip:</span> Enter submits; Shift+Enter
								for a new line.
							</p>
							<div className='order-1 flex flex-wrap items-center justify-end gap-2 sm:order-2'>
								{data ? (
									<button
										type='button'
										onClick={() => reset()}
										className='btn btn-ghost rounded-lg text-base-content/70 hover:bg-base-200'
									>
										Clear results
									</button>
								) : null}
								<button
									type='button'
									onClick={handlePasteFromClipboard}
									className='btn btn-ghost border border-base-300/80 bg-base-200/50 hover:bg-base-300/50'
									title='Paste from clipboard'
									aria-label='Paste from clipboard'
								>
									<ClipboardDocumentIcon className='size-5' />
									<span className='hidden sm:inline'>Paste</span>
								</button>
								<button
									type='submit'
									className={`btn btn-primary min-w-[10rem] rounded-xl px-6 ${
										!isTextValid || isPending ? 'btn-disabled' : ''
									}`}
									disabled={!isTextValid || isPending}
								>
									{isPending || status === 'loading' ? (
										<span className='loading loading-dots loading-sm' />
									) : isLoggedIn ? (
										'Analyze'
									) : (
										'Sign in to analyze'
									)}
								</button>
							</div>
						</div>
					</form>

					{data?.text ? (
						<div className='prose-panel relative mt-6 border-primary/15 bg-base-200/50 pr-12 sm:pr-24'>
							<button
								type='button'
								onClick={() => copyText(data.text)}
								className='btn btn-ghost btn-sm absolute right-2 top-2 gap-1 rounded-lg'
								title='Copy revised text'
							>
								<DocumentDuplicateIcon className='size-4' />
								<span className='hidden sm:inline'>Copy</span>
							</button>
							<p className='mb-2 text-xs font-semibold uppercase tracking-wider text-primary'>
								Revised text
							</p>
							<div
								className='whitespace-pre-wrap font-sans text-base leading-relaxed'
								dangerouslySetInnerHTML={{
									__html: data.text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>'),
								}}
							/>
						</div>
					) : null}
				</div>
			</div>
		</div>
	);
}
