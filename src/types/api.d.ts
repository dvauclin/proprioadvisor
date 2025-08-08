// Types pour les API

export interface ApiResponse<T = any> {
  data?: T
  error?: string
  message?: string
  status: number
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface SearchParams {
  q?: string
  page?: number
  limit?: number
  sort?: string
  order?: 'asc' | 'desc'
  filters?: Record<string, any>
}

export interface ApiError {
  message: string
  code?: string
  details?: any
  status: number
}

export interface ApiSuccess<T = any> {
  data: T
  message?: string
  status: number
}

// Types pour les endpoints spécifiques
export interface ConciergerieSearchParams extends SearchParams {
  ville?: string
  services?: string[]
  prixMin?: number
  prixMax?: number
  noteMin?: number
  validated?: boolean
}

export interface ArticleSearchParams extends SearchParams {
  categorie?: string
  tags?: string[]
  auteur?: string
  statut?: 'draft' | 'published'
}

export interface UserSearchParams extends SearchParams {
  role?: string
  email?: string
  date_creation?: string
}

// Types pour les réponses d'API
export interface ConciergerieSearchResponse extends PaginatedResponse<Conciergerie> {
  filters: {
    villes: Ville[]
    services: string[]
    prixRange: [number, number]
  }
}

export interface ArticleSearchResponse extends PaginatedResponse<Article> {
  categories: string[]
  tags: string[]
}

export interface UserSearchResponse extends PaginatedResponse<User> {
  roles: string[]
} 

