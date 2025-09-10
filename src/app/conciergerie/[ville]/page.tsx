import type { Metadata } from 'next'
import ConciergerieListing from "@/pages/ConciergerieListing";
import { getAllVilles } from "@/lib/data";

interface ConciergeriePageProps {
  params: {
    ville: string;
  };
}

export async function generateMetadata({ params }: ConciergeriePageProps): Promise<Metadata> {
  const villeSlug = decodeURIComponent(params.ville);
  
  try {
    const villesData = await getAllVilles();
    const villeData = villesData?.find(v => v.slug === villeSlug);
    
    if (villeData) {
      // Calculer la date actuelle au format "Août 2025"
      const currentDate = new Date();
      const monthNames = [
        'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
        'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
      ];
      const monthName = monthNames[currentDate.getMonth()];
      const year = currentDate.getFullYear();
      const dateString = `${monthName} ${year}`;
      
      // Titre sur mesure avec ville et date
      const pageTitle = `Comparatif Conciergeries Airbnb ${villeData.nom} | ${dateString} | ProprioAdvisor`;
        
      // Description personnalisée par ville depuis Supabase
      const pageDescription = villeData.description 
        ? villeData.description
        : `Découvrez les meilleures conciergeries Airbnb à ${villeData.nom}. Comparez gratuitement les services, tarifs et avis pour choisir la conciergerie idéale pour votre location courte durée.`;
      
      const canonicalUrl = `https://proprioadvisor.fr/conciergerie/${villeSlug}`;
      
      // Mots-clés enrichis avec informations géographiques
      const keywords = [
        `conciergerie airbnb ${villeData.nom}`,
        `conciergerie ${villeData.nom}`,
        `gestion locative ${villeData.nom}`,
        `airbnb management ${villeData.nom}`,
        `location courte durée ${villeData.nom}`,
        `conciergerie airbnb`,
        `gestion locative`,
        `airbnb management`,
        `location courte durée`,
        `propriétaire airbnb`,
        `rentabilité airbnb`,
        ...(villeData.departementNom ? [`conciergerie ${villeData.departementNom}`, `gestion locative ${villeData.departementNom}`] : [])
      ];

      return {
        title: pageTitle,
        description: pageDescription,
        keywords: keywords,
        authors: [{ name: 'David Vauclin' }],
        category: 'Conciergerie Airbnb',
        openGraph: {
          title: pageTitle,
          description: pageDescription,
          url: canonicalUrl,
          type: 'website',
          siteName: 'ProprioAdvisor',
          locale: 'fr_FR',
          ...(villeData.latitude && villeData.longitude ? {
            latitude: villeData.latitude,
            longitude: villeData.longitude
          } : {}),
        },
        twitter: {
          card: 'summary_large_image',
          title: pageTitle,
          description: pageDescription,
          creator: '@proprioadvisor',
        },
        alternates: {
          canonical: canonicalUrl,
        },
        other: {
          'geo.region': villeData.departementNom || 'France',
          'geo.placename': villeData.nom,
          ...(villeData.latitude && villeData.longitude ? {
            'geo.position': `${villeData.latitude};${villeData.longitude}`,
            'ICBM': `${villeData.latitude}, ${villeData.longitude}`
          } : {}),
        },
      };
    }
  } catch (error) {
    console.error('Error generating metadata for ville:', error);
  }
  
  // Fallback metadata avec titre sur mesure
  const currentDate = new Date();
  const monthNames = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
  ];
  const monthName = monthNames[currentDate.getMonth()];
  const year = currentDate.getFullYear();
  const dateString = `${monthName} ${year}`;
  
  const fallbackTitle = `Comparatif Conciergeries Airbnb ${villeSlug} | ${dateString} | ProprioAdvisor`;
  
  return {
    title: fallbackTitle,
    description: `Découvrez les meilleures conciergeries Airbnb à ${villeSlug}. Comparez gratuitement les services, tarifs et avis pour choisir la conciergerie idéale.`,
    keywords: [`conciergerie airbnb, ${villeSlug}, location courte durée, gestion locative, airbnb management`],
    openGraph: {
      title: fallbackTitle,
      description: `Découvrez les meilleures conciergeries Airbnb à ${villeSlug}. Comparez gratuitement les services, tarifs et avis pour choisir la conciergerie idéale.`,
      url: `https://proprioadvisor.fr/conciergerie/${villeSlug}`,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: fallbackTitle,
      description: `Découvrez les meilleures conciergeries Airbnb à ${villeSlug}. Comparez gratuitement les services, tarifs et avis pour choisir la conciergerie idéale.`,
    },
    alternates: {
      canonical: `https://proprioadvisor.fr/conciergerie/${villeSlug}`,
    },
  };
}

export default function ConciergeriePage({ params }: ConciergeriePageProps) {
  return <ConciergerieListing ville={params.ville} />;
} 