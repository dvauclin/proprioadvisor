
import { z } from "zod";

export const createSubscriptionSchema = (isExistingSubscription: boolean, hasEmail: boolean) => {
  const baseSchema = z.object({
    options: z.object({
      basicListing: z.boolean().default(true),
      partnerListing: z.boolean().default(true),
      websiteLink: z.boolean().default(false),
      phoneNumber: z.boolean().default(false),
      backlink: z.boolean().default(true),
      conciergeriePageLink: z.boolean().default(false)
    }),
    customAmount: z.string().optional().refine(val => !val || Number(val) >= 0 && Number(val) <= 1000, {
      message: "Le montant doit Ãªtre entre 0â‚¬ et 1000â‚¬"
    }),
    useCustomAmount: z.boolean().default(false),
    websiteUrl: z.string().optional().or(z.literal("")),
    phoneNumberValue: z.string().min(10, "Le numÃ©ro de tÃ©lÃ©phone doit contenir au moins 10 caractÃ¨res").optional().or(z.literal("")),
    password: z.string().optional(),
    confirmPassword: z.string().optional()
  });

  // If it's not an existing subscription AND we have an email, require passwords
  if (!isExistingSubscription && hasEmail) {
    return baseSchema.extend({
      password: z.string().min(6, "Le mot de passe doit contenir au moins 6 caractÃ¨res"),
      confirmPassword: z.string().min(6, "Le mot de passe doit contenir au moins 6 caractÃ¨res")
    }).refine(data => data.password === data.confirmPassword, {
      message: "Les mots de passe ne correspondent pas",
      path: ["confirmPassword"]
    });
  }

  return baseSchema;
};

