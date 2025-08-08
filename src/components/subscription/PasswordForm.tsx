
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl } from '@/components/ui-kit/form';
import { Input } from '@/components/ui-kit/input';
import { SubscriptionFormValues } from '@/types/subscription';

interface PasswordFormProps {
  form: UseFormReturn<SubscriptionFormValues>;
  existingSubscription: any;
  conciergerieEmail: string;
}

export const PasswordForm: React.FC<PasswordFormProps> = ({
  form,
  existingSubscription,
  conciergerieEmail
}) => {
  if (existingSubscription || !conciergerieEmail) {
    return null;
  }

  return (
    <div className="border border-gray-200 rounded-lg p-4 bg-white">
      <h3 className="font-semibold text-lg mb-3">Créer votre compte</h3>
      <p className="text-sm text-gray-600 mb-4">
        Un compte sera créé avec l'email de votre conciergerie : <strong>{conciergerieEmail}</strong>
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mot de passe</FormLabel>
              <FormControl>
                <Input 
                  type="password" 
                  placeholder="Minimum 6 caractères"
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirmer le mot de passe</FormLabel>
              <FormControl>
                <Input 
                  type="password" 
                  placeholder="Confirmez votre mot de passe"
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};
