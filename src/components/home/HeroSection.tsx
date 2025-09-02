"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui-kit/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui-kit/select";
import { Ville } from "@/types";
import { getValidatedConciergeriesCount } from "@/services/conciergerieService";
import { useAuth } from "@/contexts/AuthContext";

interface HeroSectionProps {
  selectedVille: string | null;
  allVilles: Ville[];
}

const HeroSection: React.FC<HeroSectionProps> = ({ selectedVille, allVilles }) => {
  const router = useRouter();
  const { user } = useAuth();
  const [selectedVilleSlug, setSelectedVilleSlug] = useState<string | null>(selectedVille);
  const [conciergeriesCount, setConciergeriesCount] = useState<number>(0);
  const [displayedCount, setDisplayedCount] = useState<number>(0);
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const fetchConciergeriesCount = async () => {
      try {
        console.log("HeroSection: Starting to fetch conciergeries count...");
        const count = await getValidatedConciergeriesCount();
        console.log("HeroSection: Received count:", count);
        setConciergeriesCount(count);
      } catch (error) {
        console.error("Erreur lors du chargement du nombre de conciergeries:", error);
        setConciergeriesCount(0);
      }
    };

    fetchConciergeriesCount();
  }, []);

  // Intersection Observer pour détecter quand la section est visible
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      {
        threshold: 0.3,
        rootMargin: '0px 0px -50px 0px'
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

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

  // Animation d'incrémentation - se déclenche seulement quand visible
  useEffect(() => {
    if (isVisible && conciergeriesCount > 0) {
      const duration = 2000; // 2 secondes
      const steps = 60; // 60 étapes
      const increment = conciergeriesCount / steps;
      const stepDuration = duration / steps;
      
      let currentStep = 0;
      const timer = setInterval(() => {
        currentStep++;
        const newValue = Math.min(Math.floor(increment * currentStep), conciergeriesCount);
        setDisplayedCount(newValue);
        
        if (currentStep >= steps || newValue >= conciergeriesCount) {
          setDisplayedCount(conciergeriesCount);
          clearInterval(timer);
        }
      }, stepDuration);
      
      return () => clearInterval(timer);
    }
  }, [isVisible, conciergeriesCount]);

  return (
    <section ref={sectionRef} className="relative overflow-hidden pt-20 pb-24">
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
            <div className="flex flex-col items-center">
              <Button variant="outline" className="h-12 px-6 rounded-full shadow-sm" asChild>
                {user ? (
                  <Link href="/ma-conciergerie">Modifier ma conciergerie</Link>
                ) : (
                  <Link href="/inscription">Ajouter votre conciergerie</Link>
                )}
              </Button>
              {/* Texte avec le nombre de conciergeries sous le bouton Ajouter */}
              {!user && (
                <div className="mt-2 text-center">
                  <p className="text-xs text-gray-500">
                    Déjà <span className="font-semibold text-brand-chartreuse">{displayedCount}</span> conciergerie{displayedCount > 1 ? 's' : ''} référencée{displayedCount > 1 ? 's' : ''}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

