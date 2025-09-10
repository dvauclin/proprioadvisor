"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2, Star, ExternalLink, Phone } from "lucide-react";
import { Button } from "@/components/ui-kit/button";
import ConciergerieLogoDisplay from "@/components/ui-kit/conciergerie-logo-display";
import AvisDisplay from "@/components/ui-kit/comparison-card/avis-display";
import { getAllConciergeries, getAllVilles } from "@/lib/data";
import { findConciergerieBySlug } from "@/utils/conciergerieUtils";
import { supabase } from "@/integrations/supabase/client";
import StructuredData from "@/components/seo/StructuredData";
import { 
  conciergerieLocalBusinessJsonLd, 
  breadcrumbsJsonLd,
  conciergerieWebPageJsonLd,
  conciergerieDetailedServiceJsonLd,
  conciergerieReviewsJsonLd
} from "@/lib/structured-data-models";
import CommissionSection from "@/components/ui-kit/comparison-card/commission-section";
import DurationSection from "@/components/ui-kit/comparison-card/duration-section";
import FeesSection from "@/components/ui-kit/comparison-card/fees-section";
import ServicesSection from "@/components/ui-kit/comparison-card/services-section";
import FavoriteButton from "@/components/ui-kit/favorite-button";
import DevisModal from "@/components/conciergerie/DevisModal";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui-kit/tooltip";
import AddAvisModal from "@/components/ui-kit/add-avis-modal";

interface ConciergerieDetailsProps {
  conciergerieSlug: string;
}

const ConciergerieDetails: React.FC<ConciergerieDetailsProps> = ({ conciergerieSlug }) => {
  const router = useRouter();
  const [loading, setLoading] = React.useState(true);
  const [conciergerie, setConciergerie] = React.useState<any>(null);
  const [formules, setFormules] = React.useState<any[]>([]);
  const [error, setError] = React.useState<string | null>(null);

  const [conciergerieVilles, setConciergerieVilles] = React.useState<any[]>([]);

  const [averageRating, setAverageRating] = React.useState<number | undefined>();
  const [reviewCount, setReviewCount] = React.useState<number>(0);
  const [reviews, setReviews] = React.useState<any[]>([]);
  const [structuredDataDetails, setStructuredDataDetails] = React.useState<any>(null);
  const [showDevisModal, setShowDevisModal] = React.useState(false);
  const [selectedFormule, setSelectedFormule] = React.useState<{ formuleId: string; conciergerieId: string; } | null>(null);
  const [subscription, setSubscription] = React.useState<any>(null);
  const [showAddReviewModal, setShowAddReviewModal] = React.useState(false);
  
  React.useEffect(() => {
    const fetchData = async () => {
      if (!conciergerieSlug) {
        console.log("No conciergerieSlug provided");
        setError("Identifiant de conciergerie non fourni");
        setLoading(false);
        return;
      }
      try {
        console.log("=== CONCIERGERIE DETAILS DEBUG ===");
        console.log("Looking for conciergerie with slug:", conciergerieSlug);

        // Fetch all conciergeries to find by slug
        const allConciergeries = await getAllConciergeries();
        console.log("All conciergeries loaded:", allConciergeries.length);

        // Find conciergerie by slug
        const foundConciergerie = findConciergerieBySlug(allConciergeries, conciergerieSlug);
        console.log("Search result:", foundConciergerie);

        // Check if conciergerie exists
        if (!foundConciergerie) {
          console.log("=== CONCIERGERIE NOT FOUND ===");
          setError("Conciergerie non trouvée");
        } else {
          console.log("Conciergerie found:", foundConciergerie.nom);
          console.log("Conciergerie ID:", foundConciergerie.id);
          setConciergerie(foundConciergerie);

          // Fetch avis data for ratings and structured data
          const {
            data: avisDataForRating
          } = await supabase.from('avis').select('note, commentaire, auteur, date_creation').eq('conciergerie_id', foundConciergerie.id).eq('valide', true);
          
          if (avisDataForRating && avisDataForRating.length > 0) {
            setReviewCount(avisDataForRating.length);
            const avgRating = avisDataForRating.reduce((sum, avis) => sum + avis.note, 0) / avisDataForRating.length;
            setAverageRating(avgRating);
            
            // Format reviews for structured data
            const formattedReviews = avisDataForRating.map(avis => ({
              id: `avis-${avis.date_creation}-${avis.note}`,
              note: avis.note,
              commentaire: avis.commentaire,
              auteur: avis.auteur,
              date: avis.date_creation
            }));
            setReviews(formattedReviews);
          }



          // Fetch subscription data for this conciergerie
          const {
            data: subscriptionData
          } = await supabase
            .from('subscriptions')
            .select('website_url, phone_number_value, website_link, phone_number')
            .eq('conciergerie_id', foundConciergerie.id)
            .single();
          
          if (subscriptionData) {
            setSubscription(subscriptionData);
          }

          // Fetch formules for this conciergerie with detailed logging
          console.log("?? Fetching formules for conciergerie ID:", foundConciergerie.id);
          
          // Fetch formules directly from Supabase
          const {
            data: formulesData,
            error: formulesError
          } = await supabase
            .from('formules')
            .select('*')
            .eq('conciergerie_id', foundConciergerie.id)
            .order('commission');
          
          console.log("?? Formules query result:", { 
            data: formulesData, 
            error: formulesError,
            count: formulesData?.length || 0
          });
          
          if (formulesError) {
            console.error("? Error fetching formules:", formulesError);
          }
          
          if (formulesData && formulesData.length > 0) {
            console.log("? Found formules:", formulesData.length);
            console.log("?? First formule sample:", formulesData[0]);
            
            // Transform to match the Formule type expected by components
            const transformedFormules = formulesData.map((formule: any) => ({
              id: formule.id,
              nom: formule.nom,
              conciergerieId: formule.conciergerie_id,
              commission: formule.commission || 0,
              tva: (formule.tva || formule.type_commission || null) as any,
              dureeGestionMin: formule.duree_gestion_min || 0,
              servicesInclus: formule.services_inclus || [],
              fraisMenageHeure: formule.frais_menage_heure || 0,
              fraisDemarrage: formule.frais_demarrage || 0,
              abonnementMensuel: formule.abonnement_mensuel || 0,
              fraisReapprovisionnement: formule.frais_reapprovisionnement || 'inclus',
              forfaitReapprovisionnement: formule.forfait_reapprovisionnement || 0,
              locationLinge: formule.location_linge || 'inclus',
              prixLocationLinge: formule.prix_location_linge || 0,
              fraisSupplementaireLocation: formule.frais_supplementaire_location || 0,
              createdAt: formule.created_at
            }));
            
            setFormules(transformedFormules);
            console.log("? Formules loaded:", transformedFormules.length);
          } else {
            console.log("? No formules found for conciergerie:", foundConciergerie.id);
            setFormules([]);
          }

          // Fetch villes data
          const allVilles = await getAllVilles();

          // Get conciergerie's villes
          if (foundConciergerie.villesIds && foundConciergerie.villesIds.length > 0) {
            const conciergerieVillesData = allVilles.filter(ville => 
              foundConciergerie.villesIds.includes(ville.id)
            );
            setConciergerieVilles(conciergerieVillesData);
          }

          // Generate structured data (respect noindex when score <= 0)
          const generateStructuredData = async () => {
            const aggregate = (reviewCount > 0 && averageRating)
              ? { ratingValue: Number(averageRating.toFixed(1)), reviewCount }
              : null;
            
            // Créer le slug pour la conciergerie
            const conciergerieSlug = foundConciergerie.nom
              .toLowerCase()
              .normalize("NFD")
              .replace(/[\u0300-\u036f]/g, "")
              .replace(/[^a-z0-9\s-]/g, "")
              .trim()
              .replace(/\s+/g, "-")
              .replace(/-+/g, "-")
              .replace(/^-+|-+$/g, "");

            // Générer toutes les données structurées
            const structuredData = [
              // LocalBusiness principal
              conciergerieLocalBusinessJsonLd(
                foundConciergerie, 
                (formules || []).map(f => ({ nom: f.nom, commission: f.commission })), 
                undefined, 
                { aggregateRating: aggregate }
              ),
              
              // WebPage
              conciergerieWebPageJsonLd({
                nom: foundConciergerie.nom,
                slug: conciergerieSlug,
                description: foundConciergerie.description,
                zoneCouverte: foundConciergerie.zoneCouverte
              }),
              
              // Services détaillés
              conciergerieDetailedServiceJsonLd({
                nom: foundConciergerie.nom,
                slug: conciergerieSlug,
                description: foundConciergerie.description,
                zoneCouverte: foundConciergerie.zoneCouverte,
                telephoneContact: foundConciergerie.telephoneContact
              }),
              
              // Avis structurés (si disponibles)
              reviews.length > 0 ? conciergerieReviewsJsonLd({
                nom: foundConciergerie.nom,
                slug: conciergerieSlug
              }, reviews) : null
            ].filter(Boolean); // Enlever les valeurs null/undefined

            setStructuredDataDetails(structuredData);
          };
          generateStructuredData();
        }
      } catch (err) {
        console.error("Error fetching conciergerie details:", err);
                    setError("Erreur lors du chargement des détails");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [conciergerieSlug]);

  const getPropertyTypeLabel = (type: string) => {
    switch (type) {
      case 'standard': return 'Standard / Milieu de gamme';
      case 'luxe': return 'Haut de gamme / Luxe';
      case 'tous': return 'Tous types';
      default: return type;
    }
  };

  const handleStarClick = () => {
    const avisSection = document.getElementById('avis-clients-section');
    if (avisSection) {
      avisSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleDevisRequest = (formuleId: string, conciergerieId: string) => {
    setSelectedFormule({
      formuleId,
      conciergerieId
    });
    setShowDevisModal(true);
  };

  const handleWebsiteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (subscription?.website_url) {
      const url = subscription.website_url.startsWith('http') 
        ? subscription.website_url 
        : `https://${subscription.website_url}`;
      window.open(url, '_blank', 'nofollow');
    }
  };

  const handlePhoneClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (subscription?.phone_number_value) {
      window.open(`tel:${subscription.phone_number_value}`, '_self');
    }
  };

  const handleAddAvis = () => {
    setShowAddReviewModal(true);
  };

  const handleAvisAdded = () => {
    // Recharge simple de la page pour refléter le nouvel avis
    window.location.reload();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="h-10 w-10 animate-spin text-brand-chartreuse" />
      </div>
    );
  }

  if (error || !conciergerie) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Conciergerie non trouvée</h1>
          <p className="text-gray-600 mb-6">{error || "Cette conciergerie n'existe pas."}</p>
          <Button onClick={() => router.push('/')}>
            Retour à l'accueil
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {structuredDataDetails && <StructuredData data={structuredDataDetails} />}
      {conciergerie && (
        <StructuredData
          data={breadcrumbsJsonLd([
            { name: "Accueil", url: "/" },
            { name: "Annuaire", url: "/annuaire" },
            { name: conciergerie.nom },
          ])}
        />
      )}
      
      <div className="container mx-auto px-4 py-8">
        {/* Contenu principal - Layout avec effet sticky */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Colonne gauche - Logo, titre, note, villes + Critères d'acceptation (STICKY) */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              {/* Logo, titre, note et villes */}
              <div className="mb-8">
                {/* Logo et informations principales - Desktop: côte à côte, Mobile: empilés */}
                <div className="flex flex-col md:flex-row items-start gap-6">
                  {/* Logo circulaire */}
                  <div className="flex-shrink-0">
                    <ConciergerieLogoDisplay
                      logoUrl={conciergerie.logo}
                      altText={conciergerie.nom}
                      size="lg"
                    />
                  </div>
                  
                  {/* Informations principales */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                        {conciergerie.nom}
                      </h1>
                      
                      {/* Pictogrammes téléphone et site web */}
                      <div className="flex items-center gap-1">
                        {subscription?.website_url && subscription?.website_link && (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <button
                                  onClick={handleWebsiteClick}
                                  className="p-1 text-gray-500 hover:text-primary transition-colors"
                                  aria-label="Visiter le site web"
                                >
                                  <ExternalLink size={20} />
                                </button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Visiter le site web</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        )}
                        
                        {subscription?.phone_number_value && subscription?.phone_number && (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <button
                                  onClick={handlePhoneClick}
                                  className="p-1 text-gray-500 hover:text-primary transition-colors"
                                  aria-label="Appeler"
                                >
                                  <Phone size={20} />
                                </button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Appeler</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        )}
                      </div>
                    </div>
                    
                    {/* Note et avis - CLIQUABLES - toujours visible */}
                    {conciergerie && averageRating && (
                      <button 
                        onClick={handleStarClick}
                        className="flex items-center gap-2 mb-3 hover:opacity-80 transition-opacity cursor-pointer"
                      >
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              className={`h-4 w-4 md:h-5 md:w-5 ${i < Math.round(averageRating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                            />
                          ))}
                        </div>
                        <span className="text-sm md:text-base text-gray-600">({reviewCount} avis)</span>
                      </button>
                    )}
                     
                     {/* Zones d'intervention - CLIQUABLES - Sous la note pour tous les écrans */}
                     {conciergerieVilles.length > 0 && (
                       <div className="flex flex-wrap gap-2 mb-4">
                         {conciergerieVilles.map((ville) => (
                           <Link 
                             key={ville.id} 
                             href={`/conciergerie/${ville.slug}`}
                             className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm hover:bg-gray-200 transition-colors"
                           >
                             {ville.nom}
                           </Link>
                         ))}
                       </div>
                     )}
                   </div>
                 </div>
              </div>

              {/* Critères d'acceptation */}
              <h2 className="text-2xl font-bold mb-6">Critères d'acceptation</h2>
              
              {/* Critères en 2 colonnes, remplissage gauche → droite puis retour à la ligne */}
              {(() => {
                const criteria = [
                  {
                    label: 'Zone couverte',
                    value: conciergerie.zoneCouverte,
                    show: Boolean(conciergerie.zoneCouverte),
                  },
                  {
                    label: "Type de logement accepté",
                    value: getPropertyTypeLabel(conciergerie.typeLogementAccepte),
                    show: true,
                  },
                  {
                    label: 'Superficie minimale',
                    value: `${conciergerie.superficieMin} m²`,
                    show: conciergerie.superficieMin > 0,
                  },
                  {
                    label: 'Nombre de chambres minimal',
                    value: conciergerie.nombreChambresMin,
                    show: conciergerie.nombreChambresMin > 0,
                  },
                  {
                    label: 'Accepte résidence principale',
                    value: conciergerie.accepteResidencePrincipale ? 'Oui' : 'Non',
                    show: true,
                  },
                  {
                    label: 'Accepte gestion partielle',
                    value: conciergerie.accepteGestionPartielle ? 'Oui' : 'Non',
                    show: true,
                  },
                ].filter(item => item.show);

                return (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {criteria.map((item, index) => (
                      <div key={`${item.label}-${index}`} className="border rounded-md p-5">
                        <div className="text-sm text-gray-600 mb-2">{item.label}</div>
                        <div className="text-sm">
                          <span className="font-medium">{item.value}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })()}
            </div>
          </div>

          {/* Colonne droite - Formules disponibles avec formatage identique aux listings */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-6">
              Formules disponibles ({formules.length})
            </h2>
            
            {formules.length > 0 ? (
              <div className="space-y-6">
                {formules.map((formule) => (
                  <div key={formule.id} className="bg-white rounded-lg p-6 border relative">
                    <h3 className="font-semibold text-lg mb-4">{formule.nom}</h3>
                    
                    <div className="space-y-4">
                      {/* Commission et Durée d'engagement côte à côte */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <CommissionSection 
                          commission={formule.commission} 
                          tva={(formule as any).tva || conciergerie.tva}
                          variant="details"
                        />
                        <DurationSection dureeGestionMin={formule.dureeGestionMin} variant="details" />
                      </div>
                      
                      {/* Autres frais - Identique aux listings */}
                      <FeesSection 
                        fraisDemarrage={formule.fraisDemarrage}
                        fraisMenageHeure={formule.fraisMenageHeure}
                        abonnementMensuel={formule.abonnementMensuel}
                        fraisReapprovisionnement={formule.fraisReapprovisionnement}
                        forfaitReapprovisionnement={formule.forfaitReapprovisionnement}
                        locationLinge={formule.locationLinge}
                        prixLocationLinge={formule.prixLocationLinge}
                        fraisSupplementaireLocation={formule.fraisSupplementaireLocation}
                        variant="details"
                      />
                      
                      {/* Services inclus - Identique aux listings */}
                      <ServicesSection services={formule.servicesInclus} variant="details" />
                    </div>
                    
                    {/* Boutons d'action avec FavoriteButton identique aux listings */}
                    <div className="flex items-center gap-2 mt-6">
                      <FavoriteButton 
                        formule={formule} 
                        conciergerie={conciergerie} 
                        className="flex-shrink-0"
                      />
                      <Button 
                        onClick={() => handleDevisRequest(formule.id, conciergerie.id)} 
                        className="flex-1"
                      >
                        Demander un devis
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                Aucune formule disponible
              </div>
            )}
          </div>
        </div>

                            {/* Section Avis - Section fille uniquement (sans section mère) - toujours visible */}
        {conciergerie && (
          <div id="avis-clients-section" className="mt-8">
            <AvisDisplay
              conciergerieId={conciergerie.id}
              onAddAvis={handleAddAvis}
            />
          </div>
        )}
      </div>

      <DevisModal
        open={showDevisModal}
        onOpenChange={setShowDevisModal}
        selectedFormule={selectedFormule}
        formuleData={selectedFormule ? {
          id: selectedFormule.formuleId,
          nom: formules.find(f => f.id === selectedFormule.formuleId)?.nom || '',
          conciergerieId: selectedFormule.conciergerieId,
          commission: formules.find(f => f.id === selectedFormule.formuleId)?.commission || 0,
          dureeGestionMin: formules.find(f => f.id === selectedFormule.formuleId)?.duree_gestion_min || 0,
          servicesInclus: formules.find(f => f.id === selectedFormule.formuleId)?.services_inclus || [],
          fraisMenageHeure: formules.find(f => f.id === selectedFormule.formuleId)?.frais_menage_heure || 0,
          fraisDemarrage: formules.find(f => f.id === selectedFormule.formuleId)?.frais_demarrage || 0,
          abonnementMensuel: formules.find(f => f.id === selectedFormule.formuleId)?.abonnement_mensuel || 0,
          fraisReapprovisionnement: formules.find(f => f.id === selectedFormule.formuleId)?.frais_reapprovisionnement || 0,
          forfaitReapprovisionnement: formules.find(f => f.id === selectedFormule.formuleId)?.forfait_reapprovisionnement || 0,
          locationLinge: formules.find(f => f.id === selectedFormule.formuleId)?.location_linge || false,
          prixLocationLinge: formules.find(f => f.id === selectedFormule.formuleId)?.prix_location_linge || 0,
          fraisSupplementaireLocation: formules.find(f => f.id === selectedFormule.formuleId)?.frais_supplementaire_location || 0,
          createdAt: formules.find(f => f.id === selectedFormule.formuleId)?.created_at || '',
          conciergerie: conciergerie
        } : null}
      />

      <AddAvisModal
        isOpen={showAddReviewModal}
        onClose={() => setShowAddReviewModal(false)}
        conciergerieId={conciergerie.id}
        conciergerieName={conciergerie.nom}
        onAvisAdded={handleAvisAdded}
      />
    </div>
  );
};

export default ConciergerieDetails;



