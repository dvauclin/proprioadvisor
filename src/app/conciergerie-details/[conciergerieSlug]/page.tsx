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
      return {
        title: `${conciergerie.nom} | Conciergerie Airbnb - Partenaire Proprioadvisor`,
        description: `Découvrez ${conciergerie.nom}, conciergerie Airbnb partenaire de Proprioadvisor. Services complets, tarifs transparents et gestion professionnelle de votre location courte durée.`,
        keywords: ['conciergerie', 'airbnb', conciergerie.nom.toLowerCase(), 'détails', 'gestion location'],
        openGraph: {
          title: `${conciergerie.nom} | Conciergerie Airbnb - Partenaire Proprioadvisor`,
          description: `Découvrez ${conciergerie.nom}, conciergerie Airbnb partenaire de Proprioadvisor. Services complets, tarifs transparents et gestion professionnelle de votre location courte durée.`,
          url: `https://proprioadvisor.com/conciergerie-details/${params.conciergerieSlug}`,
          type: 'website',
        },
        alternates: {
          canonical: `/conciergerie-details/${params.conciergerieSlug}`,
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