import { getAllArticles, getRecentArticles } from '@/services/supabaseService'

// Revalidation toutes les 30 secondes pour le test
export const revalidate = 30;

export default async function TestArticlesPage() {
  const allArticles = await getAllArticles()
  const recentArticles = await getRecentArticles(3)

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Test Articles - Supabase</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-semibold mb-4">Tous les articles ({allArticles.length})</h2>
          <div className="space-y-4">
            {allArticles.map(article => (
              <div key={article.id} className="border p-4 rounded">
                <h3 className="font-semibold">{article.titre}</h3>
                <p className="text-sm text-gray-600">Slug: {article.slug}</p>
                <p className="text-sm text-gray-600">Date modif: {(article as any).date_modification}</p>
                <p className="text-sm text-gray-600">Excerpt: {article.excerpt?.substring(0, 100)}...</p>
                <p className="text-sm text-gray-600">Contenu: {article.contenu?.substring(0, 100)}...</p>
                {(article as any).resume && (
                  <p className="text-sm text-gray-600">Résumé: {(article as any).resume.substring(0, 100)}...</p>
                )}
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Articles récents ({recentArticles.length})</h2>
          <div className="space-y-4">
            {recentArticles.map(article => (
              <div key={article.id} className="border p-4 rounded">
                <h3 className="font-semibold">{article.titre}</h3>
                <p className="text-sm text-gray-600">Slug: {article.slug}</p>
                <p className="text-sm text-gray-600">Date modif: {(article as any).date_modification}</p>
                <p className="text-sm text-gray-600">Excerpt: {article.excerpt?.substring(0, 100)}...</p>
                <p className="text-sm text-gray-600">Contenu: {article.contenu?.substring(0, 100)}...</p>
                {(article as any).resume && (
                  <p className="text-sm text-gray-600">Résumé: {(article as any).resume.substring(0, 100)}...</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-8 p-4 bg-gray-100 rounded">
        <h3 className="font-semibold mb-2">Informations de debug:</h3>
        <p>Timestamp: {new Date().toISOString()}</p>
        <p>Nombre total d'articles: {allArticles.length}</p>
        <p>Nombre d'articles récents: {recentArticles.length}</p>
      </div>
    </div>
  )
}
