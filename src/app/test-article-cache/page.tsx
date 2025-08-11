import { getArticleBySlug, getAllArticles } from '@/services/supabaseService';

export default async function TestArticleCachePage() {
  // Récupérer tous les articles pour voir les données
  const allArticles = await getAllArticles();
  
  // Récupérer le premier article pour test
  const testArticle = allArticles.length > 0 ? await getArticleBySlug(allArticles[0].slug) : null;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Test Cache Articles</h1>
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Tous les articles (premiers 3)</h2>
        <div className="space-y-4">
          {allArticles.slice(0, 3).map(article => (
            <div key={article.id} className="border p-4 rounded">
              <h3 className="font-semibold">{article.titre}</h3>
              <p className="text-sm text-gray-600">Slug: {article.slug}</p>
              <p className="text-sm text-gray-600">Date modification: {article.date_modification}</p>
              <p className="text-sm text-gray-600">Excerpt: {article.excerpt}</p>
            </div>
          ))}
        </div>
      </div>

      {testArticle && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Article de test (premier article)</h2>
          <div className="border p-4 rounded">
            <h3 className="font-semibold">{testArticle.titre}</h3>
            <p className="text-sm text-gray-600">Slug: {testArticle.slug}</p>
            <p className="text-sm text-gray-600">Date modification: {testArticle.date_modification}</p>
            <p className="text-sm text-gray-600">Excerpt: {testArticle.excerpt}</p>
            <div className="mt-2">
              <p className="text-sm text-gray-600">Contenu (premiers 200 caractères):</p>
              <p className="text-xs bg-gray-100 p-2 rounded">
                {testArticle.contenu?.substring(0, 200)}...
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="text-sm text-gray-500">
        <p>Timestamp: {new Date().toISOString()}</p>
        <p>Cette page force la revalidation à chaque chargement</p>
      </div>
    </div>
  );
}

// Force revalidation
export const revalidate = 0;
