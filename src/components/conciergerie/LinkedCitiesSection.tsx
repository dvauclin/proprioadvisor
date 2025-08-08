"use client";

import React from "react";
import Link from "next/link";

interface LinkedCity {
  id: string;
  nom: string;
  slug: string;
}

interface LinkedCitiesSectionProps {
  linkedCities: LinkedCity[];
  currentCity?: string; // Ville actuelle pour le contexte
}

const LinkedCitiesSection: React.FC<LinkedCitiesSectionProps> = ({ linkedCities, currentCity }) => {
  if (linkedCities.length === 0) {
    return null;
  }

  return (
    <section 
      className="mt-12" 
      aria-labelledby="nearby-cities-heading"
      role="region"
      aria-label="Villes � proximit�"
    >
      <div className="container mx-auto px-4">
        <div className="bg-gray-50 rounded-lg p-6">
          <h2 
            id="nearby-cities-heading" 
            className="text-xl font-semibold mb-4 text-center text-gray-800"
          >
            Voir aussi les conciergeries dans les villes � proximit�
          </h2>
          <div 
            className="flex flex-wrap justify-center gap-3"
            role="list"
            aria-label="Liste des villes � proximit�"
          >
            {linkedCities.map(linkedCity => (
              <Link 
                key={linkedCity.id} 
                href={`/conciergerie/${linkedCity.slug}`} 
                className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 hover:border-gray-400 px-4 py-2"
                role="listitem"
                aria-label={`Voir les conciergeries Airbnb � ${linkedCity.nom}`}
                title={`Comparer les conciergeries Airbnb � ${linkedCity.nom}`}
                data-city-id={linkedCity.id}
                data-city-slug={linkedCity.slug}
                data-city-name={linkedCity.nom}
                data-relation-type="nearby-city"
                data-current-city={currentCity}
                itemScope
                itemType="https://schema.org/City"
              >
                <span itemProp="name" className="sr-only">{linkedCity.nom}</span>
                <span itemProp="url" className="sr-only">{`/conciergerie/${linkedCity.slug}`}</span>
                <h3 itemProp="name">
                  Conciergerie Airbnb � {linkedCity.nom}
                </h3>
                {/* Donn�es structur�es pour les bots */}
                <script
                  type="application/ld+json"
                  dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                      "@context": "https://schema.org",
                      "@type": "City",
                      "name": linkedCity.nom,
                      "url": `${typeof window !== 'undefined' ? window.location.origin : ''}/conciergerie/${linkedCity.slug}`,
                      "sameAs": `https://fr.wikipedia.org/wiki/${encodeURIComponent(linkedCity.nom)}`,
                      "additionalProperty": [
                        {
                          "@type": "PropertyValue",
                          "name": "conciergerie-airbnb",
                          "value": "true"
                        },
                        {
                          "@type": "PropertyValue", 
                          "name": "relation-type",
                          "value": "nearby-city"
                        },
                        {
                          "@type": "PropertyValue",
                          "name": "current-city",
                          "value": currentCity || "unknown"
                        }
                      ],
                      "description": `Conciergeries Airbnb disponibles � ${linkedCity.nom}`,
                      "serviceType": "Conciergerie Airbnb",
                      "areaServed": {
                        "@type": "City",
                        "name": linkedCity.nom
                      }
                    })
                  }}
                />
              </Link>
            ))}
          </div>
          {/* Donn�es structur�es pour la section enti�re */}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "ItemList",
                "name": "Villes � proximit� avec conciergeries Airbnb",
                "description": `Liste des villes � proximit� de ${currentCity || 'cette ville'} proposant des services de conciergerie Airbnb`,
                "numberOfItems": linkedCities.length,
                "mainEntity": {
                  "@type": "City",
                  "name": currentCity || "Ville actuelle"
                },
                "itemListElement": linkedCities.map((city, index) => ({
                  "@type": "ListItem",
                  "position": index + 1,
                  "item": {
                    "@type": "City",
                    "name": city.nom,
                    "url": `${typeof window !== 'undefined' ? window.location.origin : ''}/conciergerie/${city.slug}`,
                    "additionalProperty": [
                      {
                        "@type": "PropertyValue",
                        "name": "conciergerie-airbnb",
                        "value": "true"
                      },
                      {
                        "@type": "PropertyValue",
                        "name": "relation-type", 
                        "value": "nearby-city"
                      },
                      {
                        "@type": "PropertyValue",
                        "name": "distance-from-current",
                        "value": "proximit�"
                      }
                    ],
                    "description": `Conciergeries Airbnb disponibles � ${city.nom}`,
                    "serviceType": "Conciergerie Airbnb"
                  }
                })),
                "additionalProperty": {
                  "@type": "PropertyValue",
                  "name": "section-type",
                  "value": "nearby-cities-links"
                }
              })
            }}
          />
        </div>
      </div>
    </section>
  );
};

export default LinkedCitiesSection;


