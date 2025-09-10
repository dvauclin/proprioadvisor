
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { corsHeaders } from '../_shared/cors.ts'

interface LeadData {
  prestationsRecherchees: string[];
  dureeMiseDisposition: string;
  superficie: number;
  nombreChambres: number;
  typeBien: string;
  adresse: string;
  ville: string;
  nom: string;
  telephone: string;
  mail: string;
  message?: string;
  formuleId?: string;
  plusieursLogements?: boolean;
  residencePrincipale?: boolean;
}

const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
};

const sanitizeString = (str: string): string => {
  return str.trim().replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const leadData: LeadData = await req.json();

    // Validation des champs obligatoires
    const errors: string[] = [];

    if (!leadData.prestationsRecherchees || leadData.prestationsRecherchees.length === 0) {
      errors.push('Au moins une prestation doit être sélectionnée');
    }

    if (!leadData.dureeMiseDisposition) {
      errors.push('La durée de mise à disposition est obligatoire');
    }

    if (!leadData.superficie || leadData.superficie < 10 || leadData.superficie > 1000) {
      errors.push('La superficie doit être comprise entre 10 et 1000 m²');
    }

    if (!leadData.nombreChambres || leadData.nombreChambres < 1 || leadData.nombreChambres > 20) {
      errors.push('Le nombre de chambres doit être compris entre 1 et 20');
    }

    if (!leadData.typeBien || !['standard', 'luxe'].includes(leadData.typeBien)) {
      errors.push('Le type de bien doit être "standard" ou "luxe"');
    }

    if (!leadData.adresse || leadData.adresse.length < 5) {
      errors.push('L\'adresse doit contenir au moins 5 caractères');
    }

    if (!leadData.ville || leadData.ville.length < 2) {
      errors.push('La ville doit contenir au moins 2 caractères');
    }

    if (!leadData.nom || leadData.nom.length < 2) {
      errors.push('Le nom doit contenir au moins 2 caractères');
    }

    if (!leadData.telephone || !validatePhone(leadData.telephone)) {
      errors.push('Le numéro de téléphone n\'est pas valide');
    }

    if (!leadData.mail || !validateEmail(leadData.mail)) {
      errors.push('L\'adresse email n\'est pas valide');
    }

    if (leadData.message && leadData.message.length > 1000) {
      errors.push('Le message ne peut pas dépasser 1000 caractères');
    }

    if (errors.length > 0) {
      return new Response(
        JSON.stringify({ success: false, errors }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Sanitisation des données
    const sanitizedData = {
      ...leadData,
      adresse: sanitizeString(leadData.adresse),
      ville: sanitizeString(leadData.ville),
      nom: sanitizeString(leadData.nom),
      message: leadData.message ? sanitizeString(leadData.message) : undefined,
    };

    return new Response(
      JSON.stringify({ success: true, data: sanitizedData }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: 'Erreur de validation' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
