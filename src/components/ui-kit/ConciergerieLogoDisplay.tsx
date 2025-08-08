
import React from "react";
import { AspectRatio } from "./aspect-ratio";

interface ConciergerieLogoDisplayProps {
  logoUrl: string | null;
  altText: string;
  size?: "sm" | "md" | "lg" | "xl";
}

const ConciergerieLogoDisplay: React.FC<ConciergerieLogoDisplayProps> = ({
  logoUrl,
  altText,
  size = "md"
}) => {
  // Debug logging
  console.log("ConciergerieLogoDisplay - logoUrl:", logoUrl);
  console.log("ConciergerieLogoDisplay - altText:", altText);
  
  // Define size classes based on the size prop - reduced lg size slightly
  const sizeClasses = {
    sm: "w-12 h-12",
    md: "w-24 h-24",
    lg: "w-28 h-28",  // Reduced from w-32 h-32 to w-28 h-28 
    xl: "w-48 h-48"
  };
  
  // Return null if no logo URL is provided
  if (!logoUrl || logoUrl.trim() === '') {
    console.log("ConciergerieLogoDisplay - No logo URL provided, returning null");
    return null;
  }
  
  // Generate alt text based on the provided altText (which should be the conciergerie name)
  const logoAltText = altText ? `Logo de ${altText}` : "Logo de conciergerie";
  
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    console.error("ConciergerieLogoDisplay - Failed to load image:", logoUrl);
    console.error("Error details:", e);
  };

  const handleImageLoad = () => {
    console.log("ConciergerieLogoDisplay - Image loaded successfully:", logoUrl);
  };
  
  return (
    <div className={`${sizeClasses[size]} overflow-hidden border border-gray-200 rounded-full`}>
      <AspectRatio ratio={1/1} className="bg-white">
        <img
          src={logoUrl}
          alt={logoAltText}
          className="w-full h-full object-contain p-1"
          style={{
            imageRendering: "-webkit-optimize-contrast"
          }}
          onError={handleImageError}
          onLoad={handleImageLoad}
        />
      </AspectRatio>
    </div>
  );
};

export default ConciergerieLogoDisplay;
