// Canonical JSON-LD models and helpers (pure functions only)
// All functions accept POJO inputs and return JSON-LD objects

export const BASE_URL = "https://proprioadvisor.fr";
export const LANG = "fr-FR";
export const OPENING_HOURS = [
  "Mo-Fr 09:00-18:00",
  "Sa 09:00-17:00",
] as const;

export const AUDIENCE = {
  "@type": "Audience",
  audienceType: "Propriétaires de biens immobiliers",
} as const;

export function absUrl(pathOrUrl: string | undefined | null): string | undefined {
  if (!pathOrUrl) return undefined;
  try {
    // Already absolute
    if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl;
    // Ensure leading slash
    const normalized = pathOrUrl.startsWith("/") ? pathOrUrl : `/${pathOrUrl}`;
    return `${BASE_URL}${normalized}`;
  } catch {
    return undefined;
  }
}

export function iso(date: string | number | Date | undefined | null): string | undefined {
  if (!date) return undefined;
  try {
    const d = new Date(date);
    if (isNaN(d.getTime())) return undefined;
    return d.toISOString();
  } catch {
    return undefined;
  }
}

export function imageOrPlaceholder(url: string | undefined | null): { "@type": "ImageObject"; url: string; width?: number; height?: number } {
  const finalUrl = absUrl(url || "/placeholder.svg")!;
  // Optionally include dimensions when known
  return { "@type": "ImageObject", url: finalUrl };
}

export function validateName(name: string | null | undefined, fallback: string): string {
  if (!name || typeof name !== "string") return fallback;
  const clean = name.trim();
  return clean.length > 0 ? clean : fallback;
}

export function priceRangeFromFormules(formules: Array<{ commission?: number | null }>): string | undefined {
  const commissions = (formules || [])
    .map(f => (typeof f.commission === "number" ? f.commission : undefined))
    .filter((n): n is number => typeof n === "number" && n > 0);

  if (commissions.length === 0) return undefined;
  const min = Math.min(...commissions);
  const max = Math.max(...commissions);
  if (min === max) return `Commission de ${min}% sur revenus`;
  return `Commission de ${min}% à ${max}% sur revenus`;
}

export function unitPriceSpecificationFromCommission(commission?: number | null) {
  if (!commission || commission <= 0) return undefined;
  return {
    "@type": "UnitPriceSpecification",
    price: commission,
    unitText: "percent",
  };
}

// Builders

export function orgJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${BASE_URL}/#organization`,
    name: "ProprioAdvisor",
    url: BASE_URL,
    logo: imageOrPlaceholder("/favicon.svg"),
    description: "Comparateur de conciergeries Airbnb en France",
    foundingDate: "2024",
    founder: { "@type": "Person", name: "David Vauclin", jobTitle: "Expert en location courte durée" },
    areaServed: { "@type": "Country", name: "France" },
    serviceType: "Comparateur de conciergeries Airbnb",
    sameAs: [
      "https://www.linkedin.com/company/proprioadvisor",
      "https://twitter.com/proprioadvisor",
      "https://www.facebook.com/proprioadvisor",
    ],
    contactPoint: { "@type": "ContactPoint", contactType: "customer service", email: "contact@proprioadvisor.fr" },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Services ProprioAdvisor",
      itemListElement: [
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "Comparateur de conciergeries", description: "Comparaison gratuite des meilleures conciergeries Airbnb" } },
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "Simulateur de revenus Airbnb", description: "Estimation gratuite de vos revenus potentiels" } },
      ],
    },
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${BASE_URL}/#website`,
    name: "ProprioAdvisor",
    url: BASE_URL,
    inLanguage: LANG,
    publisher: { "@id": `${BASE_URL}/#organization` },
    potentialAction: {
      "@type": "SearchAction",
      target: { "@type": "EntryPoint", urlTemplate: `${BASE_URL}/conciergerie/{search_term_string}` },
      "query-input": "required name=search_term_string",
    },
  };
}

export function breadcrumbsJsonLd(items: Array<{ name: string; url?: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      ...(item.url ? { item: absUrl(item.url) } : {}),
    })),
  };
}

export function articleJsonLd(article: any, opts?: { imageUrl?: string }) {
  const image = imageOrPlaceholder(opts?.imageUrl || article?.image);
  const webPageId = `${BASE_URL}/${article?.slug}`;
  const data: any = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article?.titre,
    description: article?.description,
    image,
    inLanguage: LANG,
    author: { "@type": "Person", name: "David Vauclin" },
    publisher: { "@id": `${BASE_URL}/#organization` },
    // Robustly infer dates from multiple possible fields
    datePublished: iso(article?.date_creation || article?.createdAt || article?.datePublication),
    dateModified:
      iso(article?.date_modification || article?.updatedAt || article?.datePublication) ||
      iso(article?.date_creation || article?.createdAt),
    mainEntityOfPage: { "@type": "WebPage", "@id": webPageId },
  };
  if (article?.keywords) data.keywords = article.keywords;
  if (article?.articleSection) data.articleSection = article.articleSection;
  return data;
}

// Fonction améliorée pour les articles de blog avec BlogPosting
export function blogPostingJsonLd(article: any, opts?: { imageUrl?: string; readingTime?: number }) {
  const image = imageOrPlaceholder(opts?.imageUrl || article?.image);
  const webPageId = `${BASE_URL}/${article?.slug}`;
  const articleId = `${BASE_URL}/${article?.slug}#article`;
  
  const data: any = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": articleId,
    headline: article?.titre,
    description: article?.excerpt || article?.resume || article?.titre,
    image,
    inLanguage: LANG,
    author: { 
      "@type": "Person", 
      name: "David Vauclin",
      jobTitle: "Expert en location courte durée",
      url: "https://proprioadvisor.fr/a-propos"
    },
    publisher: { "@id": `${BASE_URL}/#organization` },
    datePublished: iso(article?.date_creation || article?.createdAt || article?.datePublication),
    dateModified: iso(article?.date_modification || article?.updatedAt || article?.datePublication) ||
                  iso(article?.date_creation || article?.createdAt),
    mainEntityOfPage: { "@type": "WebPage", "@id": webPageId },
    articleSection: "Conciergerie Airbnb",
    about: {
      "@type": "Thing",
      name: "Conciergerie Airbnb",
      description: "Services de gestion de locations courte durée"
    },
    audience: AUDIENCE,
    keywords: ["conciergerie", "airbnb", "location courte durée", "gestion locative", "propriétaire"],
  };

  // Ajouter le temps de lecture si fourni
  if (opts?.readingTime) {
    data.timeRequired = `PT${opts.readingTime}M`;
  }

  // Ajouter des mots-clés spécifiques si disponibles
  if (article?.keywords) {
    data.keywords = Array.isArray(article.keywords) 
      ? article.keywords.join(", ") 
      : article.keywords;
  }

  return data;
}

// Fonction pour les FAQ structurées
export function faqJsonLd(article: any) {
  const faqs = [];
  
  // Extraire les questions/réponses de l'article
  for (let i = 1; i <= 5; i++) {
    const question = article?.[`question_${i}`];
    const reponse = article?.[`reponse_${i}`];
    
    if (question && reponse) {
      faqs.push({
        "@type": "Question",
        name: question,
        acceptedAnswer: {
          "@type": "Answer",
          text: reponse.replace(/<[^>]*>/g, '') // Enlever le HTML pour le texte
        }
      });
    }
  }

  if (faqs.length === 0) return null;

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs,
    inLanguage: LANG,
    about: {
      "@type": "Thing",
      name: "Conciergerie Airbnb",
      description: "Questions fréquentes sur les services de conciergerie"
    }
  };
}

// Fonction pour la page web de l'article
export function articleWebPageJsonLd(article: any) {
  const webPageId = `${BASE_URL}/${article?.slug}`;
  
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": webPageId,
    name: article?.titre,
    description: article?.excerpt || article?.resume || article?.titre,
    url: webPageId,
    inLanguage: LANG,
    isPartOf: { "@id": `${BASE_URL}/#website` },
    about: {
      "@type": "Thing",
      name: "Conciergerie Airbnb",
      description: "Services de gestion de locations courte durée"
    },
    audience: AUDIENCE,
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Blog",
          item: `${BASE_URL}/blog`
        },
        {
          "@type": "ListItem",
          position: 2,
          name: article?.titre,
          item: webPageId
        }
      ]
    }
  };
}

// Fonction pour la page blog (CollectionPage)
export function blogCollectionPageJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${BASE_URL}/blog#collection`,
    name: "Blog ProprioAdvisor",
    description: "Articles et conseils sur la conciergerie Airbnb et la location courte durée",
    url: `${BASE_URL}/blog`,
    inLanguage: LANG,
    isPartOf: { "@id": `${BASE_URL}/#website` },
    about: {
      "@type": "Thing",
      name: "Conciergerie Airbnb",
      description: "Services de gestion de locations courte durée"
    },
    audience: AUDIENCE,
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Blog",
          item: `${BASE_URL}/blog`
        }
      ]
    }
  };
}

// Fonction pour la liste des articles du blog
export function blogItemListJsonLd(articles: any[]) {
  const itemListElement = articles.slice(0, 10).map((article, index) => ({
    "@type": "ListItem",
    position: index + 1,
    item: {
      "@type": "BlogPosting",
      "@id": `${BASE_URL}/${article.slug}#article`,
      headline: article.titre,
      description: article.excerpt || article.resume || article.titre,
      url: `${BASE_URL}/${article.slug}`,
      image: imageOrPlaceholder(article.image),
      datePublished: iso(article.date_creation || article.createdAt || article.datePublication),
      dateModified: iso(article.date_modification || article.updatedAt || article.datePublication) ||
                   iso(article.date_creation || article.createdAt),
      author: { 
        "@type": "Person", 
        name: "David Vauclin",
        jobTitle: "Expert en location courte durée"
      },
      publisher: { "@id": `${BASE_URL}/#organization` },
      inLanguage: LANG,
      articleSection: "Conciergerie Airbnb"
    }
  }));

  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "@id": `${BASE_URL}/blog#itemlist`,
    name: "Articles du blog ProprioAdvisor",
    description: "Liste des articles sur la conciergerie Airbnb et la location courte durée",
    url: `${BASE_URL}/blog`,
    numberOfItems: itemListElement.length,
    itemListElement,
    inLanguage: LANG,
    about: {
      "@type": "Thing",
      name: "Conciergerie Airbnb",
      description: "Services de gestion de locations courte durée"
    },
    audience: AUDIENCE
  };
}

// Fonction pour les données structurées Place d'une ville
export function cityPlaceJsonLd(ville: { 
  nom: string; 
  slug: string; 
  description?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  departementNom?: string;
  departementNumero?: string;
}) {
  const placeId = `${BASE_URL}/conciergerie/${ville.slug}#place`;
  
  const data: any = {
    "@context": "https://schema.org",
    "@type": "City",
    "@id": placeId,
    name: ville.nom,
    description: ville.description || `Ville de ${ville.nom} en France`,
    url: `${BASE_URL}/conciergerie/${ville.slug}`,
    address: {
      "@type": "PostalAddress",
      addressLocality: ville.nom,
      addressCountry: "FR",
      ...(ville.departementNom ? { addressRegion: ville.departementNom } : {}),
      ...(ville.departementNumero ? { postalCode: ville.departementNumero } : {})
    },
    containedInPlace: {
      "@type": "Country",
      name: "France"
    }
  };

  // Ajouter les coordonnées géographiques si disponibles
  if (ville.latitude && ville.longitude) {
    data.geo = {
      "@type": "GeoCoordinates",
      latitude: ville.latitude,
      longitude: ville.longitude
    };
  }

  // Ajouter le département si disponible
  if (ville.departementNom) {
    data.containedInPlace = {
      "@type": "AdministrativeArea",
      name: ville.departementNom,
      containedInPlace: {
        "@type": "Country",
        name: "France"
      }
    };
  }

  return data;
}

// Fonction pour la page web de ville
export function cityWebPageJsonLd(ville: { 
  nom: string; 
  slug: string; 
  description?: string | null;
  conciergerie_count?: number;
}) {
  const webPageId = `${BASE_URL}/conciergerie/${ville.slug}`;
  
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": webPageId,
    name: `Conciergeries Airbnb à ${ville.nom}`,
    description: ville.description || `Découvrez les meilleures conciergeries Airbnb à ${ville.nom}. Comparez gratuitement les services, tarifs et avis.`,
    url: webPageId,
    inLanguage: LANG,
    isPartOf: { "@id": `${BASE_URL}/#website` },
    about: {
      "@type": "City",
      name: ville.nom,
      address: {
        "@type": "PostalAddress",
        addressLocality: ville.nom,
        addressCountry: "FR"
      }
    },
    audience: AUDIENCE,
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Accueil",
          item: BASE_URL
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Conciergeries",
          item: `${BASE_URL}/annuaire`
        },
        {
          "@type": "ListItem",
          position: 3,
          name: ville.nom,
          item: webPageId
        }
      ]
    },
    ...(ville.conciergerie_count ? { 
      mainEntity: {
        "@type": "ItemList",
        numberOfItems: ville.conciergerie_count,
        name: `Conciergeries Airbnb à ${ville.nom}`
      }
    } : {})
  };
}

// Fonction pour la page de collection de ville
export function cityCollectionPageJsonLd(ville: { 
  nom: string; 
  slug: string; 
  description?: string | null;
  conciergerie_count?: number;
}) {
  const collectionId = `${BASE_URL}/conciergerie/${ville.slug}#collection`;
  
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": collectionId,
    name: `Conciergeries Airbnb à ${ville.nom}`,
    description: ville.description || `Collection des meilleures conciergeries Airbnb à ${ville.nom}. Comparaison détaillée des services, tarifs et avis clients.`,
    url: `${BASE_URL}/conciergerie/${ville.slug}`,
    inLanguage: LANG,
    isPartOf: { "@id": `${BASE_URL}/#website` },
    about: {
      "@type": "City",
      name: ville.nom,
      address: {
        "@type": "PostalAddress",
        addressLocality: ville.nom,
        addressCountry: "FR"
      }
    },
    audience: AUDIENCE,
    mainEntity: {
      "@type": "ItemList",
      name: `Conciergeries Airbnb à ${ville.nom}`,
      description: `Liste des conciergeries disponibles à ${ville.nom}`,
      ...(ville.conciergerie_count ? { numberOfItems: ville.conciergerie_count } : {})
    }
  };
}

// Fonction pour les services de conciergerie dans une ville
export function conciergerieServiceJsonLd(ville: { nom: string; slug: string }) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${BASE_URL}/conciergerie/${ville.slug}#service`,
    name: `Services de conciergerie Airbnb à ${ville.nom}`,
    description: `Services complets de gestion de locations Airbnb à ${ville.nom}. Accueil voyageurs, ménage, maintenance, gestion des réservations.`,
    provider: { "@id": `${BASE_URL}/#organization` },
    areaServed: {
      "@type": "City",
      name: ville.nom,
      address: {
        "@type": "PostalAddress",
        addressLocality: ville.nom,
        addressCountry: "FR"
      }
    },
    serviceType: "Conciergerie Airbnb",
    category: "Services de gestion locative",
    audience: AUDIENCE,
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Services de conciergerie Airbnb",
      itemListElement: [
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Accueil des voyageurs",
            description: "Réception et accueil des voyageurs Airbnb"
          }
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Ménage et entretien",
            description: "Nettoyage et entretien entre les locations"
          }
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Gestion des réservations",
            description: "Gestion complète des réservations Airbnb"
          }
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Maintenance",
            description: "Maintenance et réparations du bien"
          }
        }
      ]
    }
  };
}

// Types used by listing builder
export interface GroupedConciergerieEntry {
  conciergerie: {
    id: string;
    nom: string;
    score?: number | null;
    logo?: string | null;
    telephoneContact?: string | null;
  };
  formules: Array<{
    nom?: string | null;
    commission?: number | null;
    createdAt?: string | null;
  }>;
  bestFormule?: { commission?: number | null } | null;
  // Visibility-coupled rating (should match UI)
  aggregateRating?: { ratingValue: number; reviewCount: number } | null;
}

export function listingItemListJsonLd(
  ville: { nom: string; slug: string; description?: string | null },
  grouped: GroupedConciergerieEntry[],
  meta?: { dateCreated?: string | number | Date; dateModified?: string | number | Date }
) {
  const entries = (grouped || [])
    .filter(e => (e.conciergerie?.score ?? 0) > 0);

  const itemListElement = entries.map((entry, index) => {
    const c = entry.conciergerie;
    const slug = createConciergerieSlug(c.nom);
    const detailsUrl = `${BASE_URL}/conciergerie-details/${slug}`;
    const priceRange = priceRangeFromFormules(entry.formules);

    const offers = (entry.formules || []).map(f => ({
      "@type": "Offer",
      name: validateName(f.nom || undefined, "Formule de conciergerie"),
      description: `Formule ${validateName(f.nom || undefined, "standard")} - Gestion complète Airbnb`,
      ...(unitPriceSpecificationFromCommission(f.commission) ? { priceSpecification: unitPriceSpecificationFromCommission(f.commission) } : {}),
      itemOffered: {
        "@type": "Service",
        name: `Gestion Airbnb - ${validateName(f.nom || undefined, "Formule standard")}`,
        description: "Accueil voyageurs, ménage, maintenance, gestion des réservations",
      },
    }));

    const item: any = {
      "@type": "LocalBusiness",
      "@id": detailsUrl,
      name: c.nom,
      description: `Conciergerie Airbnb ${c.nom}. Gestion complète et professionnelle à ${ville.nom}.`,
      logo: imageOrPlaceholder(c.logo || undefined),
      url: detailsUrl,
      areaServed: { "@type": "City", name: ville.nom, addressCountry: "FR" },
      serviceType: "Conciergerie Airbnb",
      ...(priceRange ? { priceRange } : {}),
      address: { "@type": "PostalAddress", addressLocality: ville.nom, addressCountry: "FR" },
      openingHours: OPENING_HOURS,
      ...(c.telephoneContact ? { telephone: c.telephoneContact } : {}),
      parentOrganization: { "@id": `${BASE_URL}/#organization` },
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "Services de conciergerie Airbnb",
        itemListElement: offers,
      },
    };

    if (entry.aggregateRating && entry.aggregateRating.reviewCount > 0) {
      item.aggregateRating = {
        "@type": "AggregateRating",
        ratingValue: entry.aggregateRating.ratingValue,
        reviewCount: entry.aggregateRating.reviewCount,
        bestRating: 5,
        worstRating: 1,
      };
    }

    return {
      "@type": "ListItem",
      position: index + 1,
      item,
    };
  });

  const root: any = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `Conciergeries Airbnb à ${ville.nom}`,
    description: ville.description || `Découvrez les meilleures conciergeries à ${ville.nom} pour gérer votre logement en location courte durée. Comparaison détaillée des services, tarifs et avis clients.`,
    url: `${BASE_URL}/conciergerie/${ville.slug}`,
    numberOfItems: itemListElement.length,
    itemListElement,
    about: { "@type": "Thing", name: "Conciergerie Airbnb" },
    audience: AUDIENCE,
    inLanguage: LANG,
  };

  if (meta?.dateModified) root.dateModified = iso(meta.dateModified);
  if (meta?.dateCreated) root.dateCreated = iso(meta.dateCreated);

  return root;
}

export function conciergerieLocalBusinessJsonLd(
  conciergerie: { id: string; nom: string; score?: number | null; logo?: string | null; telephoneContact?: string | null; zoneCouverte?: string | null },
  formules: Array<{ nom?: string | null; commission?: number | null }>,
  villes?: Array<{ nom: string }>,
  opts?: { aggregateRating?: { ratingValue: number; reviewCount: number } | null }
) {
  if ((conciergerie.score ?? 0) <= 0) return null; // no JSON-LD for noindex pages

  const slug = createConciergerieSlug(conciergerie.nom);
  const detailsUrl = `${BASE_URL}/conciergerie-details/${slug}`;
  const priceRange = priceRangeFromFormules(formules);
  const areaServed = (villes && villes.length > 0)
    ? villes.map(v => ({ "@type": "City", name: v.nom, addressCountry: "FR" }))
    : [{ "@type": "Place", name: conciergerie.zoneCouverte || "France" }];

  const offers = (formules || []).map(f => ({
    "@type": "Offer",
    name: validateName(f.nom || undefined, "Formule de conciergerie"),
    description: `Formule ${validateName(f.nom || undefined, "standard")} - Service complet de gestion Airbnb`,
    ...(unitPriceSpecificationFromCommission(f.commission) ? { priceSpecification: unitPriceSpecificationFromCommission(f.commission) } : {}),
  }));

  const data: any = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": detailsUrl,
    name: conciergerie.nom,
    description: `${conciergerie.nom} est une conciergerie spécialisée dans la gestion complète de locations Airbnb.`,
    url: detailsUrl,
    areaServed,
    serviceType: "Conciergerie Airbnb",
    ...(priceRange ? { priceRange } : {}),
    openingHours: OPENING_HOURS,
    parentOrganization: { "@id": `${BASE_URL}/#organization` },
    logo: imageOrPlaceholder(conciergerie.logo || undefined),
  };

  if (conciergerie.telephoneContact) data.telephone = conciergerie.telephoneContact;
  if (offers.length > 0) {
    data.hasOfferCatalog = { "@type": "OfferCatalog", name: "Formules de conciergerie", itemListElement: offers };
  }
  if (opts?.aggregateRating && opts.aggregateRating.reviewCount > 0) {
    data.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: opts.aggregateRating.ratingValue,
      reviewCount: opts.aggregateRating.reviewCount,
      bestRating: 5,
      worstRating: 1,
    };
  }

  return data;
}

// Fonction pour la page web de détails de conciergerie
export function conciergerieWebPageJsonLd(conciergerie: { 
  nom: string; 
  slug: string; 
  description?: string | null;
  zoneCouverte?: string | null;
}) {
  const webPageId = `${BASE_URL}/conciergerie-details/${conciergerie.slug}`;
  
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": webPageId,
    name: `${conciergerie.nom} - Conciergerie Airbnb`,
    description: conciergerie.description || `Découvrez ${conciergerie.nom}, conciergerie Airbnb spécialisée dans la gestion de locations courte durée.`,
    url: webPageId,
    inLanguage: LANG,
    isPartOf: { "@id": `${BASE_URL}/#website` },
    about: {
      "@type": "LocalBusiness",
      name: conciergerie.nom,
      serviceType: "Conciergerie Airbnb",
      areaServed: {
        "@type": "Place",
        name: conciergerie.zoneCouverte || "France"
      }
    },
    audience: AUDIENCE,
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Accueil",
          item: BASE_URL
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Conciergeries",
          item: `${BASE_URL}/annuaire`
        },
        {
          "@type": "ListItem",
          position: 3,
          name: conciergerie.nom,
          item: webPageId
        }
      ]
    }
  };
}

// Fonction pour les services détaillés de conciergerie
export function conciergerieDetailedServiceJsonLd(conciergerie: { 
  nom: string; 
  slug: string; 
  description?: string | null;
  zoneCouverte?: string | null;
  telephoneContact?: string | null;
}) {
  const serviceId = `${BASE_URL}/conciergerie-details/${conciergerie.slug}#service`;
  
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": serviceId,
    name: `Services de conciergerie Airbnb - ${conciergerie.nom}`,
    description: conciergerie.description || `Services complets de gestion de locations Airbnb par ${conciergerie.nom}. Accueil voyageurs, ménage, maintenance, gestion des réservations.`,
    provider: {
      "@type": "LocalBusiness",
      name: conciergerie.nom,
      url: `${BASE_URL}/conciergerie-details/${conciergerie.slug}`,
      ...(conciergerie.telephoneContact ? { telephone: conciergerie.telephoneContact } : {})
    },
    areaServed: {
      "@type": "Place",
      name: conciergerie.zoneCouverte || "France"
    },
    serviceType: "Conciergerie Airbnb",
    category: "Services de gestion locative",
    audience: AUDIENCE,
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Services de conciergerie Airbnb",
      itemListElement: [
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Accueil des voyageurs",
            description: "Réception et accueil personnalisé des voyageurs Airbnb"
          }
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Ménage et entretien",
            description: "Nettoyage professionnel et entretien entre les locations"
          }
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Gestion des réservations",
            description: "Gestion complète des réservations et communication avec les voyageurs"
          }
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Maintenance et réparations",
            description: "Maintenance préventive et réparations d'urgence"
          }
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Optimisation des revenus",
            description: "Stratégies de pricing et optimisation du taux d'occupation"
          }
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Gestion administrative",
            description: "Gestion des contrats, factures et obligations légales"
          }
        }
      ]
    }
  };
}

// Fonction pour les avis structurés
export function conciergerieReviewsJsonLd(conciergerie: { 
  nom: string; 
  slug: string; 
}, reviews: Array<{
  id: string;
  note: number;
  commentaire?: string;
  auteur?: string;
  date?: string;
}>) {
  if (!reviews || reviews.length === 0) return null;

  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${BASE_URL}/conciergerie-details/${conciergerie.slug}`,
    name: conciergerie.nom,
    review: reviews.map(review => ({
      "@type": "Review",
      reviewRating: {
        "@type": "Rating",
        ratingValue: review.note,
        bestRating: 5,
        worstRating: 1
      },
      author: {
        "@type": "Person",
        name: review.auteur || "Client anonyme"
      },
      reviewBody: review.commentaire || "",
      datePublished: review.date || new Date().toISOString()
    }))
  };
}

export function webAppJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Simulateur de revenus Airbnb",
    description: "Estimez gratuitement et immédiatement vos revenus potentiels sur Airbnb.",
    url: `${BASE_URL}/simulateur-airbnb`,
    applicationCategory: "FinanceApplication",
    operatingSystem: "Web",
    browserRequirements: "HTML5, CSS3, JavaScript",
    offers: { "@type": "Offer", price: "0", priceCurrency: "EUR" },
    featureList: [
      "Estimation des revenus Airbnb personnalisée",
      "Comparaison avec/sans conciergerie",
      "Personnalisation selon votre type de bien",
      "Résultats instantanés et détaillés",
      "Analyse de rentabilité complète",
    ],
    audience: AUDIENCE,
    inLanguage: LANG,
  };
}

// Fonction pour la page d'accueil
export function homePageJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${BASE_URL}/#homepage`,
    name: "ProprioAdvisor - Comparateur de conciergeries Airbnb",
    description: "ProprioAdvisor vous aide à trouver la meilleure conciergerie pour votre bien en location courte durée. Comparaison gratuite des services, tarifs et avis.",
    url: BASE_URL,
    inLanguage: LANG,
    isPartOf: { "@id": `${BASE_URL}/#website` },
    about: {
      "@type": "Organization",
      name: "ProprioAdvisor",
      description: "Comparateur de conciergeries Airbnb en France"
    },
    audience: AUDIENCE,
    mainEntity: {
      "@type": "ItemList",
      name: "Services ProprioAdvisor",
      description: "Comparateur de conciergeries, simulateur de revenus, annuaire spécialisé",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          item: {
            "@type": "Service",
            name: "Comparateur de conciergeries",
            description: "Comparez gratuitement les meilleures conciergeries Airbnb"
          }
        },
        {
          "@type": "ListItem",
          position: 2,
          item: {
            "@type": "Service",
            name: "Simulateur de revenus",
            description: "Estimez vos revenus potentiels sur Airbnb"
          }
        },
        {
          "@type": "ListItem",
          position: 3,
          item: {
            "@type": "Service",
            name: "Annuaire spécialisé",
            description: "Découvrez toutes les conciergeries par ville"
          }
        }
      ]
    }
  };
}

// Fonction pour la page d'inscription
export function inscriptionPageJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${BASE_URL}/inscription`,
    name: "Inscription - ProprioAdvisor",
    description: "Inscrivez-vous sur ProprioAdvisor pour accéder à nos services de comparaison de conciergeries Airbnb et optimiser votre location courte durée.",
    url: `${BASE_URL}/inscription`,
    inLanguage: LANG,
    isPartOf: { "@id": `${BASE_URL}/#website` },
    about: {
      "@type": "Service",
      name: "Inscription ProprioAdvisor",
      description: "Service d'inscription pour accéder aux fonctionnalités avancées"
    },
    audience: AUDIENCE,
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Accueil",
          item: BASE_URL
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Inscription",
          item: `${BASE_URL}/inscription`
        }
      ]
    }
  };
}

// Fonction pour la page à propos
export function aboutPageJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "@id": `${BASE_URL}/a-propos`,
    name: "À propos de ProprioAdvisor",
    description: "Découvrez l'histoire, la mission et les valeurs de ProprioAdvisor, le comparateur de conciergeries Airbnb de référence en France.",
    url: `${BASE_URL}/a-propos`,
    inLanguage: LANG,
    isPartOf: { "@id": `${BASE_URL}/#website` },
    about: {
      "@type": "Organization",
      name: "ProprioAdvisor",
      description: "Comparateur de conciergeries Airbnb en France",
      founder: {
        "@type": "Person",
        name: "David Vauclin",
        jobTitle: "Expert en location courte durée"
      },
      foundingDate: "2024",
      areaServed: {
        "@type": "Country",
        name: "France"
      }
    },
    audience: AUDIENCE,
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Accueil",
          item: BASE_URL
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "À propos",
          item: `${BASE_URL}/a-propos`
        }
      ]
    }
  };
}

// Fonction pour la page de contact
export function contactPageJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "@id": `${BASE_URL}/contact`,
    name: "Contact - ProprioAdvisor",
    description: "Contactez l'équipe ProprioAdvisor pour toute question sur nos services de comparaison de conciergeries Airbnb et d'optimisation de location courte durée.",
    url: `${BASE_URL}/contact`,
    inLanguage: LANG,
    isPartOf: { "@id": `${BASE_URL}/#website` },
    about: {
      "@type": "Organization",
      name: "ProprioAdvisor",
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "customer service",
        email: "contact@proprioadvisor.fr",
        availableLanguage: "French"
      }
    },
    audience: AUDIENCE,
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Accueil",
          item: BASE_URL
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Contact",
          item: `${BASE_URL}/contact`
        }
      ]
    }
  };
}

// Local helper copied to avoid circular dep
function createConciergerieSlug(nom: string): string {
  if (!nom) return "";
  return nom
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
}


