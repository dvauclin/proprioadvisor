// Types pour les services

export interface AuthService {
  signIn: (email: string, password: string) => Promise<{ user: User; error?: any }>
  signUp: (email: string, password: string, userData?: Partial<User>) => Promise<{ user: User; error?: any }>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<{ error?: any }>
  updateProfile: (data: Partial<User>) => Promise<{ user: User; error?: any }>
  getCurrentUser: () => Promise<User | null>
}

export interface ConciergerieService {
  getAll: (params?: ConciergerieSearchParams) => Promise<ConciergerieSearchResponse>
  getById: (id: string) => Promise<Conciergerie | null>
  getBySlug: (slug: string) => Promise<Conciergerie | null>
  getByVille: (villeSlug: string, params?: ConciergerieSearchParams) => Promise<ConciergerieSearchResponse>
  create: (data: ConciergerieFormData) => Promise<{ conciergerie: Conciergerie; error?: any }>
  update: (id: string, data: Partial<ConciergerieFormData>) => Promise<{ conciergerie: Conciergerie; error?: any }>
  delete: (id: string) => Promise<{ error?: any }>
  validate: (id: string) => Promise<{ error?: any }>
  unvalidate: (id: string) => Promise<{ error?: any }>
}

export interface VilleService {
  getAll: (params?: SearchParams) => Promise<PaginatedResponse<Ville>>
  getById: (id: string) => Promise<Ville | null>
  getBySlug: (slug: string) => Promise<Ville | null>
  search: (query: string) => Promise<Ville[]>
  getPopular: (limit?: number) => Promise<Ville[]>
}

export interface ArticleService {
  getAll: (params?: ArticleSearchParams) => Promise<ArticleSearchResponse>
  getById: (id: string) => Promise<Article | null>
  getBySlug: (slug: string) => Promise<Article | null>
  create: (data: Partial<Article>) => Promise<{ article: Article; error?: any }>
  update: (id: string, data: Partial<Article>) => Promise<{ article: Article; error?: any }>
  delete: (id: string) => Promise<{ error?: any }>
  publish: (id: string) => Promise<{ error?: any }>
  unpublish: (id: string) => Promise<{ error?: any }>
  getRecent: (limit?: number, excludeSlug?: string) => Promise<Article[]>
}

export interface AvisService {
  getAll: (params?: SearchParams) => Promise<PaginatedResponse<Avis>>
  getByConciergerie: (conciergerieId: string, params?: SearchParams) => Promise<PaginatedResponse<Avis>>
  getById: (id: string) => Promise<Avis | null>
  create: (data: Partial<Avis>) => Promise<{ avis: Avis; error?: any }>
  update: (id: string, data: Partial<Avis>) => Promise<{ avis: Avis; error?: any }>
  delete: (id: string) => Promise<{ error?: any }>
  validate: (id: string) => Promise<{ error?: any }>
  unvalidate: (id: string) => Promise<{ error?: any }>
  getAverageRating: (conciergerieId: string) => Promise<{ average: number; count: number }>
}

export interface UserService {
  getAll: (params?: UserSearchParams) => Promise<UserSearchResponse>
  getById: (id: string) => Promise<User | null>
  getByEmail: (email: string) => Promise<User | null>
  create: (data: Partial<User>) => Promise<{ user: User; error?: any }>
  update: (id: string, data: Partial<User>) => Promise<{ user: User; error?: any }>
  delete: (id: string) => Promise<{ error?: any }>
  updateRole: (id: string, role: string) => Promise<{ error?: any }>
}

export interface SubscriptionService {
  getAll: (params?: SearchParams) => Promise<PaginatedResponse<Subscription>>
  getById: (id: string) => Promise<Subscription | null>
  getByConciergerie: (conciergerieId: string) => Promise<Subscription | null>
  create: (data: Partial<Subscription>) => Promise<{ subscription: Subscription; error?: any }>
  update: (id: string, data: Partial<Subscription>) => Promise<{ subscription: Subscription; error?: any }>
  cancel: (id: string) => Promise<{ error?: any }>
  reactivate: (id: string) => Promise<{ error?: any }>
}

export interface FormuleService {
  getAll: (params?: SearchParams) => Promise<PaginatedResponse<Formule>>
  getByConciergerie: (conciergerieId: string, params?: SearchParams) => Promise<PaginatedResponse<Formule>>
  getById: (id: string) => Promise<Formule | null>
  create: (data: Partial<Formule>) => Promise<{ formule: Formule; error?: any }>
  update: (id: string, data: Partial<Formule>) => Promise<{ formule: Formule; error?: any }>
  delete: (id: string) => Promise<{ error?: any }>
}

export interface ContactService {
  sendMessage: (data: ContactFormData) => Promise<{ error?: any }>
  sendDevis: (data: DevisFormData) => Promise<{ error?: any }>
}

export interface AnalyticsService {
  trackPageView: (url: string, title?: string) => void
  trackEvent: (eventName: string, parameters?: Record<string, any>) => void
  trackConversion: (conversionId: string, value?: number) => void
  setUserProperties: (properties: Record<string, any>) => void
  setUserId: (userId: string) => void
}

export interface StorageService {
  get: <T>(key: string, defaultValue?: T) => T | null
  set: <T>(key: string, value: T) => void
  remove: (key: string) => void
  clear: () => void
  has: (key: string) => boolean
}

export interface CacheService {
  get: <T>(key: string) => T | null
  set: <T>(key: string, value: T, ttl?: number) => void
  remove: (key: string) => void
  clear: () => void
  has: (key: string) => boolean
  keys: () => string[]
}

export interface ValidationService {
  validate: (data: any, schema: ValidationSchema) => ValidationResult
  validateField: (value: any, rule: ValidationRule) => string | null
  isEmail: (value: string) => boolean
  isPhone: (value: string) => boolean
  isUrl: (value: string) => boolean
  isRequired: (value: any) => boolean
} 

