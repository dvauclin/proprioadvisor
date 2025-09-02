import { SupabaseClient } from '@supabase/supabase-js';
import { AuthContextType } from '@/contexts/AuthContext';
import { triggerUserAccountCreation } from '@/utils/webhookService';

interface HandleUserAuthenticationParams {
  email: string;
  password?: string;
  supabase: SupabaseClient;
  signIn: AuthContextType['signIn'];
  toast: ({ title, description, variant }: { title: string; description: string; variant?: 'default' | 'destructive' }) => void;
}

export const handleUserAuthentication = async ({
  email,
  password,
  supabase,
  signIn,
  toast,
}: HandleUserAuthenticationParams): Promise<{ userLoggedIn: boolean; errorOccurred: boolean }> => {
  if (!email || !password) {
    return { userLoggedIn: false, errorOccurred: false };
  }

  try {
    const { error: signInError } = await signIn(email, password);

    if (signInError && signInError.message.includes('Invalid login credentials')) {
      const { data: newUser, error: createUserError } = await supabase.auth.signUp({
        email: email,
        password: password,
        options: {
          emailRedirectTo: `${window.location.origin}/`
        }
      });

      if (createUserError && !createUserError.message.includes('User already registered')) { // Adjusted condition
        console.error("Error creating user:", createUserError);
        toast({
          title: "Avertissement",
          description: "Impossible de créer le compte utilisateur, mais la souscription continuera.",
          variant: "destructive"
        });
        return { userLoggedIn: false, errorOccurred: true };
      } else if (newUser.user && !createUserError) {
        // Déclencher le webhook de création de compte
        try {
          await triggerUserAccountCreation({
            user_id: newUser.user.id,
            email: email
          });
        } catch (webhookError) {
          console.error("Erreur lors du déclenchement du webhook de création de compte:", webhookError);
        }
        
        await signIn(email, password); // Attempt to sign in again after successful sign-up
        toast({
          title: "Compte créé et connexion réussie",
          description: "Vous êtes maintenant connecté à votre compte"
        });
        return { userLoggedIn: true, errorOccurred: false };
      } else if (createUserError && createUserError.message.includes('User already registered')) {
        // If user already registered but initial sign-in failed, it's an invalid password for existing user
        // The initial signInError (Invalid login credentials) is more relevant here.
        // We can let the main hook handle this, or re-throw a more specific error.
        // For now, let's indicate login failed.
         toast({
          title: "Erreur de connexion",
          description: "Les identifiants de connexion sont invalides.",
          variant: "destructive"
        });
        return { userLoggedIn: false, errorOccurred: true };
      }
    } else if (!signInError) {
      toast({
        title: "Connexion réussie",
        description: "Vous êtes maintenant connecté à votre compte"
      });
      return { userLoggedIn: true, errorOccurred: false };
    } else if (signInError) {
        // Other sign-in errors
        console.error("Sign in error:", signInError);
        toast({
            title: "Erreur de connexion",
            description: signInError.message || "Une erreur est survenue lors de la connexion.",
            variant: "destructive"
        });
        return { userLoggedIn: false, errorOccurred: true };
    }
  } catch (userError) {
    console.error("Error handling user authentication:", userError);
    toast({
      title: "Avertissement",
      description: "Impossible de vous connecter automatiquement, mais la souscription continuera.",
      variant: "destructive"
    });
    return { userLoggedIn: false, errorOccurred: true }; // Indicate error occurred
  }
  return { userLoggedIn: false, errorOccurred: false }; // Default return if no path matched (should not happen)
};

