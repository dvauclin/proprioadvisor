
import * as z from "zod";

// Schema definition for the formule form
export const formuleSchema = z.object({
  nom: z.string().min(2, "Le nom doit contenir au moins 2 caractÃ¨res"),
  commission: z.coerce.number().min(5, "Veuillez entrer un pourcentage de commission valide").max(40, "Veuillez entrer un pourcentage de commission valide"),
  dureeGestionMin: z.coerce.number().min(0, "La durÃ©e minimum doit Ãªtre d'au moins 0 mois"),
  servicesInclus: z.array(z.string()),
  fraisMenageHeure: z.coerce.number().min(0, "Les frais doivent Ãªtre positifs"),
  fraisDemarrage: z.coerce.number().min(0, "Les frais doivent Ãªtre positifs"),
  abonnementMensuel: z.coerce.number().min(0, "L'abonnement doit Ãªtre positif"),
  fraisSupplementaireLocation: z.coerce.number().min(0, "Les frais doivent Ãªtre positifs"),
  fraisReapprovisionnement: z.enum(["reel", "forfait", "inclus"]).default("inclus"),
  forfaitReapprovisionnement: z.coerce.number().min(0, "Le forfait doit Ãªtre positif"),
  locationLinge: z.enum(["optionnel", "obligatoire", "inclus"]).default("inclus"),
  prixLocationLinge: z.coerce.number().min(0, "Le prix doit Ãªtre positif")
});

// Export this type for use in other components
export type FormuleFormData = z.infer<typeof formuleSchema>;

