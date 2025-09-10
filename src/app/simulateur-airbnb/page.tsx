import type { Metadata } from 'next'
import Simulator from '@/pages/Simulator'
import StructuredData from '@/components/seo/StructuredData'
import { webAppJsonLd, breadcrumbsJsonLd } from '@/lib/structured-data-models'

export const metadata: Metadata = {
  title: 'Simulateur Airbnb | ProprioAdvisor - Calculateur de revenus gratuit',
  description: 'Simulez gratuitement vos revenus Airbnb avec notre calculateur avancé. Estimez votre rentabilité avec ou sans conciergerie et optimisez votre location courte durée.',
  keywords: [
    'simulateur airbnb',
    'calculateur revenus airbnb',
    'estimation revenus location',
    'rentabilité airbnb',
    'simulateur conciergerie',
    'calcul revenus locatifs',
    'simulateur',
    'airbnb',
    'calculateur',
    'revenus',
    'location'
  ],
  authors: [{ name: 'David Vauclin' }],
  category: 'Simulateur financier',
  openGraph: {
    title: 'Simulateur Airbnb | ProprioAdvisor - Calculateur de revenus gratuit',
    description: 'Simulez gratuitement vos revenus Airbnb avec notre calculateur avancé. Estimez votre rentabilité avec ou sans conciergerie.',
    url: 'https://proprioadvisor.fr/simulateur-airbnb',
    siteName: 'ProprioAdvisor',
    locale: 'fr_FR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Simulateur Airbnb | ProprioAdvisor',
    description: 'Simulez gratuitement vos revenus Airbnb avec notre calculateur avancé.',
    creator: '@proprioadvisor',
  },
  alternates: {
    canonical: '/simulateur-airbnb',
  },
}

export default function SimulateurPage() {
  const breadcrumbItems = [
    { name: "Accueil", url: "/" },
    { name: "Simulateur", url: "/simulateur-airbnb" }
  ];
  
  const structuredData = [
    breadcrumbsJsonLd(breadcrumbItems),
    webAppJsonLd()
  ];

  return (
    <>
      <StructuredData data={structuredData} />
      <Simulator />
    </>
  )
} 

