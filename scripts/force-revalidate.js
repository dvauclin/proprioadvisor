const fetch = require('node-fetch');

async function forceRevalidate() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  
  console.log('🔄 Forcing article revalidation...');
  
  try {
    // Revalider toutes les pages importantes
    const pagesToRevalidate = [
      '/blog',
      '/',
      '/test-article-cache'
    ];
    
    for (const page of pagesToRevalidate) {
      console.log(`\n🔄 Revalidating ${page}...`);
      const response = await fetch(`${baseUrl}/api/revalidate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({})
      });
      
      if (response.ok) {
        const result = await response.json();
        console.log(`✅ ${page} revalidated:`, result.message);
      } else {
        console.log(`❌ Failed to revalidate ${page}:`, response.status);
      }
    }
    
    // Revalider un article spécifique si fourni en argument
    const testSlug = process.argv[2];
    if (testSlug) {
      console.log(`\n🔄 Revalidating specific article: /${testSlug}...`);
      const response = await fetch(`${baseUrl}/api/revalidate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug: testSlug })
      });
      
      if (response.ok) {
        const result = await response.json();
        console.log(`✅ /${testSlug} revalidated:`, result.message);
      } else {
        console.log(`❌ Failed to revalidate /${testSlug}:`, response.status);
      }
    }
    
    console.log('\n✅ Revalidation complete!');
    console.log('💡 You can now check your pages to see the updated content.');
    
  } catch (error) {
    console.error('❌ Error during revalidation:', error);
  }
}

// Usage: node scripts/force-revalidate.js [article-slug]
forceRevalidate();
