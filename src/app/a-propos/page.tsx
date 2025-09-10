import type { Metadata } from 'next'
import APropos from '@/pages/APropos'
import StructuredData from '@/components/seo/StructuredData'
import { aboutPageJsonLd } from '@/lib/structured-data-models'

export const metadata: Metadata = {
  title: 'À propos de ProprioAdvisor | Notre mission et notre engagement',
  description: 'Découvrez l\'histoire, la mission et les valeurs de ProprioAdvisor, le comparateur de conciergeries Airbnb de référence en France. Notre engagement pour les propriétaires.',
  keywords: [
    'à propos proprioadvisor',
    'histoire proprioadvisor',
    'mission proprioadvisor',
    'david vauclin',
    'expert airbnb',
    'comparateur conciergerie',
    'à propos',
    'histoire',
    'mission',
    'conciergerie',
    'airbnb'
  ],
  authors: [{ name: 'David Vauclin' }],
  category: 'À propos',
  openGraph: {
    title: 'À propos de ProprioAdvisor | Notre mission et notre engagement',
    description: 'Découvrez l\'histoire, la mission et les valeurs de ProprioAdvisor, le comparateur de conciergeries Airbnb de référence en France.',
    url: 'https://proprioadvisor.fr/a-propos',
    siteName: 'ProprioAdvisor',
    locale: 'fr_FR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'À propos de ProprioAdvisor',
    description: 'Découvrez notre mission et notre engagement pour les propriétaires Airbnb.',
    creator: '@proprioadvisor',
  },
  alternates: {
    canonical: '/a-propos',
  },
}

export default function AProposPage() {
  const structuredData = [aboutPageJsonLd()];

  return (
    <>
      <StructuredData data={structuredData} />
      <APropos />
    </>
  )
} 

