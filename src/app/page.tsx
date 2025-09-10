import type { Metadata } from 'next'
import Index from '@/pages/Index'
import StructuredData from '@/components/seo/StructuredData'
import { homePageJsonLd, breadcrumbsJsonLd } from '@/lib/structured-data-models'

export const metadata: Metadata = {
  title: 'ProprioAdvisor | SEUL comparateur de conciergeries Airbnb',
  description: 'ProprioAdvisor vous aide à trouver la meilleure conciergerie pour votre bien en location courte durée. Comparaison gratuite des services, tarifs et avis.',
  keywords: [
    'conciergerie airbnb',
    'comparateur conciergerie',
    'location courte durée',
    'gestion locative',
    'airbnb management',
    'propriétaire airbnb',
    'rentabilité airbnb',
    'conciergerie',
    'airbnb',
    'comparateur',
    'propriétaire'
  ],
  authors: [{ name: 'David Vauclin' }],
  category: 'Conciergerie Airbnb',
  openGraph: {
    title: 'ProprioAdvisor | Comparateur de conciergeries Airbnb le + complet',
    description: 'ProprioAdvisor vous aide à trouver la meilleure conciergerie pour votre bien en location courte durée. Comparaison gratuite des services, tarifs et avis.',
    url: 'https://proprioadvisor.fr',
    siteName: 'ProprioAdvisor',
    locale: 'fr_FR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ProprioAdvisor | Comparateur de conciergeries Airbnb',
    description: 'ProprioAdvisor vous aide à trouver la meilleure conciergerie pour votre bien en location courte durée.',
    creator: '@proprioadvisor',
  },
  alternates: {
    canonical: '/',
  },
}

// Revalidation toutes les 60 secondes pour la page d'accueil
export const revalidate = 60;

export default function HomePage() {
  const breadcrumbItems = [
    { name: "Accueil", url: "/" }
  ];
  
  const structuredData = [
    breadcrumbsJsonLd(breadcrumbItems),
    homePageJsonLd()
  ];

  return (
    <>
      <StructuredData data={structuredData} />
      <Index />
    </>
  )
} 

