import {
  getVilleBySlug,
  getFormulesByVilleId,
  filterFormules,
  getConciergerieById,
  submitLead,
  servicesOptions,
  propertyTypeOptions,
  getRecentArticles,
  getArticleBySlug,
  getConciergeriesToValidate,
  getLeads,
  getAllVilles
} from "@/services/supabaseService";
import { transformConciergerieFromDB } from "@/services/conciergerieTransformService";

import { supabase } from "@/integrations/supabase/client";
import { Article, Conciergerie, Formule, Lead, Ville } from "@/types";

// Re-export all the functions
export {
  getVilleBySlug,
  getFormulesByVilleId,
  filterFormules,
  getConciergerieById,
  submitLead,
  servicesOptions,
  propertyTypeOptions,
  getRecentArticles,
  getArticleBySlug,
  getConciergeriesToValidate,
  getLeads,
  getAllVilles
};

// New function to get all conciergeries with their formules
export const getAllConciergeries = async (): Promise<Conciergerie[]> => {
  console.log("x getAllConciergeries: Starting Supabase query...");
  console.log("x getAllConciergeries: Using supabase client:", typeof supabase);
  
  const { data, error } = await supabase
    .from('conciergeries')
    .select(`
      *,
      formules (*),
      subscriptions (
        id,
        conciergerie_id,
        website_link,
        phone_number,
        website_url,
        phone_number_value,
        payment_status,
        total_points,
        monthly_amount,
        created_at
      )
    `);

  console.log("x getAllConciergeries: Supabase response:", { 
    data: data ? `${data.length} records` : 'null', 
    error: error ? error.message : 'null',
    hasData: !!data,
    dataType: typeof data
  });

  if (error) {
    console.error("R getAllConciergeries: Error fetching conciergeries:", error);
    throw error;
  }
  
  if (!data) {
    console.log("a️ getAllConciergeries: No data returned");
    return [];
  }

  console.log("S& getAllConciergeries: Successfully fetched", data.length, "conciergeries");
  console.log("S& getAllConciergeries: First record sample:", data[0]);
  console.log("S& getAllConciergeries: First record subscriptions:", data[0]?.subscriptions);
  
  // x DIAGNOSTIC: Log Aurora Conciergerie specifically
  const auroraConciergerie = data.find(c => c.nom?.toLowerCase().includes('aurora'));
  if (auroraConciergerie) {
    const latestSubscription = auroraConciergerie.subscriptions?.[0];
    console.log("xRx FOUND Aurora Conciergerie:", {
      nom: auroraConciergerie.nom,
      scoreManuel: auroraConciergerie.score_manuel,
      totalPoints: latestSubscription?.total_points,
      effectiveScore: auroraConciergerie.score_manuel ?? (latestSubscription?.total_points || 0),
      createdAt: auroraConciergerie.created_at,
      subscriptions: auroraConciergerie.subscriptions?.length || 0,
      formules: auroraConciergerie.formules?.length || 0
    });
  } else {
    console.log("R Aurora Conciergerie NOT FOUND in data");
  }
  
  const transformedData = data.map(transformConciergerieFromDB);
  console.log("S& getAllConciergeries: Transformed data count:", transformedData.length);
  
  // x DIAGNOSTIC: Log all conciergeries with effective scores
  console.log("x ALL CONCIERGERIES EFFECTIVE SCORES:");
  transformedData.forEach(c => {
    const effectiveScore = c.scoreManuel ?? 0;
    console.log(`  - ${c.nom}: effectiveScore=${effectiveScore} (scoreManuel=${c.scoreManuel}), createdAt=${c.createdAt}`);
  });
  
  return transformedData;
};

// Mock data for fallback
// This will still be used as fallback data while preserving the original code
export const villes: Ville[] = [
  {
    id: "paris",
    nom: "Paris",
    description: "La capitale française, connue pour ses monuments emblématiques.",
    descriptionLongue: "Paris, la ville lumière, capitale de la France et l'une des destinations touristiques les plus visitées au monde.",
    titleSeo: "Meilleures conciergeries Airbnb à Paris | ProprioAdvisor",
    slug: "paris",
    latitude: 48.8566,
    longitude: 2.3522,
    villesLiees: ["versailles", "boulogne-billancourt"]
  },
  {
    id: "lyon",
    nom: "Lyon",
    description: "Capitale gastronomique de la France avec un riche patrimoine historique.",
    descriptionLongue: "Lyon, troisième ville de France, reconnue pour sa gastronomie exceptionnelle et son patrimoine architectural Renaissance.",
    titleSeo: "Meilleures conciergeries Airbnb à Lyon | ProprioAdvisor",
    slug: "lyon",
    latitude: 45.7640,
    longitude: 4.8357,
    villesLiees: ["villeurbanne", "saint-etienne"]
  },
  {
    id: "marseille",
    nom: "Marseille",
    description: "Plus ancienne ville de France et principal port maritime du pays.",
    descriptionLongue: "Marseille, cité phocéenne fondée en 600 av. J.-C., plus ancienne ville de France et grande métropole méditerranéenne.",
    titleSeo: "Meilleures conciergeries Airbnb à Marseille | ProprioAdvisor",
    slug: "marseille",
    latitude: 43.2965,
    longitude: 5.3698,
    villesLiees: ["aix-en-provence", "cassis"]
  },
  {
    id: "nice",
    nom: "Nice",
    description: "Ville de la Côte d'Azur connue pour sa Promenade des Anglais.",
    descriptionLongue: "Nice, perle de la Côte d'Azur, célèbre pour sa Promenade des Anglais et son climat méditerranéen exceptionnel.",
    titleSeo: "Meilleures conciergeries Airbnb à Nice | ProprioAdvisor",
    slug: "nice",
    latitude: 43.7102,
    longitude: 7.2620,
    villesLiees: ["cannes", "antibes"]
  },
  {
    id: "bordeaux",
    nom: "Bordeaux",
    description: "Ville du sud-ouest de la France réputée pour son vin et son patrimoine architectural.",
    descriptionLongue: "Bordeaux, capitale mondiale du vin, inscrite au patrimoine mondial de l'UNESCO pour son ensemble urbain exceptionnel.",
    titleSeo: "Meilleures conciergeries Airbnb à Bordeaux | ProprioAdvisor",
    slug: "bordeaux",
    latitude: 44.8378,
    longitude: -0.5792,
    villesLiees: ["saint-emilion", "arcachon"]
  }
];

export const conciergeries: Conciergerie[] = [
  {
    id: "luxhome",
    nom: "LuxHome Concierge",
    mail: "contact@luxhome.fr",
    logo: "/placeholder.svg",
    typeLogementAccepte: "luxe",
    superficieMin: 50,
    nombreChambresMin: 2,
    deductionFrais: "deductTous",
    tva: "TTC",
    accepteGestionPartielle: false,
    accepteResidencePrincipale: false,
    validated: true,
    villeId: "paris",
    villesIds: ["paris", "nice"],
    zoneCouverte: "Centre-ville et quartiers haut de gamme",
    score: 8
  },
  {
    id: "easystay",
    nom: "EasyStay",
    mail: "info@easystay.fr",
    logo: "/placeholder.svg",
    typeLogementAccepte: "standard",
    superficieMin: 20,
    nombreChambresMin: 1,
    deductionFrais: "inclus",
    tva: "TTC",
    accepteGestionPartielle: true,
    accepteResidencePrincipale: true,
    validated: true,
    villeId: "paris",
    villesIds: ["paris", "lyon", "marseille"],
    zoneCouverte: "Toute la ville",
    score: 6
  },
  {
    id: "vipbnb",
    nom: "VIPbnb",
    mail: "reservation@vipbnb.fr",
    logo: "/placeholder.svg",
    typeLogementAccepte: "luxe",
    superficieMin: 75,
    nombreChambresMin: 3,
    deductionFrais: "deductMenage",
    tva: "HT",
    accepteGestionPartielle: false,
    accepteResidencePrincipale: false,
    validated: true,
    villeId: "paris",
    villesIds: ["paris", "nice", "bordeaux"],
    zoneCouverte: "Zones prestigieuses uniquement",
    score: 9
  },
  {
    id: "smarthost",
    nom: "SmartHost",
    mail: "hello@smarthost.fr",
    logo: "/placeholder.svg",
    typeLogementAccepte: "standard",
    superficieMin: 30,
    nombreChambresMin: 1,
    deductionFrais: "deductTous",
    tva: "TTC",
    accepteGestionPartielle: true,
    accepteResidencePrincipale: true,
    validated: true,
    villeId: "lyon",
    villesIds: ["lyon", "marseille", "bordeaux"],
    zoneCouverte: "Toute la ville sauf périphérie",
    score: 7
  },
  {
    id: "keymaster",
    nom: "KeyMaster",
    mail: "contact@keymaster.fr",
    logo: "/placeholder.svg",
    typeLogementAccepte: "tous",
    superficieMin: 25,
    nombreChambresMin: 1,
    deductionFrais: "inclus",
    tva: "TTC",
    accepteGestionPartielle: true,
    accepteResidencePrincipale: false,
    validated: false,
    villeId: "lyon",
    villesIds: ["lyon"],
    zoneCouverte: "Centre ville uniquement",
    score: 0
  }
];

export const formules: Formule[] = [
  {
    id: "luxhome-premium",
    nom: "Premium",
    conciergerieId: "luxhome",
    commission: 18,
    dureeGestionMin: 6,
    servicesInclus: ["ménage", "blanchisserie", "checkin", "gestion-annonce", "conciergerie-24-7"],
    fraisMenageHeure: 35,
    fraisDemarrage: 250,
    abonnementMensuel: 0,
    fraisReapprovisionnement: "forfait",
    forfaitReapprovisionnement: 50,
    locationLinge: "inclus",
    prixLocationLinge: 0,
    fraisSupplementaireLocation: 0,
    createdAt: "2024-01-01T00:00:00.000Z"
  },
  {
    id: "easystay-essentiel",
    nom: "Essentiel",
    conciergerieId: "easystay",
    commission: 15,
    dureeGestionMin: 3,
    servicesInclus: ["ménage", "checkin", "gestion-annonce"],
    fraisMenageHeure: 25,
    fraisDemarrage: 120,
    abonnementMensuel: 0,
    fraisReapprovisionnement: "reel",
    forfaitReapprovisionnement: 0,
    locationLinge: "optionnel",
    prixLocationLinge: 15,
    fraisSupplementaireLocation: 0,
    createdAt: "2024-01-01T00:00:00.000Z"
  },
  {
    id: "vipbnb-excellence",
    nom: "Excellence",
    conciergerieId: "vipbnb",
    commission: 20,
    dureeGestionMin: 12,
    servicesInclus: ["ménage", "blanchisserie", "checkin", "gestion-annonce", "conciergerie-24-7", "chef-privé"],
    fraisMenageHeure: 40,
    fraisDemarrage: 500,
    abonnementMensuel: 0,
    fraisReapprovisionnement: "forfait",
    forfaitReapprovisionnement: 100,
    locationLinge: "inclus",
    prixLocationLinge: 0,
    fraisSupplementaireLocation: 0,
    createdAt: "2024-01-01T00:00:00.000Z"
  },
  {
    id: "smarthost-standard",
    nom: "Standard",
    conciergerieId: "smarthost",
    commission: 12,
    dureeGestionMin: 1,
    servicesInclus: ["ménage", "checkin", "gestion-annonce"],
    fraisMenageHeure: 20,
    fraisDemarrage: 80,
    abonnementMensuel: 40,
    fraisReapprovisionnement: "reel",
    forfaitReapprovisionnement: 0,
    locationLinge: "inclus",
    prixLocationLinge: 0,
    fraisSupplementaireLocation: 0,
    createdAt: "2024-01-01T00:00:00.000Z"
  },
  {
    id: "smarthost-plus",
    nom: "Plus",
    conciergerieId: "smarthost",
    commission: 15,
    dureeGestionMin: 3,
    servicesInclus: ["ménage", "blanchisserie", "checkin", "gestion-annonce"],
    fraisMenageHeure: 25,
    fraisDemarrage: 150,
    abonnementMensuel: 0,
    fraisReapprovisionnement: "inclus",
    forfaitReapprovisionnement: 0,
    locationLinge: "obligatoire",
    prixLocationLinge: 25,
    fraisSupplementaireLocation: 0,
    createdAt: "2024-01-01T00:00:00.000Z"
  }
];

// Link formules to conciergeries (keep this for local fallback data)
conciergeries.forEach(conciergerie => {
  if (!conciergerie.formules) {
    conciergerie.formules = formules.filter(
      formule => formule.conciergerieId === conciergerie.id
    );
  }
});

export const articles: Article[] = [
  {
    id: "1",
    titre: "Comment maximiser vos revenus Airbnb avec une conciergerie ?",
    contenu: "<p>Dans cet article, nous expliquons comment une conciergerie peut vous aider à optimiser votre rentabilité sur Airbnb...</p>",
    image: "/placeholder.svg",
    datePublication: "2025-03-15",
    slug: "maximiser-revenus-airbnb-conciergerie",
    excerpt: "Découvrez comment augmenter significativement vos revenus locatifs grâce aux services d'une conciergerie professionnelle."
  },
  {
    id: "2",
    titre: "Les 10 services essentiels qu'une bonne conciergerie doit offrir",
    contenu: "<p>Quels sont les services indispensables à exiger de votre conciergerie Airbnb ?</p>",
    image: "/placeholder.svg",
    datePublication: "2025-02-28",
    slug: "10-services-essentiels-conciergerie",
    excerpt: "Ne choisissez pas votre conciergerie au hasard. Voici ce que vous devriez attendre d'un service professionnel."
  },
  {
    id: "3",
    titre: "Comment calculer la rentabilité réelle de votre bien en location courte durée",
    contenu: "<p>Apprenez à calculer précisément vos marges après frais de conciergerie...</p>",
    image: "/placeholder.svg",
    datePublication: "2025-02-10",
    slug: "calculer-rentabilite-location-courte-duree",
    excerpt: "Tous les détails pour comprendre votre rentabilité après commission, frais de ménage et autres dépenses."
  },
  {
    id: "4",
    titre: "Comparatif : gestion par soi-même vs conciergerie",
    contenu: "<p>Faut-il gérer son bien soi-même ou passer par une conciergerie ? Analyse détaillée...</p>",
    image: "/placeholder.svg",
    datePublication: "2025-01-22",
    slug: "comparatif-gestion-seul-vs-conciergerie",
    excerpt: "Autogestion ou conciergerie ? Notre analyse complète pour faire le bon choix selon votre situation."
  },
  {
    id: "5",
    titre: "Les nouvelles réglementations pour la location courte durée en 2025",
    contenu: "<p>Tout ce que vous devez savoir sur les changements légaux concernant la location de courte durée...</p>",
    image: "/placeholder.svg",
    datePublication: "2025-01-05",
    slug: "nouvelles-reglementations-location-courte-duree-2025",
    excerpt: "Restez conforme avec les nouvelles réglementations qui encadrent la location courte durée en France."
  }
];

export const leads: Lead[] = [
  {
    id: "1",
    prestationsRecherchees: ["ménage", "checkin", "gestion-annonce"],
    dureeEspacementDisposition: "6a12mois",
    superficie: 65,
    nombreChambres: 2,
    typeBien: "standard",
    adresse: "23 rue des Lilas",
    ville: "Paris",
    nom: "Sophie Martin",
    telephone: "0612345678",
    mail: "sophie.martin@example.com",
    formuleId: "easystay-essentiel",
    date: "2025-04-12"
  },
  {
    id: "2",
    prestationsRecherchees: ["ménage", "checkin", "gestion-annonce", "conciergerie-24-7"],
    dureeEspacementDisposition: "plus1an",
    superficie: 120,
    nombreChambres: 3,
    typeBien: "luxe",
    adresse: "8 avenue des Champs",
    ville: "Nice",
    nom: "Pierre Dubois",
    telephone: "0723456789",
    mail: "pierre.dubois@example.com",
    date: "2025-04-05"
  },
  {
    id: "3",
    prestationsRecherchees: ["ménage", "gestion-annonce"],
    dureeEspacementDisposition: "3a6mois",
    superficie: 45,
    nombreChambres: 1,
    typeBien: "standard",
    adresse: "15 rue de la République",
    ville: "Lyon",
    nom: "Marie Dupont",
    telephone: "0634567890",
    mail: "marie.dupont@example.com",
    formuleId: "smarthost-standard",
    date: "2025-03-27"
  }
];

