import { SupabaseClient } from '@supabase/supabase-js';
import { AuthContextType } from '@/contexts/AuthContext';

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
          description: "Impossible de crÃ©er le compte utilisateur, mais la souscription continuera.",
          variant: "destructive"
        });
        return { userLoggedIn: false, errorOccurred: true };
      } else if (newUser.user && !createUserError) {
        await signIn(email, password); // Attempt to sign in again after successful sign-up
        toast({
          title: "Compte crÃ©Ã© et connexion rÃ©ussie",
          description: "Vous Ãªtes maintenant connectÃ© Ã  votre compte"
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
        title: "Connexion rÃ©ussie",
        description: "Vous Ãªtes maintenant connectÃ© Ã  votre compte"
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

