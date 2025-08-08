// Types pour la configuration

export interface AppConfig {
  name: string
  version: string
  description: string
  url: string
  environment: 'development' | 'staging' | 'production'
  debug: boolean
}

export interface DatabaseConfig {
  url: string
  host: string
  port: number
  database: string
  username: string
  password: string
  ssl: boolean
  pool: {
    min: number
    max: number
  }
}

export interface AuthConfig {
  secret: string
  expiresIn: string
  refreshExpiresIn: string
  saltRounds: number
}

export interface EmailConfig {
  host: string
  port: number
  secure: boolean
  auth: {
    user: string
    pass: string
  }
  from: string
  replyTo?: string
}

export interface StorageConfig {
  provider: 'local' | 's3' | 'gcs' | 'azure'
  bucket?: string
  region?: string
  accessKey?: string
  secretKey?: string
  endpoint?: string
  publicUrl?: string
}

export interface CacheConfig {
  provider: 'memory' | 'redis' | 'memcached'
  host?: string
  port?: number
  password?: string
  database?: number
  ttl: number
  maxSize: number
}

export interface LogConfig {
  level: 'error' | 'warn' | 'info' | 'debug'
  format: 'json' | 'simple'
  transports: string[]
  filename?: string
  maxSize?: string
  maxFiles?: number
}

export interface SecurityConfig {
  cors: {
    origin: string | string[]
    credentials: boolean
    methods: string[]
    allowedHeaders: string[]
  }
  rateLimit: {
    windowMs: number
    max: number
    message: string
  }
  helmet: {
    contentSecurityPolicy: boolean
    crossOriginEmbedderPolicy: boolean
    crossOriginOpenerPolicy: boolean
    crossOriginResourcePolicy: boolean
    dnsPrefetchControl: boolean
    frameguard: boolean
    hidePoweredBy: boolean
    hsts: boolean
    ieNoOpen: boolean
    noSniff: boolean
    permittedCrossDomainPolicies: boolean
    referrerPolicy: boolean
    xssFilter: boolean
  }
}

export interface AnalyticsConfig {
  provider: 'google' | 'plausible' | 'mixpanel' | 'amplitude'
  trackingId?: string
  domain?: string
  enabled: boolean
}

export interface PaymentConfig {
  provider: 'stripe' | 'paypal' | 'square'
  secretKey: string
  publishableKey: string
  webhookSecret?: string
  currency: string
  supportedCurrencies: string[]
}

export interface NotificationConfig {
  email: boolean
  push: boolean
  sms: boolean
  webhook?: string
}

export interface FeatureConfig {
  [key: string]: boolean | string | number
}

export interface EnvironmentConfig {
  NODE_ENV: string
  PORT: number
  HOST: string
  BASE_URL: string
  API_URL: string
  CLIENT_URL: string
  DATABASE_URL: string
  REDIS_URL?: string
  JWT_SECRET: string
  COOKIE_SECRET: string
  SMTP_HOST: string
  SMTP_PORT: number
  SMTP_USER: string
  SMTP_PASS: string
  AWS_ACCESS_KEY_ID?: string
  AWS_SECRET_ACCESS_KEY?: string
  AWS_REGION?: string
  AWS_S3_BUCKET?: string
  STRIPE_SECRET_KEY?: string
  STRIPE_PUBLISHABLE_KEY?: string
  STRIPE_WEBHOOK_SECRET?: string
  GOOGLE_ANALYTICS_ID?: string
  SENTRY_DSN?: string
  LOG_LEVEL: string
  DEBUG: boolean
}

export interface Config {
  app: AppConfig
  database: DatabaseConfig
  auth: AuthConfig
  email: EmailConfig
  storage: StorageConfig
  cache: CacheConfig
  log: LogConfig
  security: SecurityConfig
  analytics: AnalyticsConfig
  payment: PaymentConfig
  notification: NotificationConfig
  features: FeatureConfig
  env: EnvironmentConfig
} 
