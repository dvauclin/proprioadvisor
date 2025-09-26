import type { Metadata } from 'next'
import Alternatives from '@/pages/Alternatives'
import StructuredData from '@/components/seo/StructuredData'
import { breadcrumbsJsonLd, BASE_URL, LANG } from '@/lib/structured-data-models'

export const metadata: Metadata = {
  title: 'Comparatif des plateformes pour trouver des clients en conciergerie',
  description:
    "Comparatif des alternatives (co-hôte Airbnb, QuelConcierge, QuelleConciergerie, Driing) et leurs approches pour connecter propriétaires et conciergeries.",
  keywords: [
    'alternatives proprioadvisor',
    'co-hôte airbnb',
    'quelconcierge',
    'quelleconciergerie',
    'driing',
    'conciergerie airbnb',
    'comparateur conciergerie',
  ],
  openGraph: {
    title: 'Comparatif des plateformes pour trouver des clients en conciergerie',
    description:
      "Comparatif des alternatives (co-hôte Airbnb, QuelConcierge, QuelleConciergerie, Driing).",
    url: 'https://proprioadvisor.fr/alternatives',
    siteName: 'ProprioAdvisor',
    locale: 'fr_FR',
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Comparatif des plateformes pour trouver des clients en conciergerie',
    description:
      "Comparatif des alternatives (co-hôte Airbnb, QuelConcierge, QuelleConciergerie, Driing).",
    creator: '@proprioadvisor',
  },
  alternates: {
    canonical: '/alternatives',
  },
}

export default function AlternativesPage() {
  const breadcrumb = breadcrumbsJsonLd([
    { name: 'Accueil', url: '/' },
    { name: 'Alternatives' },
  ])

  const webPage = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Comparatif des plateformes pour trouver des clients en conciergerie',
    description:
      'Comparatif des alternatives et leurs approches pour connecter propriétaires et conciergeries.',
    url: `${BASE_URL}/alternatives`,
    inLanguage: LANG,
    isPartOf: { '@id': `${BASE_URL}/#website` },
  }

  return (
    <>
      <StructuredData data={[breadcrumb, webPage]} />
      <Alternatives />
    </>
  )
}


