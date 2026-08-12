import HowItWorks from '@/components/HowItWorks';
import Features from '@/components/Features';
import Hero from '@/components/Hero';
import TextAnalyzer from '@/components/TextAnalyzer';

export default function Home() {
	return (
		<>
			<section className='mx-auto max-w-5xl px-4 padding sm:px-6'>
				<Hero />
				<TextAnalyzer />
			</section>
			<HowItWorks />
			<Features />
		</>
	);
}
