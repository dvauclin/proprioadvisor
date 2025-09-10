import type { Metadata } from 'next'
import dynamic from 'next/dynamic'
import StructuredData from '@/components/seo/StructuredData'
import { inscriptionPageJsonLd } from '@/lib/structured-data-models'

export const metadata: Metadata = {
  title: 'Inscription | ProprioAdvisor - Accès aux services premium',
  description: 'Inscrivez-vous gratuitement sur ProprioAdvisor pour accéder à nos services de comparaison de conciergeries Airbnb et optimiser votre location courte durée.',
  keywords: [
    'inscription proprioadvisor',
    'compte propriétaire airbnb',
    'inscription conciergerie',
    'services premium',
    'comparateur conciergerie',
    'inscription',
    'conciergerie',
    'airbnb',
    'compte'
  ],
  authors: [{ name: 'David Vauclin' }],
  category: 'Inscription',
  openGraph: {
    title: 'Inscription | ProprioAdvisor - Accès aux services premium',
    description: 'Inscrivez-vous gratuitement sur ProprioAdvisor pour accéder à nos services de comparaison de conciergeries Airbnb.',
    url: 'https://proprioadvisor.fr/inscription',
    siteName: 'ProprioAdvisor',
    locale: 'fr_FR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Inscription | ProprioAdvisor',
    description: 'Inscrivez-vous gratuitement pour accéder à nos services premium.',
    creator: '@proprioadvisor',
  },
  alternates: {
    canonical: '/inscription',
  },
}

export default function InscriptionPage() {
  const Inscription = dynamic(() => import('@/pages/Inscription'), { ssr: false })
  
  const structuredData = [inscriptionPageJsonLd()];

  return (
    <>
      <StructuredData data={structuredData} />
      <Inscription />
    </>
  )
} 

