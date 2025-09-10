import type { Metadata } from 'next'
import ConciergerieDetails from '@/pages/ConciergerieDetails'
import { getAllConciergeries } from '@/lib/data'
import { findConciergerieBySlug } from '@/utils/conciergerieUtils'

interface ConciergerieDetailsPageProps {
  params: {
    conciergerieSlug: string
  }
}

export async function generateMetadata({ params }: ConciergerieDetailsPageProps): Promise<Metadata> {
  const conciergerieSlug = decodeURIComponent(params.conciergerieSlug)
  
  try {
    // Récupérer les données de la conciergerie
    const allConciergeries = await getAllConciergeries()
    const conciergerie = findConciergerieBySlug(allConciergeries, conciergerieSlug)
    
    if (conciergerie) {
      // Mots-clés enrichis
      const keywords = [
        `conciergerie ${conciergerie.nom.toLowerCase()}`,
        `conciergerie airbnb ${conciergerie.nom.toLowerCase()}`,
        `gestion locative ${conciergerie.nom.toLowerCase()}`,
        `airbnb management ${conciergerie.nom.toLowerCase()}`,
        `location courte durée ${conciergerie.nom.toLowerCase()}`,
        'conciergerie airbnb',
        'gestion locative',
        'airbnb management',
        'location courte durée',
        'propriétaire airbnb',
        'rentabilité airbnb',
        'conciergerie',
        'détails',
        'gestion location',
        ...(conciergerie.zoneCouverte ? [`conciergerie ${conciergerie.zoneCouverte.toLowerCase()}`] : [])
      ];

      const title = `${conciergerie.nom} | Conciergerie Airbnb - Partenaire ProprioAdvisor`;
      const description = `Découvrez ${conciergerie.nom}, conciergerie Airbnb partenaire de ProprioAdvisor. Services complets, tarifs transparents et gestion professionnelle de votre location courte durée.`;

      return {
        title,
        description,
        keywords,
        authors: [{ name: 'David Vauclin' }],
        category: 'Conciergerie Airbnb',
        openGraph: {
          title,
          description,
          url: `https://proprioadvisor.fr/conciergerie-details/${params.conciergerieSlug}`,
          type: 'website',
          siteName: 'ProprioAdvisor',
          locale: 'fr_FR',
        },
        twitter: {
          card: 'summary_large_image',
          title,
          description,
          creator: '@proprioadvisor',
        },
        alternates: {
          canonical: `/conciergerie-details/${params.conciergerieSlug}`,
        },
        other: {
          'business:contact_data:locality': conciergerie.zoneCouverte || 'France',
          'business:contact_data:country_name': 'France',
          'business:contact_data:website': `https://proprioadvisor.fr/conciergerie-details/${params.conciergerieSlug}`,
        },
      }
    }
  } catch (error) {
    console.error('Error generating metadata for conciergerie:', error)
  }
  
  // Fallback metadata
  return {
    title: `Conciergerie ${conciergerieSlug} | Proprioadvisor`,
    description: `Découvrez les détails de cette conciergerie Airbnb`,
    keywords: ['conciergerie', 'airbnb', conciergerieSlug.toLowerCase(), 'détails'],
    openGraph: {
      title: `Conciergerie ${conciergerieSlug} | Proprioadvisor`,
      description: `Découvrez les détails de cette conciergerie Airbnb`,
      url: `https://proprioadvisor.com/conciergerie-details/${params.conciergerieSlug}`,
    },
    alternates: {
      canonical: `/conciergerie-details/${params.conciergerieSlug}`,
    },
  }
}

export default function ConciergerieDetailsPage({ params }: ConciergerieDetailsPageProps) {
  return <ConciergerieDetails conciergerieSlug={params.conciergerieSlug} />
} 