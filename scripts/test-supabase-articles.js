const { createClient } = require('@supabase/supabase-js');

// Configuration Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Supabase environment variables not found');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testSupabaseArticles() {
  console.log('🧪 Testing Supabase articles data...');
  
  try {
    // Test 1: Récupérer tous les articles
    console.log('\n1. Fetching all articles...');
    const { data: allArticles, error: allError } = await supabase
      .from('articles')
      .select('*, resume, question_1, reponse_1, question_2, reponse_2, question_3, reponse_3, question_4, reponse_4, question_5, reponse_5')
      .order('date_modification', { ascending: false });
    
    if (allError) {
      console.error('❌ Error fetching all articles:', allError);
      return;
    }
    
    console.log(`✅ Found ${allArticles.length} articles`);
    allArticles.slice(0, 3).forEach((article, index) => {
      console.log(`   ${index + 1}. ${article.titre} (${article.slug}) - Modified: ${article.date_modification}`);
    });
    
    // Test 2: Récupérer un article spécifique
    if (allArticles.length > 0) {
      const testSlug = allArticles[0].slug;
      console.log(`\n2. Fetching specific article: ${testSlug}`);
      
      const { data: specificArticle, error: specificError } = await supabase
        .from('articles')
        .select('*, resume, question_1, reponse_1, question_2, reponse_2, question_3, reponse_3, question_4, reponse_4, question_5, reponse_5')
        .eq('slug', testSlug)
        .single();
      
      if (specificError) {
        console.error('❌ Error fetching specific article:', specificError);
        return;
      }
      
      console.log('✅ Specific article data:');
      console.log(`   Title: ${specificArticle.titre}`);
      console.log(`   Slug: ${specificArticle.slug}`);
      console.log(`   Excerpt: ${specificArticle.excerpt}`);
      console.log(`   Modified: ${specificArticle.date_modification}`);
      console.log(`   Content preview: ${specificArticle.contenu?.substring(0, 100)}...`);
    }
    
    // Test 3: Vérifier les timestamps
    console.log('\n3. Checking timestamps...');
    const now = new Date();
    allArticles.forEach((article, index) => {
      const modifiedDate = new Date(article.date_modification);
      const timeDiff = now - modifiedDate;
      const hoursDiff = timeDiff / (1000 * 60 * 60);
      
      console.log(`   ${index + 1}. ${article.titre}: ${hoursDiff.toFixed(2)} hours ago`);
    });
    
  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

testSupabaseArticles();
