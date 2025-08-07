
import * as z from "zod";

// Schema definition for the formule form
export const formuleSchema = z.object({
  nom: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  commission: z.coerce.number().min(5, "Veuillez entrer un pourcentage de commission valide").max(40, "Veuillez entrer un pourcentage de commission valide"),
  dureeGestionMin: z.coerce.number().min(0, "La durée minimum doit être d'au moins 0 mois"),
  servicesInclus: z.array(z.string()),
  fraisMenageHeure: z.coerce.number().min(0, "Les frais doivent être positifs"),
  fraisDemarrage: z.coerce.number().min(0, "Les frais doivent être positifs"),
  abonnementMensuel: z.coerce.number().min(0, "L'abonnement doit être positif"),
  fraisSupplementaireLocation: z.coerce.number().min(0, "Les frais doivent être positifs"),
  fraisReapprovisionnement: z.enum(["reel", "forfait", "inclus"]).default("inclus"),
  forfaitReapprovisionnement: z.coerce.number().min(0, "Le forfait doit être positif"),
  locationLinge: z.enum(["optionnel", "obligatoire", "inclus"]).default("inclus"),
  prixLocationLinge: z.coerce.number().min(0, "Le prix doit être positif")
});

// Export this type for use in other components
export type FormuleFormData = z.infer<typeof formuleSchema>;
