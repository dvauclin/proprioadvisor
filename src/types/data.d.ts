// Types pour les données

export interface Ville {
  id: string
  nom: string
  slug: string
  departementNumero?: string
  region?: string
  population?: number
  superficie?: number
  latitude?: number
  longitude?: number
  conciergerie_count?: number
}

export interface Conciergerie {
  id: string
  nom: string
  slug: string
  description?: string
  siteWeb?: string
  telephone?: string
  email?: string
  adresse?: string
  ville?: Ville
  score?: number
  validated?: boolean
  logo?: string
  images?: string[]
  services?: string[]
  tarifs?: {
    commission?: number
    frais?: number
    minimum?: number
  }
  subscriptions?: any[]
}

export interface Formule {
  id: string
  nom: string
  description?: string
  prix: number
  commission?: number
  services?: string[]
  conciergerieId: string
  conciergerie?: Conciergerie
}

export interface Article {
  id: string
  titre: string
  slug: string
  contenu: string
  excerpt?: string
  image?: string
  date_creation: string
  date_modification?: string
  auteur?: string
  tags?: string[]
  categorie?: string
  statut?: 'draft' | 'published'
}

export interface Avis {
  id: string
  note: number
  commentaire?: string
  auteur?: string
  date_creation: string
  valide: boolean
  conciergerieId: string
  conciergerie?: Conciergerie
}

export interface User {
  id: string
  email: string
  nom?: string
  prenom?: string
  role?: 'user' | 'admin' | 'conciergerie'
  telephone?: string
  adresse?: string
  date_creation: string
  date_modification?: string
}

export interface Subscription {
  id: string
  status: 'active' | 'canceled' | 'past_due' | 'unpaid'
  current_period_start: string
  current_period_end: string
  conciergerieId: string
  conciergerie?: Conciergerie
} 
