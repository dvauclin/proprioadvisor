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
  const webPageId = `${BASE_URL}/blog/${article?.slug}`;
  const data: any = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article?.titre,
    description: article?.description,
    image,
    inLanguage: LANG,
    author: { "@type": "Person", name: "David Vauclin" },
    publisher: { "@id": `${BASE_URL}/#organization` },
    datePublished: iso(article?.date_creation),
    dateModified: iso(article?.date_modification) || iso(article?.date_creation),
    mainEntityOfPage: { "@type": "WebPage", "@id": webPageId },
  };
  if (article?.keywords) data.keywords = article.keywords;
  if (article?.articleSection) data.articleSection = article.articleSection;
  return data;
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


