import HowItWorks from '@/components/HowItWorks';
import Features from '@/components/Features';
import Hero from '@/components/Hero';
import TextAnalyzer from '@/components/TextAnalyzer';
import ContactButton from '@/components/ContactButton';
import ClientLayout from '@/components/LayoutClient';

export default function Home() {
	return (
		<>
			<section className='mx-auto max-w-4xl px-4 text-center padding sm:px-6'>
				<Hero />
				<ClientLayout>
					<TextAnalyzer />
				</ClientLayout>
			</section>
			<HowItWorks />
			<Features />
			<ContactButton />
		</>
	);
}
