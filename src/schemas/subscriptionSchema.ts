
import { z } from "zod";

export const subscriptionSchema = z.object({
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
}).refine(data => {
  // Only validate password matching if both passwords are provided
  if (data.password || data.confirmPassword) {
    if (!data.password || data.password.length < 6) {
      return false;
    }
    if (!data.confirmPassword || data.confirmPassword.length < 6) {
      return false;
    }
    return data.password === data.confirmPassword;
  }
  return true;
}, {
  message: "Les mots de passe ne correspondent pas ou sont trop courts (minimum 6 caractÃ¨res)",
  path: ["confirmPassword"]
});

