const fetch = require('node-fetch');

async function testRevalidation() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  
  console.log('🧪 Testing article revalidation...');
  
  try {
    // Test 1: Revalider toutes les pages
    console.log('\n1. Testing general revalidation...');
    const response1 = await fetch(`${baseUrl}/api/revalidate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({})
    });
    
    const result1 = await response1.json();
    console.log('✅ General revalidation result:', result1);
    
    // Test 2: Revalider une page spécifique (remplacez par un slug d'article existant)
    console.log('\n2. Testing specific article revalidation...');
    const testSlug = 'trouver-des-clients-conciergerie-airbnb'; // Remplacez par un slug existant
    const response2 = await fetch(`${baseUrl}/api/revalidate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slug: testSlug })
    });
    
    const result2 = await response2.json();
    console.log(`✅ Specific revalidation result for /${testSlug}:`, result2);
    
    // Test 3: Vérifier la page de test
    console.log('\n3. Testing article cache page...');
    const response3 = await fetch(`${baseUrl}/test-article-cache`);
    console.log('✅ Article cache page status:', response3.status);
    
  } catch (error) {
    console.error('❌ Error during revalidation test:', error);
  }
}

testRevalidation();
