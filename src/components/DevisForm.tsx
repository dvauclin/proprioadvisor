"use client";

import React, { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { submitLead } from "@/services/supabaseService";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2, LayoutDashboard, Clock, Home, Square, Bed, MapPin, Building, Phone, Mail, User, Send, ClipboardList } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { triggerWebhook } from "@/utils/webhookService";

// Array of service options with only the requested options
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

// Array of property types with only the requested options
const propertyTypes = [{
  id: 'standard',
  label: 'Standard / Milieu de gamme'
}, {
  id: 'luxe',
  label: 'Haut de gamme / Luxe'
}];

// Schéma de validation du formulaire
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
  residencePrincipale: z.boolean().default(false)
});

type FormValues = z.infer<typeof formSchema>;

interface DevisFormProps {
  formuleId: string;
  conciergerieName: string;
  formuleName: string;
  onSuccess: () => void;
  conciergerieId: string;
  conciergerieEmail: string;
}

export const DevisForm: React.FC<DevisFormProps> = ({
  formuleId,
  conciergerieName,
  formuleName,
  onSuccess,
  conciergerieEmail
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
      residencePrincipale: false
    }
  });

  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    try {
      console.log("Submitting lead with formuleId:", formuleId);
      const result = await submitLead({
        nom: values.nom,
        mail: values.email,
        telephone: values.telephone,
        adresse: values.adresse,
        ville: values.ville,
        superficie: values.superficie,
        nombreChambres: values.nombreChambres,
        typeBien: values.typeBien,
        prestationsRecherchees: values.prestationsRecherchees,
        dureeEspacementDisposition: values.dureeEspacementDisposition,
        formuleId: formuleId,
        plusieursLogements: values.plusieursLogements,
        residencePrincipale: values.residencePrincipale
      });
      
      if (result.success) {
        // Récupérer l'email de la conciergerie via jointure
        const { data: conciergerieData } = await supabase
          .from('formules')
          .select(`
            conciergeries (
              nom,
              mail
            )
          `)
          .eq('id', formuleId)
          .single();

        // Trigger the webhook with lead data
        await triggerWebhook({
          type: "lead_submitted",
          nom: conciergerieData?.conciergeries?.nom || conciergerieName,
          email: conciergerieData?.conciergeries?.mail || conciergerieEmail,
          timestamp: new Date().toISOString()
        });
        
        toast.success("Votre demande de devis a été envoyée avec succès");
        form.reset();
        onSuccess();
      } else {
        toast.error("Erreur lors de l'envoi de votre demande: " + (result.error || "Erreur inconnue"));
      }
    } catch (error) {
      console.error("Erreur lors de la soumission du devis:", error);
      toast.error("Une erreur est survenue lors de l'envoi de votre demande");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Function to get icon for service
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
    <div className="max-h-[70vh] overflow-y-auto px-2 py-0">
      <p className="mb-4">
        Demande de devis pour la formule <strong>{formuleName}</strong> de <strong>{conciergerieName}</strong>
      </p>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* Add section title for specific cases */}
          <div className="mt-4 mb-2">
            <p className="flex items-center text-base font-medium">
              <ClipboardList className="h-5 w-5 text-brand-chartreuse mr-2" />
              Cas spécifiques
            </p>
          </div>

          {/* Additional options checkboxes for multiple properties and primary residence */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField control={form.control} name="plusieursLogements" render={({
            field
          }) => <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <FormLabel className="font-normal">
                    Confier plusieurs logements
                  </FormLabel>
                </FormItem>} />
            
            <FormField control={form.control} name="residencePrincipale" render={({
            field
          }) => <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <FormLabel className="font-normal">
                    Confier ma résidence principale
                  </FormLabel>
                </FormItem>} />
          </div>

          {/* Services recherchés - 100% width on all screens */}
          <FormField control={form.control} name="prestationsRecherchees" render={() => <FormItem className="w-full">
                <div className="mb-2">
                  <FormLabel className="flex items-center">
                    <LayoutDashboard className="h-5 w-5 text-brand-chartreuse mr-2" />
                    Services recherchés
                  </FormLabel>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {serviceOptions.map(service => <FormField key={service.id} control={form.control} name="prestationsRecherchees" render={({
              field
            }) => {
              return <FormItem key={service.id} className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox checked={field.value?.includes(service.id)} onCheckedChange={checked => {
                    return checked ? field.onChange([...field.value, service.id]) : field.onChange(field.value?.filter(value => value !== service.id));
                  }} />
                            </FormControl>
                            <FormLabel className="font-normal flex items-center">
                              {getServiceIcon(service.id)}
                              {service.label}
                            </FormLabel>
                          </FormItem>;
            }} />)}
                </div>
                <FormMessage />
              </FormItem>} />

          {/* Responsive layout for second row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Durée de mise à disposition - 100% on mobile, 50% on desktop */}
            <FormField control={form.control} name="dureeEspacementDisposition" render={({
            field
          }) => <FormItem>
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
                </FormItem>} />
            
            {/* Type de bien - 100% on mobile, 50% on desktop */}
            <FormField control={form.control} name="typeBien" render={({
            field
          }) => <FormItem>
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
                      {propertyTypes.map(option => <SelectItem key={option.id} value={option.id}>
                          {option.label}
                        </SelectItem>)}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>} />
          </div>

          {/* Responsive layout for third row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* Superficie - 50% on mobile, 25% on desktop */}
            <FormField control={form.control} name="superficie" render={({
            field
          }) => <FormItem>
                  <FormLabel className="flex items-center">
                    <Square className="h-5 w-5 text-brand-chartreuse mr-2" />
                    Superficie (m²)
                  </FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="Surface" min="1" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>} />
            
            {/* Nombre de chambres - 50% on mobile, 25% on desktop */}
            <FormField control={form.control} name="nombreChambres" render={({
            field
          }) => <FormItem>
                  <FormLabel className="flex items-center">
                    <Bed className="h-5 w-5 text-brand-chartreuse mr-2" />
                    Chambres
                  </FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="Nombre" min="0" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>} />
            
            {/* Adresse - 100% on mobile, 50% on desktop */}
            <FormField control={form.control} name="adresse" render={({
            field
          }) => <FormItem className="col-span-2 md:col-span-2">
                  <FormLabel className="flex items-center">
                    <MapPin className="h-5 w-5 text-brand-chartreuse mr-2" />
                    Adresse
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Adresse de votre bien" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>} />
          </div>

          {/* Responsive layout for fourth row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Ville - 100% on mobile, 50% on desktop */}
            <FormField control={form.control} name="ville" render={({
            field
          }) => <FormItem>
                  <FormLabel className="flex items-center">
                    <Building className="h-5 w-5 text-brand-chartreuse mr-2" />
                    Ville
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Ville de votre bien" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>} />

            {/* Téléphone - 100% on mobile, 50% on desktop */}
            <FormField control={form.control} name="telephone" render={({
            field
          }) => <FormItem>
                  <FormLabel className="flex items-center">
                    <Phone className="h-5 w-5 text-brand-chartreuse mr-2" />
                    Téléphone
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Votre numéro de téléphone" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>} />
          </div>

          {/* Responsive layout for fifth row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Email - 100% on mobile, 50% on desktop */}
            <FormField control={form.control} name="email" render={({
            field
          }) => <FormItem>
                  <FormLabel className="flex items-center">
                    <Mail className="h-5 w-5 text-brand-chartreuse mr-2" />
                    Email
                  </FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="votre@email.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>} />

            {/* Nom et prénom - 100% on mobile, 50% on desktop */}
            <FormField control={form.control} name="nom" render={({
            field
          }) => <FormItem>
                  <FormLabel className="flex items-center">
                    <User className="h-5 w-5 text-brand-chartreuse mr-2" />
                    Nom et prénom
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Votre nom" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>} />
          </div>

          <div className="flex justify-end">
            <Button type="submit" disabled={isSubmitting} className="bg-brand-chartreuse text-black hover:bg-brand-chartreuse/90">
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              <Send className="h-4 w-4 mr-2" />
              Envoyer la demande
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
