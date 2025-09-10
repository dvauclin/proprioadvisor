"use client";

import React from "react";

interface AvisCountProps {
  conciergerieId: string;
  className?: string;
  onShowReviews?: () => void;
  onLeaveReview?: () => void;
  preloadedCount?: number; // if provided, skip fetching
}

const AvisCount: React.FC<AvisCountProps> = ({ 
  className = "text-sm text-gray-500",
  onShowReviews,
  onLeaveReview,
  preloadedCount
}) => {
  const [count, setCount] = React.useState<number | null>(preloadedCount ?? null);

  React.useEffect(() => {
    if (preloadedCount != null) {
      setCount(preloadedCount);
    }
  }, [preloadedCount]);

  if (count === null) return null;
  
  if (count === 0) {
    return (
      <button 
        onClick={onLeaveReview}
        className={`${className} hover:underline text-blue-600 cursor-pointer`}
      >
        Laisser un 1er avis
      </button>
    );
  }

  return (
    <button 
      onClick={onShowReviews}
      className={`${className} hover:underline cursor-pointer`}
    >
      ({count} avis)
    </button>
  );
};

export default AvisCount;


