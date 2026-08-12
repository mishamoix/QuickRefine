'use client';

import React, { useEffect, useRef, useState } from 'react';
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
import { isAuthEnhanceError, toFriendlyEnhanceError } from '@/libs/enhance-errors';
import { parseFastResult, stripBoldMarkers } from '@/libs/parse-fast-result';

const DRAFT_STORAGE_KEY = 'current_user_text';
// Cap stored drafts at the product limit plus slack, so localStorage never balloons.
const DRAFT_MAX_STORED_LENGTH = MAX_CHARACTERS * 2;

/**
 * Renders `**bold**` markers as <strong> elements. Everything stays plain
 * React text nodes, so LLM output can never inject markup.
 */
function BoldText({ text }: { text: string }) {
	const parts = text.split('**');
	return (
		<>
			{parts.map((part, i) =>
				i % 2 === 1 ? <strong key={i}>{part}</strong> : <React.Fragment key={i}>{part}</React.Fragment>,
			)}
		</>
	);
}

export default function TextAnalyzer() {
	const [currentText, setCurrentText] = useState('');
	const [limitAnnouncement, setLimitAnnouncement] = useState('');
	const lastSubmittedTextRef = useRef('');
	const wasOverLimitRef = useRef(false);

	const cleanedText = cleanText(currentText);
	const characterCount = cleanedText.length;
	const isOverLimit = characterCount > MAX_CHARACTERS;
	const hasAnyText = cleanedText.length > 0;
	const isTextValid = hasAnyText && !isOverLimit;
	const { data: session, status } = useSession();

	// Restore the draft on mount. The key is kept (not removed) so a reload
	// mid-draft doesn't lose text; the debounced saver below keeps it in sync.
	useEffect(() => {
		const savedText = localStorage.getItem(DRAFT_STORAGE_KEY);
		if (savedText) {
			setCurrentText(savedText);
		}
	}, []);

	// Persist the draft (debounced) as the user types.
	useEffect(() => {
		const timer = setTimeout(() => {
			if (currentText) {
				localStorage.setItem(
					DRAFT_STORAGE_KEY,
					currentText.slice(0, DRAFT_MAX_STORED_LENGTH),
				);
			} else {
				localStorage.removeItem(DRAFT_STORAGE_KEY);
			}
		}, 500);
		return () => clearTimeout(timer);
	}, [currentText]);

	// Announce only when the draft crosses the limit (or comes back under it) —
	// a live region on the counter itself would chatter on every keystroke.
	useEffect(() => {
		if (isOverLimit && !wasOverLimitRef.current) {
			setLimitAnnouncement(
				`Your text is over the ${MAX_CHARACTERS} character limit.`,
			);
		} else if (!isOverLimit && wasOverLimitRef.current) {
			setLimitAnnouncement('Your text is under the limit again.');
		}
		wasOverLimitRef.current = isOverLimit;
	}, [isOverLimit]);

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
	const parsed = data?.text ? parseFastResult(data.text) : null;
	const meaning = data?.meaning;

	// Shared by the submit button and the Enter shortcut: sign logged-out
	// users in, otherwise run the analysis.
	const submitDraft = () => {
		if (!isLoggedIn) {
			handleLogin();
			return;
		}
		runAnalysis();
	};

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		submitDraft();
	};

	// Enter submits; Shift+Enter inserts a new line. Skip Enter while an IME
	// composition is active so it doesn't submit text mid-composition.
	const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
		if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
			e.preventDefault();
			submitDraft();
		}
	};

	const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		setCurrentText(e.target.value);
	};

	const handleClearText = () => {
		setCurrentText('');
		reset();
	};

	const runAnalysis = () => {
		if (isTextValid && !isPending) {
			lastSubmittedTextRef.current = currentText;
			mutate({ text: currentText });
		}
	};

	const handleRetry = () => {
		const lastText = lastSubmittedTextRef.current;
		if (lastText && !isPending) {
			mutate({ text: lastText });
		}
	};

	const copyText = (text?: string) => {
		if (text) {
			navigator.clipboard.writeText(stripBoldMarkers(text));
			toast.success('Text copied to clipboard', {
				id: 'copy-text',
				duration: 2000,
			});
		}
	};

	const handleLogin = () => {
		localStorage.setItem(
			DRAFT_STORAGE_KEY,
			currentText.slice(0, DRAFT_MAX_STORED_LENGTH),
		);
		signIn('google', { callbackUrl: config.auth.callbackUrl });
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
		<div className='mt-12 max-sm:mt-8'>
			<div className='space-y-8'>
				<div className='card text-left'>
					<form onSubmit={handleSubmit} className='space-y-4'>
						<div className='flex items-end justify-between gap-3'>
							<label htmlFor='draft-text' className='font-display text-lg uppercase text-black'>
								Your draft
							</label>
							<span
								className={`border-2 border-black px-2 py-1 font-sans text-xs font-bold tabular-nums ${
									isOverLimit ? 'bg-error text-black' : 'bg-primary text-black'
								}`}
							>
								{characterCount} / {MAX_CHARACTERS}
							</span>
							<span className='sr-only' aria-live='polite'>
								{limitAnnouncement}
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
								rows={4}
								className={`textarea w-full resize-y rounded-none border-[3px] border-black bg-white px-4 py-3 pr-12 font-sans text-base font-medium leading-relaxed text-black placeholder:text-[#666666] focus:border-black focus:outline-none focus:shadow-[5px_5px_0_#000] sm:min-h-[13rem] ${
									isOverLimit ? 'bg-error' : ''
								}`}
							/>
							{currentText ? (
								<button
									type='button'
									onClick={handleClearText}
									className='btn btn-sm btn-square neo-button absolute right-2 top-2 bg-white'
									title='Clear text'
									aria-label='Clear text'
								>
									<XMarkIcon className='size-5' />
								</button>
							) : null}
						</div>

						{error ? (
							<div
								className='flex items-start gap-3 border-[3px] border-black bg-error px-4 py-3 text-sm font-bold text-black shadow-[4px_4px_0_#000]'
								role='alert'
							>
								<LanguageIcon className='size-5 shrink-0' aria-hidden />
								<span className='flex-1 self-center'>{error.message}</span>
								{isAuthEnhanceError(error.message) ? (
									<button
										type='button'
										onClick={handleLogin}
										className='btn btn-sm neo-button -my-1 shrink-0 bg-white'
									>
										Sign in
									</button>
								) : (
									<button
										type='button'
										onClick={handleRetry}
										className='btn btn-sm neo-button -my-1 shrink-0 bg-white'
									>
										Try again
									</button>
								)}
							</div>
						) : null}

						<div className='flex flex-col gap-3 pt-1 sm:flex-row sm:items-center sm:justify-between'>
							<p className='order-2 text-xs font-bold text-black sm:order-1'>
								<span className='font-medium'>Tip:</span> Enter submits; Shift+Enter for a new
								line.
							</p>
							<div className='order-1 flex flex-wrap items-center justify-end gap-2 sm:order-2'>
								{data ? (
									<button
										type='button'
										onClick={() => reset()}
										className='btn neo-button bg-white'
									>
										Clear results
									</button>
								) : null}
								<button
									type='button'
									onClick={handlePasteFromClipboard}
									className='btn neo-button bg-white'
									title='Paste from clipboard'
									aria-label='Paste from clipboard'
								>
									<ClipboardDocumentIcon className='size-5' />
									<span className='hidden sm:inline'>Paste</span>
								</button>
								<button
									type='submit'
									className='btn neo-button min-w-[10rem] bg-primary px-6'
									disabled={!isTextValid || isPending}
								>
									{isPending ? (
										<>
											<span className='loading loading-dots loading-sm' aria-hidden />
											<span className='sr-only'>Checking your text…</span>
										</>
									) : isLoggedIn ? (
										'Analyze'
									) : (
										'Sign in to analyze'
									)}
								</button>
							</div>
						</div>
					</form>

					<div aria-live='polite'>
						{parsed ? (
							<div className='mt-6 space-y-5 text-left'>
								<span className='sr-only'>
									{parsed.ok && parsed.noMistakes
										? 'Result is ready. No mistakes found.'
										: 'Revised text is ready.'}
								</span>

								{parsed.ok && parsed.noMistakes ? (
									<div className='border-[3px] border-black bg-success px-4 py-3 shadow-[4px_4px_0_#000]'>
										<p className='font-bold text-black'>
											{parsed.noMistakesText || '✅ No mistakes, excellent'}
										</p>
										<p className='mt-1 text-sm font-medium leading-relaxed text-black'>
											Your text is already correct. It is ready to send.
										</p>
									</div>
								) : (
									<div className='prose-panel relative bg-primary pr-12 sm:pr-24'>
										<button
											type='button'
											onClick={() =>
												copyText(parsed.ok ? parsed.corrected ?? undefined : parsed.raw)
											}
											className='btn btn-sm neo-button absolute right-2 top-2 gap-1 bg-white'
											title='Copy revised text'
											aria-label='Copy revised text'
										>
											<DocumentDuplicateIcon className='size-4' />
											<span className='hidden sm:inline' aria-hidden>
												Copy
											</span>
										</button>
										<p className='mb-2 font-display text-sm uppercase text-black'>
											Revised text
										</p>
										<p className='whitespace-pre-wrap font-sans text-base font-medium leading-relaxed'>
											<BoldText text={parsed.ok ? parsed.corrected ?? '' : parsed.raw} />
										</p>
										{parsed.ok ? (
											<p className='mt-2 text-sm font-medium text-black'>
												Bold text shows what changed.
											</p>
										) : null}
									</div>
								)}

								{parsed.ok && parsed.mistakes.length > 0 ? (
									<div>
										<p className='font-display text-base uppercase text-black'>
											Why it changed
										</p>
										<div className='mt-2 space-y-3'>
											{parsed.mistakes.map((mistake, i) => (
												<div
													key={i}
													className='border-2 border-black bg-white px-4 py-3'
												>
													<p className='text-sm font-medium leading-relaxed text-black'>
														<span>{mistake.from}</span>
														<span aria-hidden='true'>{' → '}</span>
														<span className='sr-only'> changed to </span>
														<strong className='font-bold text-black'>
															{mistake.to}
														</strong>
														{'. '}
														{mistake.explanation}
													</p>
												</div>
											))}
										</div>
									</div>
								) : null}

								{parsed.ok && parsed.alternatives.length > 0 ? (
									<div>
										<p className='font-display text-base uppercase text-black'>
											Alternatives
										</p>
										<p className='mt-1 text-sm font-medium text-black'>
											Other ways to say it. Copy the one you like.
										</p>
										<div className='mt-2 space-y-3'>
											{parsed.alternatives.map((alternative, i) => (
												<div
													key={i}
													className='flex items-start justify-between gap-3 border-2 border-black bg-white px-4 py-3'
												>
													<p className='text-sm font-medium leading-relaxed text-black'>
														<span className='font-bold text-black'>
															{alternative.type}:
														</span>{' '}
														<BoldText text={alternative.text} />
													</p>
													<button
														type='button'
														onClick={() => copyText(alternative.text)}
														className='btn btn-sm btn-square neo-button -my-1 shrink-0 bg-primary'
														title={`Copy the "${alternative.type}" version`}
														aria-label={`Copy the "${alternative.type}" version`}
													>
														<DocumentDuplicateIcon className='size-4' />
													</button>
												</div>
											))}
										</div>
									</div>
								) : null}

								{meaning ? (
									<div>
										<p className='font-display text-base uppercase text-black'>
											Meaning
										</p>
										<div className='mt-2 border-2 border-black bg-accent px-4 py-3'>
											<p className='text-sm font-medium leading-relaxed text-black'>
												{meaning}
											</p>
										</div>
									</div>
								) : null}
							</div>
						) : null}
					</div>
				</div>
			</div>
		</div>
	);
}
