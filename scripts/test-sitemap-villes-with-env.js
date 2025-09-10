const { createClient } = require('@supabase/supabase-js');

// Variables d'environnement pour le test
const SUPABASE_URL = 'https://gajceuvnerzlnuqvhnan.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdhamNldXZuZXJ6bG51cXZobmFuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU5MzM1MzgsImV4cCI6MjA2MTUwOTUzOH0.7gsaxDRXCGBALLfbAawQoFZEPxATam_0oWdgig5oDIs';

console.log('🧪 Test des sitemaps avec variables d\'environnement hardcodées\n');

async function testSupabase() {
  try {
    console.log('🔗 Connexion à Supabase...');
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    
    // Test de la table villes
    console.log('📋 Test de la table villes...');
    const { data: villes, error: villesError } = await supabase
      .from('villes')
      .select('slug, nom')
      .order('nom', { ascending: true })
      .limit(10);

    if (villesError) {
      console.error('❌ Erreur lors de la récupération des villes:', villesError);
      return;
    } else {
      console.log('✅ Villes récupérées:', villes.length);
      console.log('📝 Exemples de villes:');
      villes.slice(0, 5).forEach(ville => {
        console.log(`   - ${ville.nom} (${ville.slug})`);
      });
    }

    // Test du nombre total de villes
    const { count } = await supabase
      .from('villes')
      .select('*', { count: 'exact', head: true });

    console.log(`📊 Nombre total de villes: ${count}`);

    // Test de génération du sitemap XML
    console.log('\n🗺️ Test de génération du sitemap XML...');
    const now = new Date().toISOString().split('T')[0];
    
    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

    villes.forEach(ville => {
      if (!ville || !ville.slug) return;
      xml += `
  <url>
    <loc>https://proprioadvisor.fr/conciergerie/${ville.slug}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;
    });

    xml += `
</urlset>`;

    console.log('✅ Sitemap XML généré avec succès');
    console.log(`📏 Taille du XML: ${xml.length} caractères`);
    console.log(`🏙️ Nombre d'URLs dans le sitemap: ${villes.length}`);

    // Afficher les premières URLs
    console.log('\n🔗 Premières URLs du sitemap:');
    villes.slice(0, 3).forEach(ville => {
      console.log(`   - https://proprioadvisor.fr/conciergerie/${ville.slug}`);
    });

  } catch (error) {
    console.error('❌ Erreur lors du test Supabase:', error);
  }
}

testSupabase();
