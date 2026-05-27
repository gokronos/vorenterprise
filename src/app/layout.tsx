
import './globals.css';
import '@fontsource/montserrat/400.css';
import '@fontsource/montserrat/700.css';
import '@fontsource/montserrat/900.css';
import MainMenu from '../components/MainMenu';
import SiteFooter from '../components/SiteFooter';
import { buildAssetUrl } from '../lib/asset-url';

export const metadata = {
	title: 'V.O.R. Enterprise S.A.S.',
	description: 'Infraestructura, tecnologia, finanzas y seguridad para empresas.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="es">
			<head>
				<link rel="stylesheet" href={buildAssetUrl('/brand-theme.css')} />
			</head>
			<body style={{ fontFamily: 'Montserrat, Arial, sans-serif' }} className="site-body">
				<MainMenu />
				<div className="page-shell">{children}</div>
				<SiteFooter />
			</body>
		</html>
	);
}
