
import React from "react";
import { FormLabel } from "@/components/ui-kit/form";
import { Input } from "@/components/ui-kit/input";
import { Loader2 } from "lucide-react";
import { AspectRatio } from "@/components/ui-kit/aspect-ratio";

interface LogoUploaderProps {
  logoPreview: string;
  handleLogoChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  isUploading?: boolean;
  conciergerieNom?: string;
}

const LogoUploader: React.FC<LogoUploaderProps> = ({ 
  logoPreview, 
  handleLogoChange,
  isUploading = false,
  conciergerieNom = ""
}) => {
  // Generate alt text for preview
  const previewAltText = conciergerieNom 
    ? `AperÃ§u du logo de ${conciergerieNom}` 
    : "AperÃ§u du logo";

  return (
    <div className="space-y-2">
      <FormLabel>Logo (optionnel)</FormLabel>
      <Input
        type="file"
        accept="image/*"
        onChange={handleLogoChange}
        disabled={isUploading}
      />
      {isUploading && (
        <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
          <Loader2 className="h-4 w-4 animate-spin" />
          TÃ©lÃ©chargement du logo en cours...
        </div>
      )}
      {logoPreview && (
        <div className="mt-2">
          <div className="w-48 h-48 border border-gray-200 rounded overflow-hidden">
            <AspectRatio ratio={1/1} className="bg-white">
              <img
                src={logoPreview}
                alt={previewAltText}
                className="w-full h-full object-contain p-2"
                style={{
                  imageRendering: "-webkit-optimize-contrast"
                }}
              />
            </AspectRatio>
          </div>
        </div>
      )}
    </div>
  );
};

export default LogoUploader;

