/**
 * Parses the markdown blob returned by /api/enhance/fast into sections.
 *
 * Expected shape (see prompts/fast_mode.md):
 *   **Corrected text:**\n<text with **bold** changes>   OR   ✅ No mistakes, excellent
 *   \n\n**Alternatives:**\n** - <Type>**: <version>     (0-3 lines)
 *   \n\n**Mistakes:**\n- "<error>" → "<corrected>": <explanation>
 *
 * Anything that doesn't match falls back to `{ ok: false, raw }` so the UI can
 * render the raw text instead of losing content.
 */

export interface FastAlternative {
	type: string;
	text: string;
}

export interface FastMistake {
	from: string;
	to: string;
	explanation: string;
}

export type ParsedFastResult =
	| {
			ok: true;
			/** Corrected text with `**` change markers; null in the no-mistakes case. */
			corrected: string | null;
			noMistakes: boolean;
			/** The model's "✅ …" line, when present. */
			noMistakesText: string;
			alternatives: FastAlternative[];
			mistakes: FastMistake[];
	  }
	| { ok: false; raw: string };

/** Removes `**` bold markers, e.g. for copying plain text. */
export function stripBoldMarkers(text: string): string {
	return text.replace(/\*\*(.*?)\*\*/g, '$1');
}

const CORRECTED_HEADER = /^\*\*Corrected text:\*\*/i;
const ALTERNATIVES_HEADER = /^[ \t]*\*\*Alternatives:\*\*[ \t]*$/im;
const MISTAKES_HEADER = /^[ \t]*\*\*Mistakes:\*\*[ \t]*$/im;
// ** - More formal**: I suppose we can meet tomorrow at 9 AM
const ALTERNATIVE_LINE = /^\*\*\s*-\s*(.+?)\s*\*\*\s*:\s*(.+)$/;
// - **More formal**: … (tolerated variant)
const ALTERNATIVE_LINE_ALT = /^[-*]\s*\*\*\s*(.+?)\s*\*\*\s*:\s*(.+)$/;
// - "I going" → "I went": Need past tense
const MISTAKE_LINE = /^-\s*[“"]([\s\S]+?)[”"]\s*(?:→|->)\s*[“"]([\s\S]+?)[”"]\s*:\s*(.+)$/;
// Same without quotes (tolerated variant)
const MISTAKE_LINE_BARE = /^-\s*(.+?)\s*(?:→|->)\s*(.+?)\s*:\s*(.+)$/;

function matchIndex(text: string, re: RegExp): number {
	const match = re.exec(text);
	return match ? match.index : -1;
}

export function parseFastResult(raw: string): ParsedFastResult {
	const fallback: ParsedFastResult = { ok: false, raw };
	if (typeof raw !== 'string' || !raw.trim()) {
		return fallback;
	}
	const text = raw.trim();

	// Slice the blob into head / alternatives / mistakes sections. The two
	// optional sections may appear in either order; each runs until the next
	// header (or the end of the blob).
	const markers = [
		{ key: 'alternatives' as const, index: matchIndex(text, ALTERNATIVES_HEADER) },
		{ key: 'mistakes' as const, index: matchIndex(text, MISTAKES_HEADER) },
	]
		.filter((m) => m.index >= 0)
		.sort((a, b) => a.index - b.index);

	const headEnd = markers.length > 0 ? markers[0].index : text.length;
	const head = text.slice(0, headEnd).trim();

	const sections: { alternatives: string; mistakes: string } = {
		alternatives: '',
		mistakes: '',
	};
	markers.forEach((marker, i) => {
		const bodyStart = text.indexOf('\n', marker.index);
		const end = i + 1 < markers.length ? markers[i + 1].index : text.length;
		sections[marker.key] =
			bodyStart >= 0 && bodyStart < end ? text.slice(bodyStart, end).trim() : '';
	});

	// The head must be either the corrected text or the ✅ no-mistakes line.
	let corrected: string | null = null;
	let noMistakes = false;
	let noMistakesText = '';
	if (head.startsWith('✅')) {
		noMistakes = true;
		noMistakesText = head.split('\n')[0].trim();
	} else if (CORRECTED_HEADER.test(head)) {
		corrected = head.replace(CORRECTED_HEADER, '').trim();
		if (!corrected) {
			return fallback;
		}
	} else {
		return fallback;
	}

	// Parse section lines. Any non-empty line that doesn't match its expected
	// shape makes the whole blob fall back, so content is never silently lost.
	const alternatives: FastAlternative[] = [];
	for (const line of sections.alternatives.split('\n')) {
		const trimmed = line.trim();
		if (!trimmed) continue;
		const match = ALTERNATIVE_LINE.exec(trimmed) ?? ALTERNATIVE_LINE_ALT.exec(trimmed);
		if (!match) {
			return fallback;
		}
		alternatives.push({ type: match[1].trim(), text: match[2].trim() });
	}

	const mistakes: FastMistake[] = [];
	for (const line of sections.mistakes.split('\n')) {
		const trimmed = line.trim();
		if (!trimmed) continue;
		const match = MISTAKE_LINE.exec(trimmed) ?? MISTAKE_LINE_BARE.exec(trimmed);
		if (!match) {
			return fallback;
		}
		mistakes.push({
			from: stripBoldMarkers(match[1].trim()),
			to: stripBoldMarkers(match[2].trim()),
			explanation: match[3].trim(),
		});
	}

	return { ok: true, corrected, noMistakes, noMistakesText, alternatives, mistakes };
}
