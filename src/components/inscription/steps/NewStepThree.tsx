import React from "react";
import { UseFormReturn } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui-kit/form";
import { Input } from "@/components/ui-kit/input";
import { User, Mail, Image, Phone, UserCircle, Star, Globe, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui-kit/button";
import LogoUploader from "@/components/inscription/LogoUploader";

interface NewStepThreeProps {
  form: UseFormReturn<any>;
  logoPreview: string;
  handleLogoChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  isUploadingLogo?: boolean;
  onSubmit: () => void;
  onBack: () => void;
  loading: boolean;
  submitText?: string;
}

const NewStepThree: React.FC<NewStepThreeProps> = ({ 
  form, 
  logoPreview, 
  handleLogoChange, 
  isUploadingLogo = false,
  onSubmit,
  onBack,
  loading,
  submitText = "Finaliser l'inscription"
}) => {
  // Watch the nom field to pass to LogoUploader for alt text
  const conciergerieNom = form.watch("nom");

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Comment vous contacter ?
        </h2>
      </div>

      {/* Coordonnées */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <div className="flex items-center mb-4">
          <User className="mr-2 h-5 w-5 text-brand-chartreuse" />
          <h3 className="text-lg font-medium">Coordonnées</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="nom"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nom de la conciergerie</FormLabel>
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
                <FormLabel>Email de contact</FormLabel>
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
                <FormLabel>Nom du contact</FormLabel>
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
                <FormLabel>Téléphone de contact</FormLabel>
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
      </div>

      {/* Site web */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <div className="flex items-center mb-4">
          <Globe className="mr-2 h-5 w-5 text-brand-chartreuse" />
          <h3 className="text-lg font-medium">Site web</h3>
        </div>
        
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="siteWeb"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Avez-vous un site web ?</FormLabel>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => field.onChange(false)}
                    className={`px-4 py-2 rounded border text-sm font-medium transition-colors ${
                      field.value === false 
                        ? 'bg-brand-chartreuse text-white border-brand-chartreuse' 
                        : 'bg-transparent text-gray-600 border-gray-300 hover:bg-gray-100'
                    }`}
                    aria-pressed={field.value === false}
                  >
                    Non
                  </button>
                  <button
                    type="button"
                    onClick={() => field.onChange(true)}
                    className={`px-4 py-2 rounded border text-sm font-medium transition-colors ${
                      field.value === true 
                        ? 'bg-brand-chartreuse text-white border-brand-chartreuse' 
                        : 'bg-transparent text-gray-600 border-gray-300 hover:bg-gray-100'
                    }`}
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
                  <FormLabel>URL du site web</FormLabel>
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
      </div>

      {/* Logo */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <div className="flex items-center mb-4">
          <Image className="mr-2 h-5 w-5 text-brand-chartreuse" />
          <h3 className="text-lg font-medium">Logo de votre conciergerie</h3>
        </div>
        <LogoUploader 
          logoPreview={logoPreview} 
          handleLogoChange={handleLogoChange}
          isUploading={isUploadingLogo}
          conciergerieNom={conciergerieNom}
        />
      </div>

      {/* Avis */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <div className="flex items-center mb-4">
          <Star className="mr-2 h-5 w-5 text-brand-chartreuse" />
          <h3 className="text-lg font-medium">Avis sur la conciergerie</h3>
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

      <div className="flex justify-between pt-6 border-t">
        <Button variant="outline" onClick={onBack} disabled={loading} className="flex items-center">
          <ArrowLeft className="mr-2 h-4 w-4" /> Retour
        </Button>

        <Button onClick={onSubmit} disabled={loading}>
          {loading ? "Envoi en cours..." : submitText}
        </Button>
      </div>
    </div>
  );
};

export default NewStepThree;
