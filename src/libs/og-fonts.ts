/** Satori requires embedded font bytes; Google serves compatible WOFF to this legacy UA. */
const GOOGLE_FONTS_WOFF_UA =
	'Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1; Trident/5.0)';

async function fetchGoogleFontForOg(
	family: string,
	weight: number,
): Promise<ArrayBuffer> {
	const cssUrl = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(family)}:wght@${weight}&display=swap`;
	const css = await fetch(cssUrl, {
		headers: { 'User-Agent': GOOGLE_FONTS_WOFF_UA },
	}).then((response) => {
		if (!response.ok) throw new Error(`Font CSS ${response.status}: ${family} ${weight}`);
		return response.text();
	});
	const url = css.match(/url\((https:\/\/fonts\.gstatic\.com\/[^)]+)\)/)?.[1];
	if (!url) throw new Error(`No font URL in CSS for ${family} ${weight}`);
	return fetch(url).then((response) => {
		if (!response.ok) throw new Error(`Font file ${response.status}: ${family} ${weight}`);
		return response.arrayBuffer();
	});
}

export async function getQuickRefineOgFonts() {
	const [spaceGrotesk, archivoBlack] = await Promise.all([
		fetchGoogleFontForOg('Space Grotesk', 600),
		fetchGoogleFontForOg('Archivo Black', 400),
	]);
	return [
		{ name: 'Space Grotesk', data: spaceGrotesk, weight: 600 as const, style: 'normal' as const },
		{ name: 'Archivo Black', data: archivoBlack, weight: 400 as const, style: 'normal' as const },
	];
}
