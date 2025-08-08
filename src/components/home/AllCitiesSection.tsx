"use client";

import React from "react";
import Link from "next/link";
import { Ville } from "@/types";

interface AllCitiesSectionProps {
  allVilles: Ville[];
}

const AllCitiesSection: React.FC<AllCitiesSectionProps> = ({ allVilles }) => {
  const formatVilleName = (ville: Ville) => {
    return ville.departementNumero ? `${ville.nom} (${ville.departementNumero})` : ville.nom;
  };

  return (
    <section className="py-12 bg-gray-50 border-t border-gray-200">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold mb-6 text-center">Toutes nos villes</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {allVilles.sort((a, b) => a.nom.localeCompare(b.nom)).map(ville => (
            <Link 
              key={ville.id} 
              href={`/conciergerie/${ville.slug}`}
              className="text-gray-600 hover:text-brand-chartreuse transition-colors"
            >
              Conciergerie {formatVilleName(ville)}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AllCitiesSection;



