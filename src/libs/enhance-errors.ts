/**
 * Maps API / HTTP failures to short, user-facing copy.
 */
export function toFriendlyEnhanceError(message?: string, status?: number): string {
	if (status === 401) {
		return 'Please sign in to analyze your text.';
	}
	if (status === 403) {
		return 'Your account can’t use this right now. Contact support if you need help.';
	}
	if (status === 429) {
		return 'Too many requests. Please wait a moment and try again.';
	}
	if (status !== undefined && status >= 500) {
		return 'The service is temporarily unavailable. Please try again in a minute.';
	}

	if (message) {
		const m = message.toLowerCase();
		if (m.includes('unauthorized') || m.includes('please login')) {
			return 'Please sign in to analyze your text.';
		}
		if (m.includes('blocked')) {
			return 'Your account can’t use this right now. Contact support if you need help.';
		}
		if (m.includes('required') && m.includes('text')) {
			return 'Add some text to analyze.';
		}
		return message;
	}

	return 'Something went wrong. Please try again.';
}
