import React from "react";
import { UseFormReturn } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui-kit/form";
import { Input } from "@/components/ui-kit/input";
import { User, Mail, Image, Phone, UserCircle, Star, Globe } from "lucide-react";
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
                <User className="mr-2 h-4 w-4 text-brand-chartreuse" />
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
                <Mail className="mr-2 h-4 w-4 text-brand-chartreuse" />
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
                <UserCircle className="mr-2 h-4 w-4 text-brand-chartreuse" />
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
                <Phone className="mr-2 h-4 w-4 text-brand-chartreuse" />
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

        <FormField
          control={form.control}
          name="siteWeb"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center">
                <Globe className="mr-2 h-4 w-4 text-brand-chartreuse" />
                <FormLabel>Site web</FormLabel>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => field.onChange(false)}
                  className={`px-3 py-1 rounded border text-sm ${field.value === false ? 'bg-gray-200 text-gray-900 border-gray-300' : 'bg-transparent text-gray-600 border-gray-300 hover:bg-gray-100'}`}
                  aria-pressed={field.value === false}
                >
                  Non
                </button>
                <button
                  type="button"
                  onClick={() => field.onChange(true)}
                  className={`px-3 py-1 rounded border text-sm ${field.value === true ? 'bg-gray-200 text-gray-900 border-gray-300' : 'bg-transparent text-gray-600 border-gray-300 hover:bg-gray-100'}`}
                  aria-pressed={field.value === true}
                >
                  Oui
                </button>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        {form.watch("siteWeb") && (
          <FormField
            control={form.control}
            name="urlSiteWeb"
            render={({ field }) => (
                             <FormItem>
                 <div className="flex items-center">
                   <Globe className="mr-2 h-4 w-4 text-brand-chartreuse" />
                   <FormLabel>URL du site web</FormLabel>
                 </div>
                 <FormControl>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 py-2 text-sm text-gray-500 bg-gray-50 border border-r-0 border-gray-300 rounded-l-md">
                      https://
                    </span>
                    <Input 
                      {...field} 
                      type="text"
                      placeholder="www.votre-site.com"
                      autoComplete="off"
                      data-lpignore="true"
                      className="rounded-l-none"
                      value={field.value?.replace('https://', '') || ''}
                      onChange={(e) => field.onChange(`https://${e.target.value}`)}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
      </div>

      <div>
        <div className="flex items-center mb-2">
                      <Image className="mr-2 h-4 w-4 text-brand-chartreuse" />
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
                      <Star className="mr-2 h-4 w-4 text-brand-chartreuse" />
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
                <div className="flex">
                  <span className="inline-flex items-center px-3 py-2 text-sm text-gray-500 bg-gray-50 border border-r-0 border-gray-300 rounded-l-md">
                    https://
                  </span>
                  <Input 
                    {...field} 
                    type="text"
                    placeholder="www.google.com/maps/place/..."
                    className="w-full rounded-l-none"
                    value={field.value?.replace('https://', '') || ''}
                    onChange={(e) => field.onChange(`https://${e.target.value}`)}
                  />
                </div>
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

