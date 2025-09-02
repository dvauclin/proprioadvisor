"use client";

import React, { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  ResponsiveDialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui-kit/dialog";
import { Button } from "@/components/ui-kit/button";
import { Input } from "@/components/ui-kit/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui-kit/form";
import { Checkbox } from "@/components/ui-kit/checkbox";
import { Separator } from "@/components/ui-kit/separator";
import { toast } from "sonner";
import { submitLead } from "@/services/leadService";
import { supabase } from "@/integrations/supabase/client";
import { triggerMultipleLeadsSubmitted } from "@/utils/webhookService";
import { Formule, Conciergerie } from "@/types";
import { Loader2, LayoutDashboard, Clock, Home, Square, Bed, MapPin, Building, Phone, Mail, User, Send, ClipboardList } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui-kit/select";

interface FavoriteFormule extends Formule {
  conciergerie?: Conciergerie;
}

interface MultipleDevisModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  favorites: FavoriteFormule[];
}

// Array of service options - same as DevisForm
const serviceOptions = [{
  id: 'menage_blanchisserie',
  label: 'Ménage / Blanchisserie'
}, {
  id: 'checkin_checkout',
  label: 'Check-in / Check-out'
}, {
  id: 'gestion_annonce',
  label: 'Gestion de l\'annonce'
}, {
  id: 'creation_annonce',
  label: 'Création de l\'annonce'
}];

// Array of property types - same as DevisForm
const propertyTypes = [{
  id: 'standard',
  label: 'Standard / Milieu de gamme'
}, {
  id: 'luxe',
  label: 'Haut de gamme / Luxe'
}];

// Schema identical to DevisForm
const formSchema = z.object({
  nom: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  email: z.string().email("Adresse email invalide"),
  telephone: z.string().min(10, "Numéro de téléphone invalide"),
  adresse: z.string().min(5, "L'adresse doit contenir au moins 5 caractères"),
  ville: z.string().min(2, "La ville doit contenir au moins 2 caractères"),
  superficie: z.coerce.number().min(1, "La superficie doit être positive"),
  nombreChambres: z.coerce.number().min(0, "Le nombre de chambres doit être positif ou nul"),
  typeBien: z.enum(["standard", "luxe"]),
  dureeEspacementDisposition: z.enum(["moins3mois", "3a6mois", "6a12mois", "plus1an"]),
  prestationsRecherchees: z.array(z.string()).min(1, "Sélectionnez au moins un service"),
  plusieursLogements: z.boolean().default(false),
  residencePrincipale: z.boolean().default(false),
  selectedFormules: z.array(z.string()).min(1, "Vous devez sélectionner au moins une formule")
});

type FormValues = z.infer<typeof formSchema>;

const MultipleDevisModal: React.FC<MultipleDevisModalProps> = ({
  open,
  onOpenChange,
  favorites
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nom: "",
      email: "",
      telephone: "",
      adresse: "",
      ville: "",
      superficie: 0,
      nombreChambres: 0,
      typeBien: "standard",
      dureeEspacementDisposition: "plus1an",
      prestationsRecherchees: [],
      plusieursLogements: false,
      residencePrincipale: false,
      selectedFormules: favorites.map(f => f.id)
    }
  });

  const selectedFormules = form.watch("selectedFormules");
  const selectedFavorites = favorites.filter(f => selectedFormules.includes(f.id));

  const handleFormuleToggle = (formuleId: string) => {
    const currentSelected = form.getValues("selectedFormules");
    const newSelected = currentSelected.includes(formuleId)
      ? currentSelected.filter(id => id !== formuleId)
      : [...currentSelected, formuleId];
    
    form.setValue("selectedFormules", newSelected);
  };

  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);

    try {
      // Create a message listing all selected formulas
      const formulesInfo = selectedFavorites
        .map(f => `- ${f.nom} (${f.conciergerie?.nom})`)
        .join('\n');
      
      const fullMessage = `Demande de devis multiple pour les formules suivantes:\n${formulesInfo}`;

      // Submit one lead for each selected formula
      for (const favorite of selectedFavorites) {
        await submitLead({
          nom: values.nom,
          mail: values.email,
          telephone: values.telephone,
          ville: values.ville,
          adresse: values.adresse,
          superficie: values.superficie,
          nombreChambres: values.nombreChambres,
          typeBien: values.typeBien,
          dureeEspacementDisposition: values.dureeEspacementDisposition,
          residencePrincipale: values.residencePrincipale,
          plusieursLogements: values.plusieursLogements,
          prestationsRecherchees: values.prestationsRecherchees,
          formuleId: favorite.id,
          message: fullMessage
        });
      }

      // Récupérer les emails des conciergeries via jointure
      const { data: conciergeriesData } = await supabase
        .from('formules')
        .select(`
          id,
          conciergeries (
            nom,
            mail
          )
        `)
        .in('id', selectedFormules);

      // Trigger webhook for multiple lead submission
      const conciergeriesInfo = conciergeriesData?.map(formule => ({
        nom: formule.conciergeries?.nom || "Nom inconnu",
        email: formule.conciergeries?.mail || "Email inconnu"
      })) || [];

      await triggerMultipleLeadsSubmitted({
        total_leads: selectedFormules.length,
        conciergeries: conciergeriesInfo
      });

      toast.success("Votre demande de devis a été envoyée avec succès");

      onOpenChange(false);
      form.reset();

    } catch (error) {
      toast.error("Une erreur est survenue lors de l'envoi de vos demandes");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Function to get icon for service - same as DevisForm
  const getServiceIcon = (serviceId: string) => {
    switch (serviceId) {
      case 'menage_blanchisserie':
        return;
      case 'checkin_checkout':
        return;
      case 'gestion_annonce':
        return;
      case 'creation_annonce':
        return;
      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <ResponsiveDialogContent className="max-w-4xl max-h-[90vh] sm:max-h-[90vh] max-sm:max-h-[calc(100vh-1rem)] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Contacter plusieurs conciergeries</DialogTitle>
        </DialogHeader>

        <div className="max-h-[70vh] sm:max-h-[70vh] max-sm:max-h-[calc(100vh-8rem)] overflow-y-auto px-2 py-0">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {/* Selected formulas section */}
              <FormField
                control={form.control}
                name="selectedFormules"
                render={() => (
                  <FormItem>
                    <FormLabel className="text-base font-semibold">Formules sélectionnées ({selectedFormules.length})</FormLabel>
                    <div className="mt-2 space-y-2 max-h-40 overflow-y-auto">
                      {favorites.map(favorite => (
                        <div key={favorite.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={favorite.id}
                            checked={selectedFormules.includes(favorite.id)}
                            onCheckedChange={() => handleFormuleToggle(favorite.id)}
                          />
                          <label htmlFor={favorite.id} className="text-sm cursor-pointer flex-1">
                            <span className="font-medium">{favorite.nom}</span>
                            {favorite.conciergerie && (
                              <span className="text-gray-500 ml-2">({favorite.conciergerie.nom})</span>
                            )}
                          </label>
                        </div>
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Separator />

              {/* Special cases section - same as DevisForm */}
              <div className="mt-4 mb-2">
                <p className="flex items-center text-base font-medium">
                  <ClipboardList className="h-5 w-5 text-brand-chartreuse mr-2" />
                  Cas spécifiques
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="plusieursLogements"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                      <FormLabel className="font-normal">
                        Confier plusieurs logements
                      </FormLabel>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="residencePrincipale"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                      <FormLabel className="font-normal">
                        Confier ma résidence principale
                      </FormLabel>
                    </FormItem>
                  )}
                />
              </div>

              {/* Services section - same as DevisForm */}
              <FormField
                control={form.control}
                name="prestationsRecherchees"
                render={() => (
                  <FormItem className="w-full">
                    <div className="mb-2">
                      <FormLabel className="flex items-center">
                        <LayoutDashboard className="h-5 w-5 text-brand-chartreuse mr-2" />
                        Services recherchés
                      </FormLabel>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {serviceOptions.map(service => (
                        <FormField
                          key={service.id}
                          control={form.control}
                          name="prestationsRecherchees"
                          render={({ field }) => {
                            return (
                              <FormItem key={service.id} className="flex flex-row items-start space-x-3 space-y-0">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(service.id)}
                                    onCheckedChange={(checked) => {
                                      return checked
                                        ? field.onChange([...field.value, service.id])
                                        : field.onChange(field.value?.filter((value) => value !== service.id))
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className="font-normal flex items-center">
                                  {getServiceIcon(service.id)}
                                  {service.label}
                                </FormLabel>
                              </FormItem>
                            )
                          }}
                        />
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Duration and property type - same layout as DevisForm */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="dureeEspacementDisposition"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center">
                        <Clock className="h-5 w-5 text-brand-chartreuse mr-2" />
                        Durée de mise à disposition
                      </FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionnez une durée" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="moins3mois">Moins de 3 mois</SelectItem>
                          <SelectItem value="3a6mois">De 3 à 6 mois</SelectItem>
                          <SelectItem value="6a12mois">De 6 à 12 mois</SelectItem>
                          <SelectItem value="plus1an">Plus d'un an</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="typeBien"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center">
                        <Home className="h-5 w-5 text-brand-chartreuse mr-2" />
                        Type de bien
                      </FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionnez un type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {propertyTypes.map(option => (
                            <SelectItem key={option.id} value={option.id}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Property details - same layout as DevisForm */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <FormField
                  control={form.control}
                  name="superficie"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center">
                        <Square className="h-5 w-5 text-brand-chartreuse mr-2" />
                        Superficie (m²)
                      </FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="Surface" min="1" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="nombreChambres"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center">
                        <Bed className="h-5 w-5 text-brand-chartreuse mr-2" />
                        Chambres
                      </FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="Nombre" min="0" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="adresse"
                  render={({ field }) => (
                    <FormItem className="col-span-2 md:col-span-2">
                      <FormLabel className="flex items-center">
                        <MapPin className="h-5 w-5 text-brand-chartreuse mr-2" />
                        Adresse
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="Adresse de votre bien" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Contact details - same layout as DevisForm */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="ville"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center">
                        <Building className="h-5 w-5 text-brand-chartreuse mr-2" />
                        Ville
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="Ville de votre bien" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="telephone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center">
                        <Phone className="h-5 w-5 text-brand-chartreuse mr-2" />
                        Téléphone
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="Votre numéro de téléphone" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center">
                        <Mail className="h-5 w-5 text-brand-chartreuse mr-2" />
                        Email
                      </FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="votre@email.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="nom"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center">
                        <User className="h-5 w-5 text-brand-chartreuse mr-2" />
                        Nom et prénom
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="Votre nom" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Submit button */}
              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                >
                  Annuler
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting || selectedFormules.length === 0}
                  className=""
                >
                  {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  <Send className="h-4 w-4 mr-2" />
                  {isSubmitting ? "Envoi en cours..." : `Envoyer ${selectedFormules.length} demande${selectedFormules.length > 1 ? 's' : ''}`}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </ResponsiveDialogContent>
    </Dialog>
  );
};

export default MultipleDevisModal;

