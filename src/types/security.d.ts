// Types pour la sécurité

export interface SecurityConfig {
  cors: CorsConfig
  helmet: HelmetConfig
  rateLimit: RateLimitConfig
  csrf: CsrfConfig
  xss: XssConfig
  sqlInjection: SqlInjectionConfig
  authentication: AuthenticationConfig
  authorization: AuthorizationConfig
  encryption: EncryptionConfig
  audit: AuditConfig
}

export interface CorsConfig {
  origin: string | string[] | boolean
  methods: string[]
  allowedHeaders: string[]
  exposedHeaders: string[]
  credentials: boolean
  maxAge: number
  preflightContinue: boolean
  optionsSuccessStatus: number
}

export interface HelmetConfig {
  contentSecurityPolicy: boolean | ContentSecurityPolicyConfig
  crossOriginEmbedderPolicy: boolean
  crossOriginOpenerPolicy: boolean | CrossOriginOpenerPolicyConfig
  crossOriginResourcePolicy: boolean | CrossOriginResourcePolicyConfig
  dnsPrefetchControl: boolean | DnsPrefetchControlConfig
  frameguard: boolean | FrameguardConfig
  hidePoweredBy: boolean
  hsts: boolean | HstsConfig
  ieNoOpen: boolean
  noSniff: boolean
  permittedCrossDomainPolicies: boolean | PermittedCrossDomainPoliciesConfig
  referrerPolicy: boolean | ReferrerPolicyConfig
  xssFilter: boolean
}

export interface ContentSecurityPolicyConfig {
  directives: Record<string, string[]>
  reportOnly: boolean
  reportUri?: string
}

export interface CrossOriginOpenerPolicyConfig {
  policy: 'same-origin' | 'same-origin-allow-popups' | 'unsafe-none'
}

export interface CrossOriginResourcePolicyConfig {
  policy: 'same-site' | 'same-origin' | 'cross-origin'
}

export interface DnsPrefetchControlConfig {
  allow: boolean
}

export interface FrameguardConfig {
  action: 'DENY' | 'SAMEORIGIN' | 'ALLOW-FROM'
  domain?: string
}

export interface HstsConfig {
  maxAge: number
  includeSubDomains: boolean
  preload: boolean
}

export interface PermittedCrossDomainPoliciesConfig {
  permittedPolicies: 'none' | 'master-only' | 'by-content-type' | 'by-ftp-filename' | 'all'
}

export interface ReferrerPolicyConfig {
  policy: 'no-referrer' | 'no-referrer-when-downgrade' | 'origin' | 'origin-when-cross-origin' | 'same-origin' | 'strict-origin' | 'strict-origin-when-cross-origin' | 'unsafe-url'
}

export interface RateLimitConfig {
  windowMs: number
  max: number
  message: string
  statusCode: number
  headers: boolean
  skipSuccessfulRequests: boolean
  skipFailedRequests: boolean
  keyGenerator: (req: any) => string
  handler: (req: any, res: any) => void
  onLimitReached: (req: any, res: any) => void
}

export interface CsrfConfig {
  enabled: boolean
  secret: string
  tokenLength: number
  ignoreMethods: string[]
  ignorePaths: string[]
  cookie: {
    httpOnly: boolean
    secure: boolean
    sameSite: 'strict' | 'lax' | 'none'
    maxAge: number
  }
}

export interface XssConfig {
  enabled: boolean
  mode: 'sanitize' | 'escape' | 'block'
  whiteList: Record<string, any>
  stripIgnoreTag: boolean
  stripIgnoreTagBody: string[]
}

export interface SqlInjectionConfig {
  enabled: boolean
  patterns: RegExp[]
  action: 'block' | 'log' | 'sanitize'
}

export interface AuthenticationConfig {
  strategy: 'jwt' | 'session' | 'oauth' | 'api-key'
  jwt: {
    secret: string
    expiresIn: string
    refreshExpiresIn: string
    issuer: string
    audience: string
  }
  session: {
    secret: string
    name: string
    resave: boolean
    saveUninitialized: boolean
    cookie: {
      secure: boolean
      httpOnly: boolean
      maxAge: number
      sameSite: 'strict' | 'lax' | 'none'
    }
  }
  oauth: {
    providers: OAuthProvider[]
  }
  apiKey: {
    header: string
    queryParam: string
  }
}

export interface OAuthProvider {
  name: string
  clientId: string
  clientSecret: string
  authorizationURL: string
  tokenURL: string
  userInfoURL: string
  scope: string[]
}

export interface AuthorizationConfig {
  enabled: boolean
  defaultRole: string
  roles: Role[]
  permissions: Permission[]
  policies: Policy[]
}

export interface Role {
  name: string
  description: string
  permissions: string[]
  inherits?: string[]
}

export interface Permission {
  name: string
  description: string
  resource: string
  action: string
  conditions?: Record<string, any>
}

export interface Policy {
  name: string
  description: string
  effect: 'allow' | 'deny'
  principal: string[]
  action: string[]
  resource: string[]
  condition?: Record<string, any>
}

export interface EncryptionConfig {
  algorithm: string
  key: string
  iv?: string
  saltRounds: number
}

export interface AuditConfig {
  enabled: boolean
  events: AuditEvent[]
  storage: 'database' | 'file' | 'external'
  retention: number
}

export interface AuditEvent {
  name: string
  description: string
  category: 'authentication' | 'authorization' | 'data' | 'system' | 'security'
  severity: 'low' | 'medium' | 'high' | 'critical'
  enabled: boolean
}

export interface SecurityEvent {
  id: string
  timestamp: number
  type: SecurityEventType
  severity: 'low' | 'medium' | 'high' | 'critical'
  source: string
  target?: string
  details: Record<string, any>
  user?: {
    id: string
    email: string
    role: string
  }
  ip?: string
  userAgent?: string
  location?: {
    country: string
    city: string
    coordinates: [number, number]
  }
}

export type SecurityEventType = 
  | 'authentication.success'
  | 'authentication.failure'
  | 'authentication.logout'
  | 'authorization.grant'
  | 'authorization.deny'
  | 'data.access'
  | 'data.modify'
  | 'data.delete'
  | 'security.violation'
  | 'security.attack'
  | 'system.error'
  | 'system.warning'
  | 'user.activity'
  | 'admin.action'

export interface SecurityMiddleware {
  (req: any, res: any, next: any): void
}

export interface SecurityService {
  authenticate: (credentials: any) => Promise<AuthenticationResult>
  authorize: (user: any, resource: string, action: string) => Promise<AuthorizationResult>
  audit: (event: SecurityEvent) => Promise<void>
  encrypt: (data: string) => string
  decrypt: (data: string) => string
  hash: (data: string) => Promise<string>
  verify: (data: string, hash: string) => Promise<boolean>
  generateToken: (payload: any) => string
  verifyToken: (token: string) => any
  sanitize: (data: any) => any
  validate: (data: any, schema: any) => ValidationResult
}

export interface AuthenticationResult {
  success: boolean
  user?: any
  token?: string
  error?: string
  code?: string
}

export interface AuthorizationResult {
  allowed: boolean
  reason?: string
  conditions?: Record<string, any>
}

export interface SecurityHeaders {
  'X-Frame-Options': string
  'X-Content-Type-Options': string
  'X-XSS-Protection': string
  'Referrer-Policy': string
  'Content-Security-Policy': string
  'Strict-Transport-Security': string
  'Permissions-Policy': string
  'X-Permitted-Cross-Domain-Policies': string
  'X-Download-Options': string
  'X-DNS-Prefetch-Control': string
}

export interface SecurityValidator {
  validateInput: (input: any, rules: ValidationRule[]) => ValidationResult
  sanitizeInput: (input: any) => any
  validateUrl: (url: string) => boolean
  validateEmail: (email: string) => boolean
  validatePhone: (phone: string) => boolean
  validatePassword: (password: string) => PasswordValidationResult
}

export interface PasswordValidationResult {
  valid: boolean
  score: number
  feedback: string[]
  suggestions: string[]
}

export interface SecurityMonitor {
  trackEvent: (event: SecurityEvent) => void
  getEvents: (filters?: Record<string, any>) => SecurityEvent[]
  getStats: () => SecurityStats
  alert: (event: SecurityEvent) => void
}

export interface SecurityStats {
  totalEvents: number
  eventsByType: Record<string, number>
  eventsBySeverity: Record<string, number>
  eventsBySource: Record<string, number>
  recentEvents: SecurityEvent[]
  topThreats: string[]
  riskScore: number
} 

