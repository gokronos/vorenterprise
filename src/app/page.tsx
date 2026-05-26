
import HeroSlider from '../components/HeroSlider';
import IdentitySection from '../components/IdentitySection';
import ServicesBlock from '../components/ServicesBlock';
import PortfolioBlock from '../components/PortfolioBlock';
import LegalProtectionBlock from '../components/LegalProtectionBlock';
import WhyChooseUsBlock from '../components/WhyChooseUsBlock';
import LegacyVParamCleaner from '../components/LegacyVParamCleaner';

export default function Home() {
	return (
		<main className="home-page">
			<LegacyVParamCleaner />
			<div id="sagrilaft" className="anchor-marker" aria-hidden="true"></div>
			<div id="organigrama" className="anchor-marker" aria-hidden="true"></div>
			<div id="politica-datos" className="anchor-marker" aria-hidden="true"></div>
			<div id="kyc" className="anchor-marker" aria-hidden="true"></div>
			<div id="contacto" className="anchor-marker" aria-hidden="true"></div>

			<section id="inicio" className="hero-wrap">
				<HeroSlider />
			</section>

			<section className="section-shell section-shell-identity">
				<IdentitySection />
			</section>

			<section className="section-shell section-shell-services">
				<ServicesBlock />
			</section>

			<section className="section-shell section-shell-portfolio">
				<PortfolioBlock />
			</section>

			<section className="section-shell section-shell-legal">
				<LegalProtectionBlock />
			</section>

			<section className="section-shell section-shell-why">
				<WhyChooseUsBlock />
			</section>
		</main>
	);
}
