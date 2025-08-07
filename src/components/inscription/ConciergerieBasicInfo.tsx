
import React from "react";
import { useFormContext } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const ConciergerieBasicInfo = () => {
  const form = useFormContext();

  return (
    <>
      <FormField
        control={form.control}
        name="nom"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Nom de la conciergerie</FormLabel>
            <FormControl>
              <Input {...field} placeholder="Nom de votre conciergerie" />
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
              <Input {...field} type="email" placeholder="contact@votre-conciergerie.com" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};

export default ConciergerieBasicInfo;
