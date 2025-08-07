
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
    const { conciergerieId, emetteur, note, commentaire } = body

    console.log('📨 Réception de la demande d\'avis:', body)

    // Validation des données
    if (!conciergerieId?.trim()) {
      return new Response(
        JSON.stringify({ success: false, error: "L'identifiant de la conciergerie est requis" }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (!emetteur?.trim()) {
      return new Response(
        JSON.stringify({ success: false, error: "Le nom est requis" }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (!note || note < 1 || note > 5) {
      return new Response(
        JSON.stringify({ success: false, error: "Une note entre 1 et 5 est requise" }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Vérifier que la conciergerie existe
    const { data: conciergerie, error: conciergerieError } = await supabase
      .from('conciergeries')
      .select('id')
      .eq('id', conciergerieId)
      .single()

    if (conciergerieError || !conciergerie) {
      console.error('❌ Conciergerie non trouvée:', conciergerieError)
      return new Response(
        JSON.stringify({ success: false, error: "Conciergerie non trouvée" }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Données à insérer (valide forcé à false pour modération)
    const insertData = {
      conciergerie_id: conciergerieId,
      emetteur: emetteur.trim(),
      note: note,
      commentaire: commentaire?.trim() || '',
      valide: false, // TOUJOURS false pour modération
      date: new Date().toISOString()
    }

    console.log('📤 Insertion dans la base:', insertData)

    // Insérer l'avis - RLS est désactivé donc cela devrait fonctionner
    const { data, error } = await supabase
      .from('avis')
      .insert(insertData)
      .select()
      .single()

    if (error) {
      console.error('❌ Erreur lors de l\'insertion:', error)
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "Erreur lors de l'enregistrement de votre avis. Veuillez réessayer." 
        }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log('✅ Avis inséré avec succès:', data)

    // Déclencher le webhook en arrière-plan
    try {
      const webhookData = {
        type: "avis_submitted",
        avis: {
          conciergerie_id: conciergerieId,
          emetteur: emetteur.trim(),
          note: note,
          commentaire: commentaire?.trim() || '',
          date: new Date().toISOString()
        }
      };

      console.log('🔗 Déclenchement du webhook avis:', webhookData);

      await fetch('https://n8n.davidvauclin.fr/webhook/235febdf-0463-42fd-adb2-dbb6e1c2302d', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(webhookData),
      });

      console.log('✅ Webhook avis déclenché avec succès');
    } catch (webhookError) {
      console.error('⚠️ Erreur webhook avis (non bloquante):', webhookError);
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
