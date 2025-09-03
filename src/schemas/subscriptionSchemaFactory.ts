
import { z } from "zod";

export const createSubscriptionSchema = (isExistingSubscription: boolean, hasEmail: boolean) => {
  const baseSchema = z.object({
    options: z.object({
      websiteLink: z.boolean().default(false),
      phoneNumber: z.boolean().default(false),
      backlink: z.boolean().default(false)
    }),
    customAmount: z.string().optional().refine(val => !val || Number(val) >= 0 && Number(val) <= 1000, {
      message: "Le montant doit être entre 0 et 1000"
    }),
    useCustomAmount: z.boolean().default(false),
    websiteUrl: z.string().optional().or(z.literal("")),
    phoneNumberValue: z.string().min(10, "Le numéro de téléphone doit contenir au moins 10 caractères").optional().or(z.literal("")),
    password: z.string().optional(),
    confirmPassword: z.string().optional()
  });

  // If it's not an existing subscription AND we have an email, require passwords
  if (!isExistingSubscription && hasEmail) {
    return baseSchema.extend({
      password: z.string().min(6, "Le mot de passe doit contenir au moins 6 caractères"),
      confirmPassword: z.string().min(6, "Le mot de passe doit contenir au moins 6 caractères")
    }).refine(data => data.password === data.confirmPassword, {
      message: "Les mots de passe ne correspondent pas",
      path: ["confirmPassword"]
    });
  }

  return baseSchema;
};

