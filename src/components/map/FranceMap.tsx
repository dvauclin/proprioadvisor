
import React from "react";
import Link from "next/link";
import { villes } from "@/lib/data";

const FranceMap: React.FC = () => {
  return (
    <div className="relative w-full max-w-lg mx-auto">
      <svg
        viewBox="0 0 600 600"
        className="w-full h-auto"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Simple France map outline */}
        <path
          d="M240,115 L180,140 L160,180 L130,200 L110,250 L120,300 L100,350 L150,400 L200,450 L250,480 L300,490 L350,470 L400,440 L430,400 L450,350 L460,300 L440,250 L460,200 L440,150 L400,120 L350,100 L300,90 L240,115 Z"
          fill="#f3f4f6"
          stroke="#d1d5db"
          strokeWidth="2"
        />

        {/* Paris */}
        <circle
          cx="300"
          cy="200"
          r="15"
          fill="#ADFF2F"
          className="cursor-pointer hover:fill-brand-chartreuse-dark transition-colors"
          data-city="paris"
        />
        <text
          x="300"
          y="170"
          textAnchor="middle"
          className="text-[14px] font-medium"
        >
          Paris
        </text>

        {/* Lyon */}
        <circle
          cx="350"
          cy="300"
          r="12"
          fill="#ADFF2F"
          className="cursor-pointer hover:fill-brand-chartreuse-dark transition-colors"
          data-city="lyon"
        />
        <text
          x="350"
          y="275"
          textAnchor="middle"
          className="text-[14px] font-medium"
        >
          Lyon
        </text>

        {/* Marseille */}
        <circle
          cx="350"
          cy="400"
          r="12"
          fill="#ADFF2F"
          className="cursor-pointer hover:fill-brand-chartreuse-dark transition-colors"
          data-city="marseille"
        />
        <text
          x="350"
          y="430"
          textAnchor="middle"
          className="text-[14px] font-medium"
        >
          Marseille
        </text>

        {/* Bordeaux */}
        <circle
          cx="200"
          cy="350"
          r="12"
          fill="#ADFF2F"
          className="cursor-pointer hover:fill-brand-chartreuse-dark transition-colors"
          data-city="bordeaux"
        />
        <text
          x="200"
          y="380"
          textAnchor="middle"
          className="text-[14px] font-medium"
        >
          Bordeaux
        </text>

        {/* Nice */}
        <circle
          cx="430"
          cy="380"
          r="12"
          fill="#ADFF2F"
          className="cursor-pointer hover:fill-brand-chartreuse-dark transition-colors"
          data-city="nice"
        />
        <text
          x="430"
          y="410"
          textAnchor="middle"
          className="text-[14px] font-medium"
        >
          Nice
        </text>
      </svg>

      <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-3 text-center">
        {villes.map((ville) => (
          <Link
            key={ville.id}
            href={`/conciergerie/${ville.slug}`}
            className="px-4 py-2 bg-white border border-gray-200 rounded-md hover:border-brand-chartreuse hover:shadow-md transition-all"
          >
            {ville.nom}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default FranceMap;


