import React from "react";
import { UseFormReturn } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { User, Mail, Image, Phone, UserCircle } from "lucide-react";
import LogoUploader from "@/components/inscription/LogoUploader";

interface ConciergerieInfoSectionProps {
  form: UseFormReturn<any>;
  logoPreview: string;
  handleLogoChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  isUploadingLogo?: boolean;
}

const ConciergerieInfoSection: React.FC<ConciergerieInfoSectionProps> = ({ 
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
                  placeholder="Prénom et nom du contact"
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
                <FormLabel>Téléphone de contact</FormLabel>
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
    </>
  );
};

export default ConciergerieInfoSection;
