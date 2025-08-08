// Helpers pour gÃ©nÃ©rer les donnÃ©es structurÃ©es JSON-LD
import { Conciergerie, Formule, Ville } from '@/types';
import { getAvisByConciergerie } from '@/services/avisService';

const BASE_URL = 'https://proprioadvisor.fr';

// Utilitaires pour gÃ©nÃ©rer les donnÃ©es structurÃ©es JSON-LD

// DonnÃ©es structurÃ©es pour l'organisation
export const createOrganizationStructuredData = () => ({
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'ProprioAdvisor',
  url: 'https://proprioadvisor.fr',
  logo: 'https://proprioadvisor.fr/logo.png',
  description: 'Le comparateur de conciergeries Airbnb en France le plus complet du marchÃ©',
  sameAs: [
    'https://twitter.com/proprioadvisor',
    'https://linkedin.com/company/proprioadvisor'
  ],
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'customer service',
    email: 'contact@proprioadvisor.fr'
  }
});

// DonnÃ©es structurÃ©es pour une page web
export const createWebPageStructuredData = (title: string, description: string, url: string) => ({
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: title,
  description: description,
  url: url,
  mainEntity: {
    '@type': 'Organization',
    name: 'ProprioAdvisor',
    url: 'https://proprioadvisor.fr'
  }
});

// DonnÃ©es structurÃ©es pour un article de blog
export const createArticleStructuredData = (article: any, imageUrl?: string) => ({
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: article.titre,
  description: article.description,
  image: imageUrl || 'https://proprioadvisor.fr/default-article-image.jpg',
  author: {
    '@type': 'Organization',
    name: 'ProprioAdvisor'
  },
  publisher: {
    '@type': 'Organization',
    name: 'ProprioAdvisor',
    logo: {
      '@type': 'ImageObject',
      url: 'https://proprioadvisor.fr/logo.png'
    }
  },
  datePublished: article.date_creation,
  dateModified: article.date_modification || article.date_creation,
  mainEntityOfPage: {
    '@type': 'WebPage',
    '@id': `https://proprioadvisor.fr/blog/${article.slug}`
  }
});

// DonnÃ©es structurÃ©es pour un fil d'Ariane
export const createBreadcrumbStructuredData = (items: Array<{ name: string; url?: string }>) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: item.name,
    ...(item.url && { item: item.url }),
  })),
})

// DonnÃ©es structurÃ©es pour une FAQ
export const createFAQStructuredData = (faqs: Array<{ q: string; a: string }>) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map(faq => ({
    '@type': 'Question',
    name: faq.q,
    acceptedAnswer: {
      '@type': 'Answer',
      text: faq.a,
    },
  })),
})

// DonnÃ©es structurÃ©es pour une conciergerie
export const createConciergerieStructuredData = (conciergerie: any, formules: any[]) => ({
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: conciergerie.nom,
  description: conciergerie.description,
  url: conciergerie.siteWeb,
  telephone: conciergerie.telephone,
  address: {
    '@type': 'PostalAddress',
    addressLocality: conciergerie.ville?.nom,
    addressCountry: 'FR',
  },
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Formules de conciergerie',
    itemListElement: formules.map(formule => ({
      '@type': 'Offer',
      itemOffered: {
        '@type': 'Service',
        name: formule.nom,
        description: formule.description,
      },
      price: formule.prix,
      priceCurrency: 'EUR',
    })),
  },
})

// DonnÃ©es structurÃ©es pour une liste de conciergeries
export const createConciergerieListStructuredData = (conciergeries: any[], ville: any) => ({
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: `Conciergeries Airbnb Ã  ${ville.nom}`,
  description: `Liste des conciergeries Airbnb disponibles Ã  ${ville.nom}`,
  numberOfItems: conciergeries.length,
  itemListElement: conciergeries.map((conciergerie, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    item: {
      '@type': 'LocalBusiness',
      name: conciergerie.nom,
      description: conciergerie.description,
      url: `/conciergerie-details/${conciergerie.slug}`,
    },
  })),
})

// DonnÃ©es structurÃ©es pour le site web
export const createWebsiteStructuredData = () => ({
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'ProprioAdvisor',
  url: 'https://proprioadvisor.fr',
  description: 'Comparateur de conciergeries Airbnb pour les propriÃ©taires',
  publisher: {
    '@type': 'Organization',
    name: 'ProprioAdvisor',
    url: 'https://proprioadvisor.fr'
  },
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: 'https://proprioadvisor.fr/conciergerie/{search_term_string}'
    },
    'query-input': 'required name=search_term_string'
  },
  sameAs: [
    'https://twitter.com/proprioadvisor',
    'https://linkedin.com/company/proprioadvisor'
  ]
});

// Fonction pour rÃ©cupÃ©rer les avis et calculer la moyenne rÃ©elle
const getAvisStatistics = async (conciergerieId: string): Promise<{ averageRating: number; reviewCount: number } | null> => {
  try {
    const avis = await getAvisByConciergerie(conciergerieId);
    if (avis.length === 0) return null;
    
    const totalNotes = avis.reduce((sum, avis) => sum + avis.note, 0);
    const averageRating = Math.round((totalNotes / avis.length) * 10) / 10; // Arrondir Ã  1 dÃ©cimale
    
    return {
      averageRating,
      reviewCount: avis.length
    };
  } catch (error) {
    console.error(`Error fetching avis for conciergerie ${conciergerieId}:`, error);
    return null;
  }
};

// Helper function to validate and clean names
const validateName = (name: string | null | undefined, fallback: string = "Service de conciergerie"): string => {
  if (!name || typeof name !== 'string') return fallback;
  const cleanName = name.trim();
  return cleanName.length > 0 ? cleanName : fallback;
};

export const createListingStructuredData = async (ville: Ville, formules: (Formule & { conciergerie?: Conciergerie })[], lastModified?: string) => {
  // D'abord filtrer les formules valides
  const validFormules = formules.filter(f => f.conciergerie && f.conciergerie.score > 0);

  // Grouper IMMÃ‰DIATEMENT par conciergerie pour Ã©viter les doublons
  const conciergeriesMap = new Map<string, {
    conciergerie: Conciergerie;
    formules: Formule[];
    bestFormule: Formule;
  }>();

  validFormules.forEach(formule => {
    const conciergerie = formule.conciergerie!;
    const conciergerieId = conciergerie.id;
    
    if (!conciergeriesMap.has(conciergerieId)) {
      conciergeriesMap.set(conciergerieId, {
        conciergerie,
        formules: [formule],
        bestFormule: formule
      });
    } else {
      const existing = conciergeriesMap.get(conciergerieId)!;
      existing.formules.push(formule);
      // Garder la formule avec la meilleure commission (plus basse) comme formule principale
      if (!formule.commission || (existing.bestFormule.commission && formule.commission < existing.bestFormule.commission)) {
        existing.bestFormule = formule;
      }
    }
  });

  // Maintenant trier les conciergeries groupÃ©es selon l'ordre d'affichage
  const sortedConciergerieEntries = Array.from(conciergeriesMap.entries()).sort(([, a], [, b]) => {
    const scoreA = a.conciergerie.score || 0;
    const scoreB = b.conciergerie.score || 0;
    
    if (scoreA !== scoreB) {
      return scoreB - scoreA; // Score dÃ©croissant
    }
    
    // Si scores Ã©gaux, trier par date de crÃ©ation (plus ancien en premier)
    const dateA = new Date(a.bestFormule.createdAt || '').getTime();
    const dateB = new Date(b.bestFormule.createdAt || '').getTime();
    return dateA - dateB; // Sort by date ascending (oldest first)
  });

  // RÃ©cupÃ©rer les statistiques d'avis rÃ©elles pour chaque conciergerie
  const avisPromises = sortedConciergerieEntries.map(([, item]) => 
    getAvisStatistics(item.conciergerie.id)
  );
  const avisStatistics = await Promise.all(avisPromises);

  // CrÃ©er un seul Ã©lÃ©ment ItemList unifiÃ© avec une entrÃ©e unique par conciergerie
  const itemListElement = sortedConciergerieEntries.map(([, item], index) => {
    const { conciergerie, formules, bestFormule } = item;
    const conciergerieSlug = createConciergerieSlug(conciergerie.nom);
    
    // Construire un priceRange valide avec une longueur appropriÃ©e (minimum 12 caractÃ¨res)
    let priceRange = "Sur devis - Contactez-nous";
    if (bestFormule.commission && bestFormule.commission > 0) {
      const minCommission = Math.min(...formules.filter(f => f.commission).map(f => f.commission!));
      const maxCommission = Math.max(...formules.filter(f => f.commission).map(f => f.commission!));
      
      if (minCommission === maxCommission) {
        priceRange = `Commission de ${minCommission}% sur revenus`;
      } else {
        priceRange = `Commission de ${minCommission}% Ã  ${maxCommission}% sur revenus`;
      }
    }

    // URL unique pour chaque conciergerie
    const itemUrl = `${BASE_URL}/conciergerie-details/${conciergerieSlug}`;

    // Description incluant toutes les formules disponibles
    const formulesNames = formules.map(f => validateName(f.nom, "Formule standard")).join(', ');
    const description = `Conciergerie Airbnb ${conciergerie.nom} Ã  ${ville.nom}. Formules disponibles : ${formulesNames}. Service professionnel avec commission Ã  partir de ${bestFormule.commission || 'tarif personnalisÃ©'}.`;

    const itemData: any = {
      "@type": "ListItem",
      "position": index + 1,
      "url": itemUrl,
      "name": `${conciergerie.nom} - Conciergerie Airbnb ${ville.nom}`,
      "description": description,
      "item": {
        "@type": "LocalBusiness",
        "@id": `${BASE_URL}/conciergerie-details/${conciergerieSlug}`,
        "name": `${conciergerie.nom}`,
        "description": `Conciergerie Airbnb ${conciergerie.nom}. Gestion complÃ¨te de votre location courte durÃ©e avec un service professionnel et personnalisÃ© Ã  ${ville.nom}. Formules disponibles : ${formulesNames}.`,
        "logo": conciergerie.logo || `${BASE_URL}/placeholder.svg`,
        "url": itemUrl,
        "areaServed": {
          "@type": "City",
          "name": ville.nom,
          "addressCountry": "FR"
        },
        "serviceType": "Conciergerie Airbnb",
        "priceRange": priceRange,
        "address": {
          "@type": "PostalAddress",
          "addressLocality": ville.nom,
          "addressCountry": "FR"
        },
        "openingHours": [
          "Mo-Fr 09:00-18:00",
          "Sa 09:00-17:00"
        ],
        "telephone": conciergerie.telephoneContact || "+33 1 XX XX XX XX",
        "parentOrganization": {
          "@type": "Organization",
          "name": "ProprioAdvisor",
          "url": BASE_URL
        },
        "hasOfferCatalog": {
          "@type": "OfferCatalog",
          "name": "Services de conciergerie Airbnb",
          "itemListElement": formules.map(formule => ({
            "@type": "Offer",
            "name": validateName(formule.nom, "Formule de conciergerie"),
            "description": `Formule ${validateName(formule.nom, "standard")} - Commission ${formule.commission}%. Service complet de gestion Airbnb.`,
            "price": formule.commission || 0,
            "priceCurrency": "EUR",
            "availability": "https://schema.org/InStock",
            "itemOffered": {
              "@type": "Service",
              "name": `Gestion Airbnb - ${validateName(formule.nom, "Formule standard")}`,
              "description": "Accueil voyageurs, mÃ©nage, maintenance, gestion des rÃ©servations"
            }
          }))
        }
      }
    };

    // Ajouter aggregateRating SEULEMENT si il y a de vrais avis validÃ©s
    const avisStats = avisStatistics[index];
    if (avisStats && avisStats.reviewCount > 0) {
      itemData.item.aggregateRating = {
        "@type": "AggregateRating",
        "ratingValue": avisStats.averageRating,
        "reviewCount": avisStats.reviewCount,
        "bestRating": 5,
        "worstRating": 1
      };
    }

    return itemData;
  });

  const structuredData: any = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": `Conciergeries Airbnb Ã  ${ville.nom}`,
    "description": ville.description || `DÃ©couvrez les meilleures conciergeries Ã  ${ville.nom} pour gÃ©rer votre logement en location courte durÃ©e. Comparaison dÃ©taillÃ©e des services, tarifs et avis clients.`,
    "url": `${BASE_URL}/conciergerie/${ville.slug}`,
    "numberOfItems": itemListElement.length,
    "itemListElement": itemListElement,
    "about": {
      "@type": "Thing",
      "name": "Conciergerie Airbnb",
      "description": "Service de gestion complÃ¨te pour locations courte durÃ©e comprenant l'accueil des voyageurs, le mÃ©nage, la maintenance et l'optimisation des revenus locatifs."
    },
    "audience": {
      "@type": "Audience",
      "audienceType": "PropriÃ©taires de biens immobiliers"
    },
    "inLanguage": "fr-FR"
  };

  // Add lastModified date if provided
  if (lastModified) {
    structuredData.dateModified = lastModified;
  }

  return structuredData;
};

export const createConciergerieDetailsStructuredData = async (
  conciergerie: Conciergerie, 
  formules: Formule[], 
  villes?: any[]
) => {
  const areaServed = villes?.map(v => ({
    "@type": "City",
    "name": v.nom,
    "addressCountry": "FR"
  })) || [{
    "@type": "Place",
    "name": conciergerie.zoneCouverte || 'France'
  }];
  
  // Construire un priceRange valide
  let priceRange = "Sur devis";
  if (formules.length > 0 && formules[0].commission && formules[0].commission > 0) {
    priceRange = `Ã€ partir de ${formules[0].commission}% de commission`;
  }
  
  const structuredData: any = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${BASE_URL}/conciergerie-details/${createConciergerieSlug(conciergerie.nom)}`,
    "name": conciergerie.nom,
    "description": `${conciergerie.nom} est une conciergerie spÃ©cialisÃ©e dans la gestion complÃ¨te de locations Airbnb. Services incluant accueil voyageurs, mÃ©nage professionnel, maintenance, optimisation des revenus et gestion administrative complÃ¨te.`,
    "url": `${BASE_URL}/conciergerie-details/${createConciergerieSlug(conciergerie.nom)}`,
    "areaServed": areaServed,
    "serviceType": "Conciergerie Airbnb",
    "priceRange": priceRange,
    "openingHours": [
      "Mo-Fr 09:00-18:00",
      "Sa 09:00-17:00"
    ],
    "parentOrganization": {
      "@type": "Organization",
      "name": "ProprioAdvisor",
      "url": BASE_URL
    }
  };

  if (conciergerie.telephoneContact) {
    structuredData.telephone = conciergerie.telephoneContact;
  }

  // RÃ©cupÃ©rer les vraies statistiques d'avis
  const avisStats = await getAvisStatistics(conciergerie.id);
  
  // Ajouter aggregateRating SEULEMENT si il y a de vrais avis validÃ©s
  if (avisStats && avisStats.reviewCount > 0) {
    structuredData.aggregateRating = {
      "@type": "AggregateRating",
      "ratingValue": avisStats.averageRating,
      "reviewCount": avisStats.reviewCount,
      "bestRating": 5,
      "worstRating": 1
    };
  }

  if (formules.length > 0) {
    structuredData.hasOfferCatalog = {
      "@type": "OfferCatalog",
      "name": "Formules de conciergerie",
      "itemListElement": formules.map(formule => ({
        "@type": "Offer",
        "name": validateName(formule.nom, "Formule de conciergerie"),
        "description": `Formule ${validateName(formule.nom, "standard")} - Commission ${formule.commission}%. Service complet de gestion Airbnb incluant tous les aspects opÃ©rationnels.`,
        "price": formule.commission || 0,
        "priceCurrency": "EUR",
        "availability": "https://schema.org/InStock"
      }))
    };
  }

  return structuredData;
};

export const createSimulatorStructuredData = () => {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Simulateur de revenus Airbnb",
    "description": "Estimez gratuitement et immÃ©diatement vos revenus potentiels sur Airbnb avec notre simulateur avancÃ©. Comparaison avec et sans conciergerie, personnalisation selon votre bien.",
    "url": `${BASE_URL}/simulateur-airbnb`,
    "applicationCategory": "FinanceApplication",
    "operatingSystem": "Web",
    "browserRequirements": "HTML5, CSS3, JavaScript",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "EUR"
    },
    "featureList": [
      "Estimation des revenus Airbnb personnalisÃ©e",
      "Comparaison avec/sans conciergerie",
      "Personnalisation selon votre type de bien",
      "RÃ©sultats instantanÃ©s et dÃ©taillÃ©s",
      "Analyse de rentabilitÃ© complÃ¨te"
    ],
    "audience": {
      "@type": "Audience",
      "audienceType": "PropriÃ©taires immobiliers et investisseurs"
    },
    "inLanguage": "fr-FR"
  };
};

// Helper function to create slug (copied from conciergerieUtils to avoid circular import)
const createConciergerieSlug = (nom: string): string => {
  if (!nom) return '';
  
  return nom
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
};

