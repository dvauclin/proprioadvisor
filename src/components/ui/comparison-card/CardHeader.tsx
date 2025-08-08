"use client";

import React from "react";
import Link from "next/link";
import { Phone, ExternalLink } from "lucide-react";
import { Conciergerie, Formule } from "@/types";
import ConciergerieLogoDisplay from "@/components/ui/ConciergerieLogoDisplay";
import AvisSection from "./AvisSection";
import { createConciergerieSlug } from "@/utils/conciergerieUtils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface CardHeaderProps {
  conciergerie: Conciergerie;
  formule: Formule;
  subscription?: {
    website_url?: string;
    phone_number_value?: string;
    website_link?: boolean;
    phone_number?: boolean;
  };
}

const CardHeader: React.FC<CardHeaderProps> = ({
  conciergerie,
  formule,
  subscription
}) => {

  const isNotRecommended = conciergerie.score <= 0;
  const conciergerieSlug = createConciergerieSlug(conciergerie.nom);

  const handleLinkClick = () => {
    console.log("=== CARD HEADER LINK CLICK ===");
    console.log("Conciergerie nom:", conciergerie.nom);
    console.log("Generated slug:", conciergerieSlug);
    console.log("Link will navigate to:", `/conciergerie-details/${conciergerieSlug}`);
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



  return (
    <div className="mb-4">
      <div className="flex items-start gap-3 mb-2">
        <ConciergerieLogoDisplay 
          logoUrl={conciergerie.logo || null} 
          altText={conciergerie.nom || "Logo conciergerie"} 
          size="md" 
        />
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            {isNotRecommended ? (
              <h2 className="text-lg font-semibold text-gray-600 cursor-default">{conciergerie.nom}</h2>
            ) : (
              <Link 
                href={`/conciergerie-details/${conciergerieSlug}`} 
                className="text-lg font-semibold hover:text-brand-chartreuse transition-colors" 
                onClick={handleLinkClick}
              >
                <h2>{conciergerie.nom}</h2>
              </Link>
            )}
            
            {/* Pictogrammes téléphone et site web - Exactement comme dans ConciergerieDetails */}
            {subscription && (subscription.website_url && subscription.website_link || subscription.phone_number_value && subscription.phone_number) && (
              <div className="flex items-center gap-1">
                                {subscription.website_url && subscription.website_link && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          onClick={handleWebsiteClick}
                          className="p-1 text-gray-500 hover:text-brand-chartreuse transition-colors"
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
                
                                {subscription.phone_number_value && subscription.phone_number && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          onClick={handlePhoneClick}
                          className="p-1 text-gray-500 hover:text-brand-chartreuse transition-colors"
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
            )}
          </div>
          
          <h3 className="text-base text-gray-600 mb-1">{formule.nom}</h3>
          
          {/* Move AvisSection here, below formule name and only show if not non-recommended */}
          {!isNotRecommended && (
            <AvisSection 
              conciergerieId={conciergerie.id}
              conciergerieName={conciergerie.nom}
              showModalOnClick={true}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default CardHeader;


