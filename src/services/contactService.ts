
import { supabase } from "@/integrations/supabase/client";
import { ContactMessage } from "@/types";
import { type ContactFormData } from "@/schemas/contactFormSchema";

export const sendContactMessage = async (formData: ContactFormData) => {
  try {
    console.log("🚀 Tentative d'envoi de message via Edge Function:", formData);

    // Validation des données côté client
    if (!formData.nom?.trim()) {
      return { success: false, error: "Le nom est requis" };
    }
    if (!formData.email?.trim()) {
      return { success: false, error: "L'email est requis" };
    }
    if (!formData.sujet?.trim()) {
      return { success: false, error: "Le sujet est requis" };
    }
    if (!formData.message?.trim()) {
      return { success: false, error: "Le message est requis" };
    }

    // Appeler la fonction Edge au lieu d'insérer directement
    const { data, error } = await supabase.functions.invoke('submit-contact', {
      body: {
        nom: formData.nom.trim(),
        email: formData.email.trim(),
        sujet: formData.sujet.trim(),
        message: formData.message.trim()
      }
    });

    if (error) {
      console.error("❌ Erreur fonction Edge:", error);
      throw new Error("Erreur lors de l'envoi de votre message. Veuillez réessayer.");
    }

    if (!data.success) {
      console.error("❌ Échec fonction Edge:", data.error);
      throw new Error(data.error || "Erreur lors de l'envoi de votre message.");
    }
    
    console.log("✅ Message envoyé avec succès via Edge Function:", data);
    return data.data;
    
  } catch (error) {
    console.error("💥 Erreur inattendue:", error);
    throw new Error(error instanceof Error ? error.message : "Une erreur inattendue s'est produite. Veuillez réessayer.");
  }
};

export const getContactMessages = async (): Promise<ContactMessage[]> => {
  const { data, error } = await supabase
    .from('contact_messages')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching contact messages:', error);
    throw new Error(error.message);
  }

  return data as ContactMessage[];
};

export const updateContactMessageStatus = async (
  id: string, 
  status: { is_read?: boolean; is_processed?: boolean }
): Promise<ContactMessage> => {
  const { data, error } = await supabase
    .from('contact_messages')
    .update(status)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating contact message status:', error);
    throw new Error(error.message);
  }

  return data as ContactMessage;
};

export const deleteContactMessage = async (id: string) => {
  const { error } = await supabase
    .from('contact_messages')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting contact message:', error);
    throw new Error(error.message);
  }

  return true;
};
