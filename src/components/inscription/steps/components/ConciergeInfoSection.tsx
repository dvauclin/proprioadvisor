import React from "react";
import { UseFormReturn } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui-kit/form";
import { Input } from "@/components/ui-kit/input";
import { User, Mail, Image, Phone, UserCircle, Star } from "lucide-react";
import LogoUploader from "@/components/inscription/LogoUploader";

interface ConciergeInfoSectionProps {
  form: UseFormReturn<any>;
  logoPreview: string;
  handleLogoChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  isUploadingLogo?: boolean;
}

const ConciergeInfoSection: React.FC<ConciergeInfoSectionProps> = ({ 
  form, 
  logoPreview, 
  handleLogoChange, 
  isUploadingLogo = false 
}) => {
  // Watch the nom field to pass to LogoUploader for alt text
  const conciergerieNom = form.watch("nom");

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="nom"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center">
                <User className="mr-2 h-4 w-4 text-gray-600" />
                <FormLabel>Nom de la conciergerie</FormLabel>
              </div>
              <FormControl>
                <Input 
                  {...field} 
                  placeholder="Nom de votre conciergerie"
                  autoComplete="organization"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="mail"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center">
                <Mail className="mr-2 h-4 w-4 text-gray-600" />
                <FormLabel>Email de contact</FormLabel>
              </div>
              <FormControl>
                <Input 
                  {...field} 
                  type="email" 
                  placeholder="contact@votre-conciergerie.com"
                  autoComplete="off"
                  data-lpignore="true"
                  data-form-type="other"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="nomContact"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center">
                <UserCircle className="mr-2 h-4 w-4 text-gray-600" />
                <FormLabel>Nom du contact</FormLabel>
              </div>
              <FormControl>
                <Input 
                  {...field} 
                  placeholder="PrÃ©nom et nom du contact"
                  autoComplete="off"
                  data-lpignore="true"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="telephoneContact"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center">
                <Phone className="mr-2 h-4 w-4 text-gray-600" />
                <FormLabel>TÃ©lÃ©phone de contact</FormLabel>
              </div>
              <FormControl>
                <Input 
                  {...field} 
                  type="tel" 
                  placeholder="01 23 45 67 89"
                  autoComplete="off"
                  data-lpignore="true"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div>
        <div className="flex items-center mb-2">
          <Image className="mr-2 h-4 w-4 text-gray-600" />
          <h3 className="text-base font-medium">Logo de votre conciergerie</h3>
        </div>
        <LogoUploader 
          logoPreview={logoPreview} 
          handleLogoChange={handleLogoChange}
          isUploading={isUploadingLogo}
          conciergerieNom={conciergerieNom}
        />
      </div>

      <div>
        <div className="flex items-center mb-2">
          <Star className="mr-2 h-4 w-4 text-gray-600" />
          <h3 className="text-base font-medium">Avis sur la conciergerie</h3>
        </div>
        <FormField
          control={form.control}
          name="urlAvis"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm text-gray-600">
                Lien vers vos avis clients (optionnel)
              </FormLabel>
              <FormControl>
                <Input 
                  {...field} 
                  type="url" 
                  placeholder="https://www.google.com/maps/place/..."
                  className="w-full"
                />
              </FormControl>
              <p className="text-xs text-gray-500 mt-1">
                Ajoutez un lien vers vos avis sur Google, Trustpilot ou autre plateforme
              </p>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </>
  );
};

export default ConciergeInfoSection;

