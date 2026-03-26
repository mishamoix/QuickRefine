/**
 * Satori (next/og ImageResponse) does not use OS fonts — embed font bytes via the `fonts` option.
 * WOFF2 is not supported (`Unsupported OpenType signature wOF2`); Google serves WOFF for legacy UAs.
 */
const GOOGLE_FONTS_WOFF_UA =
	'Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1; Trident/5.0)';

export async function fetchGoogleFontForOg(
	family: string,
	weight: number,
): Promise<ArrayBuffer> {
	const cssUrl = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(family)}:wght@${weight}&display=swap`;
	const css = await fetch(cssUrl, { headers: { 'User-Agent': GOOGLE_FONTS_WOFF_UA } }).then((r) => {
		if (!r.ok) throw new Error(`Font CSS ${r.status}: ${family} ${weight}`);
		return r.text();
	});
	const urlMatch = css.match(/url\((https:\/\/fonts\.gstatic\.com\/[^)]+)\)/);
	if (!urlMatch) throw new Error(`No font URL in CSS for ${family} ${weight}`);
	return fetch(urlMatch[1]).then((r) => {
		if (!r.ok) throw new Error(`Font file ${r.status}: ${family} ${weight}`);
		return r.arrayBuffer();
	});
}

/** DM Sans 600/700 for `next/og` — matches layout `DM_Sans` usage. */
export async function getDmSansOgFonts() {
	const [dmSans600, dmSans700] = await Promise.all([
		fetchGoogleFontForOg('DM Sans', 600),
		fetchGoogleFontForOg('DM Sans', 700),
	]);
	return [
		{ name: 'DM Sans', data: dmSans600, weight: 600 as const, style: 'normal' as const },
		{ name: 'DM Sans', data: dmSans700, weight: 700 as const, style: 'normal' as const },
	];
}
