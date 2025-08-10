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
    <section className="relative overflow-hidden pt-20 pb-24">
      {/* Top-only gradient overlay for consistent height */}
      <div className="absolute inset-x-0 top-0 h-[640px] -z-10 bg-gradient-to-b from-brand-emerald-50 via-white to-white pointer-events-none overflow-hidden">
        <div className="absolute -top-24 -right-24 h-80 w-80 rounded-full blur-3xl opacity-50"
             style={{ background: "radial-gradient(circle at center, rgba(127,255,0,0.35), transparent 60%)" }} />
        <div className="absolute -bottom-32 -left-20 h-96 w-96 rounded-full blur-3xl opacity-40"
             style={{ background: "radial-gradient(circle at center, rgba(0,191,255,0.25), transparent 60%)" }} />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight leading-tight mb-6">
            Trouvez la <span className="text-brand-chartreuse">conciergerie Airbnb</span> idéale pour votre bien
          </h1>
          <p className="text-lg md:text-xl text-gray-700 mb-8 max-w-2xl mx-auto">
            Comparez gratuitement les offres des conciergeries Airbnb en France et optimisez la gestion de votre location courte durée
          </p>

          <div className="flex justify-center mb-8">
            <Select value={selectedVilleSlug || ""} onValueChange={handleVilleChange}>
              <SelectTrigger className="w-fit min-w-[200px] h-12 text-lg px-6 gap-2">
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

          {/* Boutons comme avant: sous le sélecteur, côte à côte sur desktop */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={handleSubmit}
              disabled={!selectedVilleSlug}
              className="h-12 text-base sm:text-lg px-6 sm:px-8 rounded-full shadow-md"
            >
              {selectedVilleSlug ? "Voir le comparatif" : "Choisissez une ville"}
            </Button>
            <Button variant="outline" className="h-12 px-6 rounded-full shadow-sm" asChild>
              <Link href="/inscription">Ajouter votre conciergerie</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

