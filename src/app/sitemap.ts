import { MetadataRoute } from 'next'
import { supabase } from '@/integrations/supabase/client'

const BASE_URL = (
  (process.env.NEXT_PUBLIC_SITE_URL || '').replace(/\/$/, '') ||
  (process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://proprioadvisor.fr')
)

const formatW3CDate = (date: Date | string | undefined): string => {
  if (!date) return new Date().toISOString().split('T')[0]
  if (typeof date === 'string') date = new Date(date)
  if (isNaN(date.getTime())) return new Date().toISOString().split('T')[0]
  return date.toISOString().split('T')[0]
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = formatW3CDate(new Date())
  
  // Pages statiques
  const staticPages = [
    { url: BASE_URL, priority: 1, changefreq: 'daily' },
    { url: `${BASE_URL}/contact`, priority: 0.7, changefreq: 'monthly' },
    { url: `${BASE_URL}/inscription`, priority: 0.7, changefreq: 'monthly' },
    { url: `${BASE_URL}/connexion`, priority: 0.7, changefreq: 'monthly' },
    { url: `${BASE_URL}/blog`, priority: 0.9, changefreq: 'weekly' },
    { url: `${BASE_URL}/annuaire`, priority: 0.9, changefreq: 'weekly' },
    { url: `${BASE_URL}/a-propos`, priority: 0.8, changefreq: 'monthly' },
    { url: `${BASE_URL}/prendre-rdv`, priority: 0.8, changefreq: 'monthly' },
    { url: `${BASE_URL}/subscription`, priority: 0.8, changefreq: 'monthly' },
    { url: `${BASE_URL}/favoris`, priority: 0.8, changefreq: 'monthly' },
    { url: `${BASE_URL}/simulateur-airbnb`, priority: 0.8, changefreq: 'monthly' },
    { url: `${BASE_URL}/mentions-legales`, priority: 0.3, changefreq: 'yearly' },
    { url: `${BASE_URL}/politique-confidentialite`, priority: 0.3, changefreq: 'yearly' },
    { url: `${BASE_URL}/conditions-utilisation`, priority: 0.3, changefreq: 'yearly' },
    { url: `${BASE_URL}/trouver-des-clients-conciergerie-airbnb`, priority: 0.8, changefreq: 'monthly' },
    { url: `${BASE_URL}/tarif-conciergerie-airbnb`, priority: 0.8, changefreq: 'monthly' },
    { url: `${BASE_URL}/choisir-conciergerie-airbnb`, priority: 0.8, changefreq: 'monthly' },
    { url: `${BASE_URL}/avis-conciergerie-airbnb`, priority: 0.8, changefreq: 'monthly' },
    { url: `${BASE_URL}/gestion-airbnb`, priority: 0.8, changefreq: 'monthly' },
  ]

  // Articles dynamiques
  let articles: Array<{ url: string, lastModified: string, changefreq: string, priority: number }> = []
  try {
    const { data } = await supabase
      .from('articles')
      .select('slug, date_modification')
      .order('date_modification', { ascending: false })
    
    if (data) {
      articles = data.map(article => ({
        url: `${BASE_URL}/${article.slug}`,
        lastModified: formatW3CDate(article.date_modification || undefined),
        changefreq: 'monthly' as const,
        priority: 0.7
      }))
    }
  } catch (error) {
    console.error('Error fetching articles:', error)
  }

  // Villes
  let villes: Array<{ url: string, lastModified: string, changefreq: string, priority: number }> = []
  try {
    const { data } = await supabase
      .from('villes')
      .select('slug, created_at')
      .order('created_at', { ascending: false })
    
    if (data) {
      villes = data.map(ville => ({
        url: `${BASE_URL}/conciergerie/${ville.slug}`,
        lastModified: formatW3CDate(ville.created_at || undefined),
        changefreq: 'weekly' as const,
        priority: 0.8
      }))
    }
  } catch (error) {
    console.error('Error fetching villes:', error)
  }

  // Conciergeries
  let conciergeries: Array<{ url: string, lastModified: string, changefreq: string, priority: number }> = []
  try {
    const { data } = await supabase
      .from('conciergeries')
      .select('nom, created_at')
      .eq('valide', true)
      .order('created_at', { ascending: false })
    
    if (data) {
      conciergeries = data.map(conciergerie => ({
        url: `${BASE_URL}/conciergerie-details/${conciergerie.nom?.toLowerCase().replace(/\s+/g, '-')}`,
        lastModified: formatW3CDate(conciergerie.created_at || undefined),
        changefreq: 'weekly' as const,
        priority: 0.7
      }))
    }
  } catch (error) {
    console.error('Error fetching conciergeries:', error)
  }

  // Combiner tout
  const allPages = [
    ...staticPages.map(page => ({
      url: page.url,
      lastModified: now,
      changefreq: page.changefreq as 'daily' | 'weekly' | 'monthly' | 'yearly',
      priority: page.priority
    })),
    ...articles,
    ...villes,
    ...conciergeries
  ]

  return allPages
}

