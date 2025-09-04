"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Button } from "@/components/ui-kit/button";
import { getValidatedConciergeriesCount } from "@/services/conciergerieService";
import { useAuth } from "@/contexts/AuthContext";

const CTASection: React.FC = () => {
  const { user } = useAuth();
  const [conciergeriesCount, setConciergeriesCount] = useState<number>(0);
  const [displayedCount, setDisplayedCount] = useState<number>(0);
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const fetchConciergeriesCount = async () => {
      try {
        const count = await getValidatedConciergeriesCount();
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
    <>
      {!user && (
        <section ref={sectionRef} className="py-12 bg-brand-chartreuse/10 relative overflow-hidden my-0">
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-4">Vous gérez une conciergerie Airbnb ?</h2>
              <p className="text-xl text-gray-600 mb-6">
                Inscrivez votre entreprise gratuitement sur ProprioAdvisor pour augmenter votre visibilité et <a href="https://proprioadvisor.fr/trouver-des-clients-conciergerie-airbnb" className="underline">trouver de nouveaux clients</a>.
              </p>
              <div className="flex flex-col items-center">
                <Button className="text-lg px-6 py-3" asChild>
                  <Link href="/inscription">
                    Ajouter ma conciergerie
                  </Link>
                </Button>
                {/* Texte avec le nombre de conciergeries sous le bouton */}
                <div className="mt-3 text-center">
                  <p className="text-sm text-gray-600">
                    Déjà <span className="font-semibold text-brand-chartreuse">{displayedCount}</span> conciergerie{displayedCount > 1 ? 's' : ''} reçoivent des clients grâce à ProprioAdvisor
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  );
};

export default CTASection;



