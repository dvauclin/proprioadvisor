"use client";

import React from "react";
import { Button } from "@/components/ui-kit/button";
import { Filter as FilterIcon } from "lucide-react";

interface StickyFilterBarProps {
  visible: boolean;
  onOpenFilters: () => void;
  resultsCount?: number;
}

const StickyFilterBar: React.FC<StickyFilterBarProps> = ({ visible, onOpenFilters, resultsCount }) => {
  if (!visible) return null;

  return (
    <div className="sticky top-16 z-40 w-full bg-white/95 backdrop-blur border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-2">
          <div className="text-sm text-gray-600">
            {typeof resultsCount === "number" && (
              <span>
                {resultsCount} résultat{resultsCount > 1 ? "s" : ""}
              </span>
            )}
          </div>
          <Button
            onClick={onOpenFilters}
            className="flex items-center gap-2 border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
            aria-label="Ouvrir les filtres"
          >
            <FilterIcon size={16} />
            Filtres
          </Button>
        </div>
      </div>
    </div>
  );
};

export default StickyFilterBar;


