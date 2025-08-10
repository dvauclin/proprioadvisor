import type { Metadata } from 'next'
import AnnuaireConciergerie from '@/pages/AnnuaireConciergerie'
import StructuredData from '@/components/seo/StructuredData'
import { breadcrumbsJsonLd, BASE_URL, LANG } from '@/lib/structured-data-models'

export const metadata: Metadata = {
  title: 'Annuaire des conciergeries Airbnb | ProprioAdvisor',
  description: 'Annuaire spécialisé des conciergeries Airbnb. Comparez gratuitement les offres et trouvez la meilleure conciergerie pour votre location courte durée.',
  keywords: ['annuaire conciergerie', 'conciergerie airbnb', 'gestion location courte durée', 'proprioadvisor'],
  openGraph: {
    title: 'Annuaire des conciergeries Airbnb | ProprioAdvisor',
    description: 'Annuaire spécialisé des conciergeries Airbnb. Comparez gratuitement les offres et trouvez la meilleure conciergerie pour votre location courte durée.',
    url: 'https://proprioadvisor.com/annuaire',
  },
  alternates: {
    canonical: '/annuaire',
  },
}

export default function AnnuairePage() {
  const breadcrumb = breadcrumbsJsonLd([
    { name: 'Accueil', url: '/' },
    { name: 'Annuaire' },
  ])

  const collectionPage = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Annuaire des conciergeries Airbnb',
    description:
      "Annuaire spécialisé des conciergeries Airbnb. Comparez gratuitement les offres et trouvez la meilleure conciergerie pour votre location courte durée.",
    url: `${BASE_URL}/annuaire`,
    inLanguage: LANG,
  }

  return (
    <>
      <StructuredData data={[breadcrumb, collectionPage]} />
      <AnnuaireConciergerie />
    </>
  )
} 

