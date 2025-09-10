// Types pour les erreurs

export interface BaseError {
  name: string
  message: string
  code?: string
  status?: number
  details?: any
  stack?: string
  cause?: Error
}

export interface ValidationError extends BaseError {
  name: 'ValidationError'
  field: string
  value: any
  rule: string
}

export interface AuthenticationError extends BaseError {
  name: 'AuthenticationError'
  code: 'INVALID_CREDENTIALS' | 'TOKEN_EXPIRED' | 'TOKEN_INVALID' | 'USER_NOT_FOUND' | 'ACCOUNT_DISABLED'
}

export interface AuthorizationError extends BaseError {
  name: 'AuthorizationError'
  code: 'INSUFFICIENT_PERMISSIONS' | 'ROLE_REQUIRED' | 'RESOURCE_ACCESS_DENIED'
}

export interface NotFoundError extends BaseError {
  name: 'NotFoundError'
  resource: string
  identifier: string | number
}

export interface ConflictError extends BaseError {
  name: 'ConflictError'
  resource: string
  field: string
  value: any
}

export interface RateLimitError extends BaseError {
  name: 'RateLimitError'
  retryAfter: number
  limit: number
  remaining: number
  reset: number
}

export interface NetworkError extends BaseError {
  name: 'NetworkError'
  url: string
  method: string
  status: number
  response?: any
}

export interface DatabaseError extends BaseError {
  name: 'DatabaseError'
  operation: string
  table?: string
  constraint?: string
  detail?: string
}

export interface FileError extends BaseError {
  name: 'FileError'
  operation: 'read' | 'write' | 'delete' | 'upload' | 'download'
  path: string
  size?: number
  mimeType?: string
}

export interface PaymentError extends BaseError {
  name: 'PaymentError'
  provider: string
  transactionId?: string
  amount?: number
  currency?: string
}

export interface EmailError extends BaseError {
  name: 'EmailError'
  to: string
  subject: string
  template?: string
}

export interface CacheError extends BaseError {
  name: 'CacheError'
  operation: 'get' | 'set' | 'delete' | 'clear'
  key?: string
}

export interface ConfigError extends BaseError {
  name: 'ConfigError'
  key: string
  value?: any
  required?: boolean
}

export interface ServiceError extends BaseError {
  name: 'ServiceError'
  service: string
  method: string
  params?: any
}

export interface LogError extends BaseError {
  name: 'LogError'
  level: 'error' | 'warn' | 'info' | 'debug'
  context?: Record<string, any>
}

export interface SecurityError extends BaseError {
  name: 'SecurityError'
  type: 'xss' | 'csrf' | 'sql-injection' | 'path-traversal' | 'rate-limit'
  ip?: string
  userAgent?: string
  path?: string
}

export interface AnalyticsError extends BaseError {
  name: 'AnalyticsError'
  event: string
  properties?: Record<string, any>
}

export interface NotificationError extends BaseError {
  name: 'NotificationError'
  type: 'email' | 'push' | 'sms' | 'webhook'
  recipient: string
  template?: string
}

export interface ValidationErrorDetails {
  field: string
  message: string
  value?: any
  rule?: string
}

export interface ErrorResponse {
  error: {
    name: string
    message: string
    code?: string
    status: number
    details?: any
    timestamp: string
    path: string
    method: string
    userAgent?: string
    ip?: string
  }
  requestId?: string
  help?: string
  documentation?: string
}

export interface ErrorLog {
  id: string
  timestamp: string
  level: 'error' | 'warn' | 'info' | 'debug'
  name: string
  message: string
  code?: string
  status?: number
  details?: any
  stack?: string
  context?: Record<string, any>
  user?: {
    id: string
    email: string
    role: string
  }
  request?: {
    method: string
    url: string
    userAgent: string
    ip: string
    headers: Record<string, string>
  }
  environment: string
  version: string
}

export interface ErrorHandler {
  handle: (error: Error, context?: any) => void
  report: (error: Error, context?: any) => Promise<void>
  format: (error: Error) => ErrorResponse
  isOperational: (error: Error) => boolean
  shouldReport: (error: Error) => boolean
}

export interface ErrorMiddleware {
  (error: Error, req: any, res: any, next: any): void
}

export interface ErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ComponentType<{ error: Error; resetError: () => void }>
  onError?: (error: Error, errorInfo: any) => void
}

export interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
} 

