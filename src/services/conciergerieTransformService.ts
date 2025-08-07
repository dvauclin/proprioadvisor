import { Conciergerie, Formule } from "@/types";

// Service pour transformer les données entre Supabase et l'interface TypeScript
export const transformFormuleFromDB = (formule: any): Formule => ({
  id: formule.id,
  nom: formule.nom,
  conciergerieId: formule.conciergerie_id,
  commission: formule.commission || 0,
  dureeGestionMin: formule.duree_gestion_min || 0,
  servicesInclus: formule.services_inclus || [],
  fraisMenageHeure: formule.frais_menage_heure || 0,
  fraisDemarrage: formule.frais_demarrage || 0,
  abonnementMensuel: formule.abonnement_mensuel || 0,
  // Transform legacy values to new schema
  fraisReapprovisionnement: formule.frais_reapprovisionnement === 'nonRefactures' ? 'inclus' : (formule.frais_reapprovisionnement || 'inclus'),
  forfaitReapprovisionnement: formule.forfait_reapprovisionnement || 0,
  // Transform legacy values to new schema
  locationLinge: formule.location_linge === 'nonFourni' ? 'inclus' : (formule.location_linge || 'inclus'),
  prixLocationLinge: formule.prix_location_linge || 0,
  fraisSupplementaireLocation: formule.frais_supplementaire_location || 0,
  createdAt: formule.created_at
});

export const transformConciergerieFromDB = (conciergerie: any): Conciergerie => {
  console.log("Transforming conciergerie from DB:", conciergerie);
  
  // Transform formules si elles existent
  const transformedFormules: Formule[] = (conciergerie.formules || []).map(transformFormuleFromDB);

  // Calculate score based on the new logic
  let calculatedScore = 0;
  
  // 🔍 DIAGNOSTIC: Log score calculation for Aurora specifically
  if (conciergerie.nom?.toLowerCase().includes('aurora')) {
    console.log("🌟 Aurora Score Calculation in Transform:", {
      nom: conciergerie.nom,
      scoreManuel: conciergerie.score_manuel,
      subscriptions: conciergerie.subscriptions,
      subscriptionsCount: conciergerie.subscriptions?.length || 0
    });
  }
  
  if (conciergerie.score_manuel !== null && conciergerie.score_manuel !== undefined) {
    // If manual score is set, use it
    calculatedScore = conciergerie.score_manuel;
    if (conciergerie.nom?.toLowerCase().includes('aurora')) {
      console.log("🌟 Aurora using scoreManuel:", calculatedScore);
    }
  } else if (conciergerie.subscriptions && conciergerie.subscriptions.length > 0) {
    // Get the most recent subscription
    const latestSubscription = conciergerie.subscriptions
      .sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0];
      
    if (latestSubscription) {
      if (latestSubscription.payment_status === 'completed') {
        calculatedScore = latestSubscription.total_points ?? 0;
      } else {
        calculatedScore = (latestSubscription.total_points ?? 0) - (latestSubscription.monthly_amount ?? 0);
      }
      
      if (conciergerie.nom?.toLowerCase().includes('aurora')) {
        console.log("🌟 Aurora subscription score calculation:", {
          latestSubscription,
          paymentStatus: latestSubscription.payment_status,
          totalPoints: latestSubscription.total_points,
          monthlyAmount: latestSubscription.monthly_amount,
          calculatedScore
        });
      }
    }
  }
  
  if (conciergerie.nom?.toLowerCase().includes('aurora')) {
    console.log("🌟 Aurora final calculated score:", calculatedScore);
  }

  const transformed: Conciergerie = {
    id: conciergerie.id,
    nom: conciergerie.nom || '',
    mail: conciergerie.mail || '',
    logo: conciergerie.logo || '', // Explicitly set to empty string if null/undefined
    typeLogementAccepte: (conciergerie.type_logement_accepte || 'standard') as "standard" | "luxe" | "tous",
    superficieMin: conciergerie.superficie_min || 0,
    nombreChambresMin: conciergerie.nombre_chambres_min || 0,
    deductionFrais: (conciergerie.deduction_frais || 'inclus') as "deductTous" | "deductMenage" | "inclus",
    tva: (conciergerie.tva || 'TTC') as "TTC" | "HT" | null,
    accepteGestionPartielle: conciergerie.accepte_gestion_partielle || false,
    accepteResidencePrincipale: conciergerie.accepte_residence_principale || false,
    villesIds: conciergerie.villes_ids || [],
    villeId: conciergerie.villes_ids?.[0] || '', // Add required villeId
    zoneCouverte: conciergerie.zone_couverte || '',
    formules: transformedFormules,
    validated: conciergerie.validated || false,
    score: calculatedScore, // Use calculated score
    scoreManuel: conciergerie.score_manuel,
    // Add contact fields mapping
    nomContact: conciergerie.nom_contact || '',
    telephoneContact: conciergerie.telephone_contact || '',
    // Add URL avis mapping
    urlAvis: conciergerie.url_avis || '',
    // Note: villes relation is not available in current schema
    villes: [],
    // Add creation date
    createdAt: conciergerie.created_at,
  };
  
  console.log("Transformed conciergerie:", transformed);
  return transformed;
};

export const transformConciergerieForDB = (conciergerie: Conciergerie | any) => {
  const dbData = {
    nom: conciergerie.nom,
    mail: conciergerie.mail,
    logo: conciergerie.logo || null, // Explicitly set to null if empty
    type_logement_accepte: conciergerie.typeLogementAccepte,
    superficie_min: conciergerie.superficieMin,
    nombre_chambres_min: conciergerie.nombreChambresMin,
    deduction_frais: conciergerie.deductionFrais,
    // Ensure tva is a string for database
    tva: typeof conciergerie.tva === 'boolean' ? (conciergerie.tva ? 'TTC' : 'HT') : conciergerie.tva,
    accepte_gestion_partielle: conciergerie.accepteGestionPartielle,
    accepte_residence_principale: conciergerie.accepteResidencePrincipale,
    villes_ids: conciergerie.villesIds,
    zone_couverte: conciergerie.zoneCouverte,
    validated: conciergerie.validated,
    score_manuel: conciergerie.scoreManuel,
    // Add contact fields mapping
    nom_contact: conciergerie.nomContact || null,
    telephone_contact: conciergerie.telephoneContact || null,
    // Add URL avis mapping
    url_avis: conciergerie.urlAvis || null,
  };
  
  console.log("Transforming conciergerie for DB:", dbData);
  return dbData;
};

export const transformFormuleForDB = (formule: Formule | any) => {
  // Ensure we handle both Formule type and form data properly
  const result = {
    nom: formule.nom,
    conciergerie_id: formule.conciergerieId || formule.conciergerie_id,
    commission: formule.commission || 0,
    duree_gestion_min: formule.dureeGestionMin || formule.duree_gestion_min || 0,
    services_inclus: formule.servicesInclus || formule.services_inclus || [],
    frais_menage_heure: formule.fraisMenageHeure || formule.frais_menage_heure || 0,
    frais_demarrage: formule.fraisDemarrage || formule.frais_demarrage || 0,
    abonnement_mensuel: formule.abonnementMensuel || formule.abonnement_mensuel || 0,
    frais_reapprovisionnement: formule.fraisReapprovisionnement || formule.frais_reapprovisionnement || 'inclus',
    forfait_reapprovisionnement: formule.forfaitReapprovisionnement || formule.forfait_reapprovisionnement || 0,
    location_linge: formule.locationLinge || formule.location_linge || 'inclus',
    prix_location_linge: formule.prixLocationLinge || formule.prix_location_linge || 0,
    frais_supplementaire_location: formule.fraisSupplementaireLocation || formule.frais_supplementaire_location || 0,
  };

  console.log("Transforming formule for DB:", result);
  return result;
};
