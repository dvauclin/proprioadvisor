"use client";

import React from 'react';
import Link from 'next/link';
import { Badge } from '@/components/ui-kit/badge';
import { MapPin } from 'lucide-react';
import { Ville } from '@/types';

interface CityLinksProps {
  villes: Ville[];
  onVilleSelect?: (villeSlug: string) => void;
}

const CityLinks: React.FC<CityLinksProps> = ({ villes, onVilleSelect }) => {
  return (
    <div className="mt-6">
      <h3 className="text-lg font-semibold mb-4">Villes principales</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {villes.map((ville) => (
          <Link
            key={ville.id}
            href={`/conciergerie/${ville.slug}`}
            onClick={() => onVilleSelect?.(ville.slug)}
            className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200 hover:border-brand-chartreuse hover:shadow-md transition-all group"
          >
            <div className="flex items-center space-x-2">
              <MapPin className="h-4 w-4 text-gray-400 group-hover:text-brand-chartreuse" />
              <span className="font-medium text-gray-900 group-hover:text-brand-chartreuse">
                {ville.nom}
              </span>
            </div>
            {ville.conciergerie_count && ville.conciergerie_count > 0 && (
              <Badge variant="secondary" className="bg-brand-chartreuse text-black">
                {ville.conciergerie_count}
              </Badge>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CityLinks;



