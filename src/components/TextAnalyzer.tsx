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
		<div className='mt-16 max-md:mt-10 max-sm:mt-4'>
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
								className={`textarea textarea-bordered w-full resize-y rounded-xl border-base-300 bg-base-100 px-4 py-3 pr-12 font-sans text-base leading-relaxed text-base-content placeholder:text-base-content/35 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 sm:min-h-[13rem] ${
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

						{error ? (
							<div
								className='flex items-start gap-3 rounded-xl border border-error/30 bg-error/5 px-4 py-3 text-sm text-error'
								role='alert'
							>
								<LanguageIcon className='size-5 shrink-0' aria-hidden />
								<span className='flex-1 self-center'>{error.message}</span>
								{isAuthEnhanceError(error.message) ? (
									<button
										type='button'
										onClick={handleLogin}
										className='btn btn-ghost btn-sm -my-1 shrink-0 rounded-lg text-primary hover:bg-primary/10'
									>
										Sign in
									</button>
								) : (
									<button
										type='button'
										onClick={handleRetry}
										className='btn btn-ghost btn-sm -my-1 shrink-0 rounded-lg text-primary hover:bg-primary/10'
									>
										Try again
									</button>
								)}
							</div>
						) : null}

						<div className='flex flex-col gap-3 pt-1 sm:flex-row sm:items-center sm:justify-between'>
							<p className='order-2 text-xs text-base-content/70 sm:order-1'>
								<span className='font-medium'>Tip:</span> Enter submits; Shift+Enter for a new
								line.
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
									<div className='rounded-xl border border-success/30 bg-success/5 px-4 py-3'>
										<p className='font-medium text-success'>
											{parsed.noMistakesText || '✅ No mistakes, excellent'}
										</p>
										<p className='mt-1 text-sm leading-relaxed text-base-content/70'>
											Your text is already correct. It is ready to send.
										</p>
									</div>
								) : (
									<div className='prose-panel relative border-primary/15 bg-base-200/50 pr-12 sm:pr-24'>
										<button
											type='button'
											onClick={() =>
												copyText(parsed.ok ? parsed.corrected ?? undefined : parsed.raw)
											}
											className='btn btn-ghost btn-sm absolute right-2 top-2 gap-1 rounded-lg'
											title='Copy revised text'
											aria-label='Copy revised text'
										>
											<DocumentDuplicateIcon className='size-4' />
											<span className='hidden sm:inline' aria-hidden>
												Copy
											</span>
										</button>
										<p className='mb-2 text-xs font-semibold uppercase tracking-wider text-primary'>
											Revised text
										</p>
										<p className='whitespace-pre-wrap font-sans text-base leading-relaxed'>
											<BoldText text={parsed.ok ? parsed.corrected ?? '' : parsed.raw} />
										</p>
										{parsed.ok ? (
											<p className='mt-2 text-sm text-base-content/65'>
												Bold text shows what changed.
											</p>
										) : null}
									</div>
								)}

								{parsed.ok && parsed.mistakes.length > 0 ? (
									<div>
										<p className='font-display text-base font-semibold text-base-content'>
											Why it changed
										</p>
										<div className='mt-2 space-y-3'>
											{parsed.mistakes.map((mistake, i) => (
												<div
													key={i}
													className='rounded-lg border border-base-300/80 bg-base-200/40 px-4 py-3'
												>
													<p className='text-sm leading-relaxed text-base-content/80'>
														<span className='text-base-content/60'>{mistake.from}</span>
														<span aria-hidden='true'>{' → '}</span>
														<span className='sr-only'> changed to </span>
														<strong className='font-semibold text-base-content'>
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
										<p className='font-display text-base font-semibold text-base-content'>
											Alternatives
										</p>
										<p className='mt-1 text-sm text-base-content/65'>
											Other ways to say it. Copy the one you like.
										</p>
										<div className='mt-2 space-y-3'>
											{parsed.alternatives.map((alternative, i) => (
												<div
													key={i}
													className='flex items-start justify-between gap-3 rounded-lg border border-base-300/80 bg-base-200/40 px-4 py-3'
												>
													<p className='text-sm leading-relaxed text-base-content/80'>
														<span className='font-medium text-base-content'>
															{alternative.type}:
														</span>{' '}
														<BoldText text={alternative.text} />
													</p>
													<button
														type='button'
														onClick={() => copyText(alternative.text)}
														className='btn btn-ghost btn-sm btn-square -my-1 shrink-0 rounded-lg text-base-content/60 hover:bg-base-300/60 hover:text-base-content'
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
										<p className='font-display text-base font-semibold text-base-content'>
											Meaning
										</p>
										<div className='mt-2 rounded-lg border border-base-300/80 bg-base-200/40 px-4 py-3'>
											<p className='text-sm leading-relaxed text-base-content/80'>
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
