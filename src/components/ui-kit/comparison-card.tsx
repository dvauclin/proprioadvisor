
import React from "react";
import Link from "next/link";
import { ExternalLink, Phone, Star } from "lucide-react";
import CommissionSection from "@/components/ui-kit/comparison-card/commission-section";
import DurationSection from "@/components/ui-kit/comparison-card/duration-section";
import FeesSection from "@/components/ui-kit/comparison-card/fees-section";
import ServicesSection from "@/components/ui-kit/comparison-card/services-section";
import PropertiesSection from "@/components/ui-kit/comparison-card/properties-section";
import FavoriteButton from "@/components/ui-kit/favorite-button";
import { Button } from "@/components/ui-kit/button";
import AvisCount from "@/components/ui-kit/avis-count";
import ConciergerieLogoDisplay from "@/components/ui-kit/conciergerie-logo-display";
import { createConciergerieSlug } from "@/utils/conciergerieUtils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui-kit/tooltip";
import { supabase } from "@/integrations/supabase/client";
import AddAvisModal from "@/components/ui-kit/add-avis-modal";
import AvisModal from "@/components/ui-kit/avis-modal";
import { Avis } from "@/types";

interface ComparisonCardProps {
  formule: any;
  conciergerie?: any;
  subscription?: any;
  onDevisClick?: () => void;
  preloadedRating?: number; // new optional preloaded average rating
  preloadedReviewsCount?: number; // new optional preloaded count
}

// Hook pour obtenir le nombre d'avis
const useAvisCount = (conciergerieId: string, preloaded?: number) => {
  const [count, setCount] = React.useState<number | null>(preloaded ?? null);

  React.useEffect(() => {
    if (preloaded != null) {
      setCount(preloaded);
      return;
    }
    let isMounted = true;
    const load = async () => {
      const { count } = await supabase
        .from("avis")
        .select("*", { count: "exact", head: true })
        .eq("conciergerie_id", conciergerieId)
        .eq("valide", true);
      if (isMounted) setCount(count ?? 0);
    };
    if (conciergerieId) load();
    return () => { isMounted = false; };
  }, [conciergerieId, preloaded]);

  return count;
};

// Hook pour obtenir les avis détaillés
const useAvisDetails = (conciergerieId: string) => {
  const [avis, setAvis] = React.useState<Avis[]>([]);
  React.useEffect(() => {
    let isMounted = true;
    const load = async () => {
      const { data } = await supabase
        .from("avis")
        .select("id, emetteur, note, commentaire, date")
        .eq("conciergerie_id", conciergerieId)
        .eq("valide", true)
        .order("date", { ascending: false });
      
      if (isMounted) {
        const mappedAvis = (data || []).map((item: any) => ({
          id: item.id,
          emetteur: item.emetteur,
          note: item.note,
          commentaire: item.commentaire,
          date: item.date,
          conciergerieId: conciergerieId,
          valide: true
        }));
        setAvis(mappedAvis);
      }
    };
    if (conciergerieId) load();
    return () => { isMounted = false; };
  }, [conciergerieId]);

  return { avis };
};

const ComparisonCard: React.FC<ComparisonCardProps> = ({ 
  formule, 
  conciergerie, 
  subscription, 
  onDevisClick,
  preloadedRating,
  preloadedReviewsCount
}) => {
  const slug = conciergerie?.nom ? createConciergerieSlug(conciergerie.nom) : null;

  const showPhone = Boolean(subscription?.phone_number && subscription?.phone_number_value);
  const showWebsite = Boolean(subscription?.website_link && subscription?.website_url);
  
  // Vérifier si la conciergerie est non recommandée (total_points < 1)
  const isNonRecommande = (subscription?.total_points || 0) < 1;

  // États pour les modales
  const [showReviewsModal, setShowReviewsModal] = React.useState(false);
  const [showAddReviewModal, setShowAddReviewModal] = React.useState(false);

  // Obtenir le nombre d'avis et les détails
  const avisCount = useAvisCount(conciergerie?.id || "", preloadedReviewsCount);
  const { avis } = useAvisDetails(conciergerie?.id || "");
  const hasReviews = avisCount !== null && avisCount > 0;

  const handleShowReviews = () => {
    setShowReviewsModal(true);
  };

  const handleLeaveReview = () => {
    setShowAddReviewModal(true);
  };

  const handleAvisAdded = () => {
    // Recharger les données d'avis après ajout
    window.location.reload();
  };

  // Handlers pour les liens phone et website (identiques à la page détails)
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

  return (
    <>
      <div className={`bg-white rounded-lg p-6 border relative ${isNonRecommande ? 'opacity-60' : ''}`}>
        {/* En-tête: logo à gauche, bloc à droite: nom + liens, formule, note */}
        <div className="flex items-start gap-4 mb-4">
          <ConciergerieLogoDisplay logoUrl={conciergerie?.logo || null} altText={conciergerie?.nom || "Conciergerie"} size="md" />
          <div className="flex-1 min-w-0">
            <div className="flex items-start gap-2 flex-wrap">
              {slug && !isNonRecommande ? (
                <Link href={`/conciergerie-details/${slug}`} className="hover:underline min-w-0 flex-1">
                  <h3 className="font-semibold text-lg break-words">{conciergerie?.nom || "Conciergerie"}</h3>
                </Link>
              ) : (
                <h3 className="font-semibold text-lg break-words min-w-0 flex-1">{conciergerie?.nom || "Conciergerie"}</h3>
              )}
              <div className="flex items-center gap-1 flex-shrink-0">
                {showWebsite && !isNonRecommande && (
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
                {showPhone && !isNonRecommande && (
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

            {/* Formule */}
            <div className="text-sm text-gray-700 mt-1">{formule?.nom || "Formule"}</div>

            {/* Note et nombre d'avis - seulement si la conciergerie est recommandée */}
            {!isNonRecommande && (
              <div className="flex items-center gap-2 mt-1">
                {/* Étoiles - seulement si il y a des avis, et cliquables */}
                {hasReviews && (
                  <button 
                    onClick={handleShowReviews}
                    className="flex items-center gap-1 hover:opacity-80 transition-opacity cursor-pointer"
                    title="Voir les avis reçus"
                  >
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`h-4 w-4 ${i < Math.round(preloadedRating ?? conciergerie.score) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                      />
                    ))}
                  </button>
                )}
                
                {/* Texte d'avis - géré par AvisCount, cliquable pour ouvrir la modale */}
                {conciergerie?.id && (
                  <AvisCount 
                    conciergerieId={conciergerie.id} 
                    onShowReviews={handleShowReviews}
                    onLeaveReview={handleLeaveReview}
                    preloadedCount={preloadedReviewsCount}
                  />
                )}
              </div>
            )}
          </div>
        </div>

        {/* Sections de comparaison */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <CommissionSection commission={formule?.commission || 0} tva={(formule as any)?.tva || conciergerie?.tva || null} />
          <DurationSection dureeGestionMin={formule?.dureeGestionMin || 0} />
        </div>

        <div className="mt-4 space-y-4">
          <ServicesSection services={formule?.servicesInclus || []} />
          <PropertiesSection
            typeLogementAccepte={conciergerie?.typeLogementAccepte}
            accepteResidencePrincipale={conciergerie?.accepteResidencePrincipale}
            accepteGestionPartielle={conciergerie?.accepteGestionPartielle}
            superficieMin={conciergerie?.superficieMin}
            nombreChambresMin={conciergerie?.nombreChambresMin}
          />
          <FeesSection
            fraisDemarrage={formule?.fraisDemarrage}
            fraisMenageHeure={formule?.fraisMenageHeure}
            abonnementMensuel={formule?.abonnementMensuel}
            fraisReapprovisionnement={formule?.fraisReapprovisionnement}
            forfaitReapprovisionnement={formule?.forfaitReapprovisionnement}
            locationLinge={formule?.locationLinge}
            prixLocationLinge={formule?.prixLocationLinge}
            fraisSupplementaireLocation={formule?.fraisSupplementaireLocation}
          />
        </div>

        {/* Pied de carte: actions */}
        <div className="flex items-center gap-2 mt-6">
          {!isNonRecommande && (
            <FavoriteButton formule={formule} conciergerie={conciergerie} className="flex-shrink-0" />
          )}
          {isNonRecommande ? (
            <Button disabled className="flex-1" variant="secondary">
              Non recommandé
            </Button>
          ) : (
            onDevisClick && (
              <Button onClick={onDevisClick} className="flex-1">
                Demander un devis
              </Button>
            )
          )}
        </div>
      </div>

      {/* Modale pour voir les avis */}
      <AvisModal
        isOpen={showReviewsModal}
        onClose={() => setShowReviewsModal(false)}
        onAddAvis={() => {
          setShowReviewsModal(false);
          setShowAddReviewModal(true);
        }}
        avis={avis}
        conciergerieName={conciergerie?.nom || "Conciergerie"}
      />

      {/* Modale pour ajouter un avis */}
      <AddAvisModal
        isOpen={showAddReviewModal}
        onClose={() => setShowAddReviewModal(false)}
        conciergerieId={conciergerie?.id || ""}
        conciergerieName={conciergerie?.nom || "Conciergerie"}
        onAvisAdded={handleAvisAdded}
      />
    </>
  );
};

export default ComparisonCard;

