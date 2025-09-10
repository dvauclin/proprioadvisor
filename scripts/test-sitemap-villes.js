const { createClient } = require('@supabase/supabase-js');

// Test des variables d'environnement
console.log('=== Test des variables d\'environnement ===');
console.log('NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Défini' : 'Non défini');
console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Défini' : 'Non défini');
console.log('SUPABASE_URL:', process.env.SUPABASE_URL ? 'Défini' : 'Non défini');
console.log('SUPABASE_PUBLISHABLE_KEY:', process.env.SUPABASE_PUBLISHABLE_KEY ? 'Défini' : 'Non défini');

// Test de connexion à Supabase
async function testSupabase() {
  try {
    const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      console.error('❌ Variables d\'environnement Supabase manquantes');
      return;
    }

    console.log('\n=== Test de connexion à Supabase ===');
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    
    // Test de la table villes
    console.log('📋 Test de la table villes...');
    const { data: villes, error: villesError } = await supabase
      .from('villes')
      .select('slug, nom')
      .order('nom', { ascending: true })
      .limit(5);

    if (villesError) {
      console.error('❌ Erreur lors de la récupération des villes:', villesError);
    } else {
      console.log('✅ Villes récupérées:', villes.length);
      console.log('📝 Exemples de villes:', villes.slice(0, 3));
    }

    // Test du nombre total de villes
    const { count } = await supabase
      .from('villes')
      .select('*', { count: 'exact', head: true });

    console.log('📊 Nombre total de villes:', count);

  } catch (error) {
    console.error('❌ Erreur lors du test Supabase:', error);
  }
}

testSupabase();
