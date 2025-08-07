import * as z from "zod";

// Schema definition for the inscription form
export const inscriptionSchema = z.object({
  nom: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  logo: z.string().optional(),
  mail: z.string().email("L'adresse email n'est pas valide"),
  nomContact: z.string().min(2, "Le nom du contact doit contenir au moins 2 caractères"),
  telephoneContact: z.string().min(10, "Le numéro de téléphone doit contenir au moins 10 caractères"),
  typeLogementAccepte: z.enum(["standard", "luxe", "tous"]),
  deductionFrais: z.enum(["deductTous", "deductMenage", "inclus"]),
  tva: z.enum(["TTC", "HT"]),
  accepteGestionPartielle: z.boolean(),
  accepteResidencePrincipale: z.boolean(),
  superficieMin: z.coerce.number().min(0, "La superficie minimale doit être positive"),
  nombreChambresMin: z.coerce.number().min(0, "Le nombre de chambres doit être positif"),
  villesIds: z.array(z.string()), // Remove .min(1) to allow empty array
  zoneCouverte: z.string().optional(),
  urlAvis: z.string().url("L'URL n'est pas valide").optional().or(z.literal("")),
});

export type FormValues = z.infer<typeof inscriptionSchema>;
