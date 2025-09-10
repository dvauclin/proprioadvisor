
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    if (req.method !== 'POST') {
      return new Response(
        JSON.stringify({ error: 'Method not allowed' }),
        { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const body = await req.json()
    const { nom, email, sujet, message } = body

    console.log('📨 Réception du message de contact:', body)

    // Validation des données
    if (!nom?.trim()) {
      return new Response(
        JSON.stringify({ success: false, error: "Le nom est requis" }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (!email?.trim()) {
      return new Response(
        JSON.stringify({ success: false, error: "L'email est requis" }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (!sujet?.trim()) {
      return new Response(
        JSON.stringify({ success: false, error: "Le sujet est requis" }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (!message?.trim()) {
      return new Response(
        JSON.stringify({ success: false, error: "Le message est requis" }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Données à insérer
    const insertData = {
      nom: nom.trim(),
      email: email.trim(),
      sujet: sujet.trim(),
      message: message.trim(),
      is_read: false,
      is_processed: false
    }

    console.log('📤 Insertion du message dans la base:', insertData)

    // Insérer le message - RLS est désactivé donc cela devrait fonctionner
    const { data, error } = await supabase
      .from('contact_messages')
      .insert(insertData)
      .select()
      .single()

    if (error) {
      console.error('❌ Erreur lors de l\'insertion:', error)
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "Erreur lors de l'enregistrement de votre message. Veuillez réessayer." 
        }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log('✅ Message de contact inséré avec succès:', data)

    // Déclencher le webhook en arrière-plan
    try {
      const webhookData = {
        type: "contact_message_sent",
        nom: nom.trim(),
        email: email.trim(),
        sujet: sujet.trim(),
        message: message.trim(),
        timestamp: new Date().toISOString()
      };

      console.log('🔗 Déclenchement du webhook:', webhookData);

      const webhookUrl = Deno.env.get('N8N_WEBHOOK_URL');
      if (webhookUrl) {
        await fetch(webhookUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(webhookData),
        });
      }

      console.log('✅ Webhook déclenché avec succès');
    } catch (webhookError) {
      console.error('⚠️ Erreur webhook (non bloquante):', webhookError);
      // Ne pas faire échouer la requête si le webhook échoue
    }

    return new Response(
      JSON.stringify({ success: true, data }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('💥 Erreur inattendue:', error)
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: "Une erreur inattendue s'est produite. Veuillez réessayer." 
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
