"use client";

import React, { useState, useEffect, useRef } from "react";
import { getValidatedConciergeriesCount } from "@/services/conciergerieService";

interface AnimatedCounterProps {
  className?: string;
  textClassName?: string;
  numberClassName?: string;
  showPlural?: boolean;
  suffix?: string;
  prefix?: string;
}

const AnimatedCounter: React.FC<AnimatedCounterProps> = ({
  className = "",
  textClassName = "text-sm text-gray-600",
  numberClassName = "font-semibold text-brand-chartreuse",
  showPlural = true,
  suffix = "",
  prefix = "Déjà"
}) => {
  const [conciergeriesCount, setConciergeriesCount] = useState<number>(0);
  const [displayedCount, setDisplayedCount] = useState<number>(0);
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const counterRef = useRef<HTMLDivElement>(null);

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

  // Intersection Observer pour détecter quand le compteur est visible
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

    if (counterRef.current) {
      observer.observe(counterRef.current);
    }

    return () => {
      if (counterRef.current) {
        observer.unobserve(counterRef.current);
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
    <div ref={counterRef} className={className}>
      <p className={textClassName}>
        {prefix} <span className={numberClassName}>{displayedCount}</span> conciergerie{showPlural && displayedCount > 1 ? 's' : ''}{suffix}
      </p>
    </div>
  );
};

export default AnimatedCounter;

