
import * as z from "zod";

export const contactFormSchema = z.object({
  nom: z.string().min(2, { message: "Le nom doit contenir au moins 2 caractÃ¨res." }),
  email: z.string().email({ message: "Veuillez entrer une adresse email valide." }),
  sujet: z.string().min(5, { message: "Le sujet doit contenir au moins 5 caractÃ¨res." }),
  message: z.string().min(10, { message: "Le message doit contenir au moins 10 caractÃ¨res." }),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;

