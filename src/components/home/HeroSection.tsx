"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui-kit/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui-kit/select";
import { Ville } from "@/types";

interface HeroSectionProps {
  selectedVille: string | null;
  allVilles: Ville[];
}

const HeroSection: React.FC<HeroSectionProps> = ({ selectedVille, allVilles }) => {
  const router = useRouter();
  const [selectedVilleSlug, setSelectedVilleSlug] = useState<string | null>(selectedVille);

  const handleVilleChange = (value: string) => {
    setSelectedVilleSlug(value);
  };

  const handleSubmit = () => {
    if (selectedVilleSlug) {
      router.push(`/conciergerie/${selectedVilleSlug}`);
    }
  };

  // Sort cities by department number, then by name
  const sortedVilles = [...allVilles].sort((a, b) => {
    const deptA = a.departementNumero || '';
    const deptB = b.departementNumero || '';
    
    if (deptA !== deptB) {
      return deptA.localeCompare(deptB, undefined, { numeric: true });
    }
    return a.nom.localeCompare(b.nom);
  });

  const formatVilleName = (ville: Ville) => {
    return ville.departementNumero ? `${ville.departementNumero} - ${ville.nom}` : ville.nom;
  };

  return (
    <section className="pt-16 pb-20 bg-gradient-subtle relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
            Trouvez la <span className="text-brand-chartreuse">conciergerie Airbnb</span> idéale pour votre bien
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-lg mx-auto">
            Comparez gratuitement les offres des conciergeries Airbnb en France et optimisez la gestion de votre location courte durée
          </p>
          
          <div className="max-w-md mx-auto mb-8">
            <Select value={selectedVilleSlug || ""} onValueChange={handleVilleChange}>
              <SelectTrigger className="w-full h-12 text-lg">
                <SelectValue placeholder="Choisissez une ville" />
              </SelectTrigger>
              <SelectContent>
                {sortedVilles.map((ville) => (
                  <SelectItem key={ville.id} value={ville.slug}>
                    {formatVilleName(ville)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={handleSubmit}
              disabled={!selectedVilleSlug}
              className="h-12 text-lg px-8"
            >
              {selectedVilleSlug ? "Voir le comparatif" : "Choisissez une ville"}
            </Button>
            <Button variant="outline" className="h-12" asChild>
              <Link href="/inscription">
                Ajouter votre conciergerie
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
