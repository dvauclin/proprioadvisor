// Types pour les utilitaires

export interface DebounceOptions {
  leading?: boolean
  trailing?: boolean
  maxWait?: number
}

export interface ThrottleOptions {
  leading?: boolean
  trailing?: boolean
}

export interface RetryOptions {
  maxAttempts?: number
  delay?: number
  backoff?: 'linear' | 'exponential'
}

export interface CacheOptions {
  ttl?: number
  maxSize?: number
  serialize?: boolean
}

export interface ValidationRule {
  required?: boolean
  minLength?: number
  maxLength?: number
  pattern?: RegExp
  custom?: (value: any) => boolean | string
}

export interface ValidationSchema {
  [key: string]: ValidationRule | ValidationSchema
}

export interface ValidationResult {
  isValid: boolean
  errors: Record<string, string>
}

export interface SortOption {
  field: string
  direction: 'asc' | 'desc'
}

export interface FilterOption {
  field: string
  operator: 'eq' | 'ne' | 'gt' | 'gte' | 'lt' | 'lte' | 'in' | 'nin' | 'like' | 'ilike'
  value: any
}

export interface PaginationOptions {
  page: number
  limit: number
  total?: number
}

export interface SearchOptions {
  query?: string
  filters?: FilterOption[]
  sort?: SortOption[]
  pagination?: PaginationOptions
}

export interface ApiConfig {
  baseURL: string
  timeout?: number
  headers?: Record<string, string>
  withCredentials?: boolean
}

export interface ApiRequestConfig extends ApiConfig {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
  url: string
  data?: any
  params?: Record<string, any>
}

export interface ApiResponseConfig {
  status: number
  statusText: string
  headers: Record<string, string>
  data: any
}

export interface ApiErrorConfig {
  message: string
  code?: string
  status?: number
  details?: any
} 

