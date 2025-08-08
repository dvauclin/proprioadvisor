// Types pour le monitoring

export interface Metric {
  name: string
  value: number
  unit?: string
  tags?: Record<string, string>
  timestamp: number
}

export interface PerformanceMetric extends Metric {
  type: 'navigation' | 'resource' | 'paint' | 'mark' | 'measure'
  entryType: string
  startTime: number
  duration: number
  detail?: any
}

export interface ErrorMetric extends Metric {
  type: 'error'
  error: {
    name: string
    message: string
    stack?: string
    code?: string
  }
  context?: Record<string, any>
}

export interface UserMetric extends Metric {
  type: 'user'
  userId: string
  sessionId: string
  page: string
  action: string
  properties?: Record<string, any>
}

export interface BusinessMetric extends Metric {
  type: 'business'
  event: string
  category: string
  label?: string
  value?: number
  properties?: Record<string, any>
}

export interface HealthCheck {
  name: string
  status: 'healthy' | 'unhealthy' | 'degraded'
  responseTime: number
  lastCheck: number
  error?: string
  details?: Record<string, any>
}

export interface SystemMetrics {
  cpu: {
    usage: number
    load: number[]
  }
  memory: {
    used: number
    total: number
    free: number
  }
  disk: {
    used: number
    total: number
    free: number
  }
  network: {
    bytesIn: number
    bytesOut: number
    connections: number
  }
  uptime: number
  timestamp: number
}

export interface ApplicationMetrics {
  requests: {
    total: number
    successful: number
    failed: number
    rate: number
  }
  responseTime: {
    average: number
    median: number
    p95: number
    p99: number
  }
  errors: {
    total: number
    rate: number
    byType: Record<string, number>
  }
  users: {
    active: number
    total: number
    new: number
  }
  timestamp: number
}

export interface DatabaseMetrics {
  connections: {
    active: number
    idle: number
    total: number
  }
  queries: {
    total: number
    slow: number
    errors: number
    averageTime: number
  }
  locks: {
    waiting: number
    active: number
  }
  timestamp: number
}

export interface CacheMetrics {
  hits: number
  misses: number
  hitRate: number
  size: number
  maxSize: number
  evictions: number
  timestamp: number
}

export interface Alert {
  id: string
  name: string
  description: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  status: 'active' | 'resolved' | 'acknowledged'
  condition: {
    metric: string
    operator: 'gt' | 'lt' | 'eq' | 'gte' | 'lte'
    threshold: number
    duration: number
  }
  triggers: AlertTrigger[]
  createdAt: number
  updatedAt: number
  resolvedAt?: number
}

export interface AlertTrigger {
  id: string
  alertId: string
  timestamp: number
  value: number
  threshold: number
  message: string
  acknowledged: boolean
  acknowledgedBy?: string
  acknowledgedAt?: number
}

export interface Dashboard {
  id: string
  name: string
  description: string
  widgets: DashboardWidget[]
  layout: DashboardLayout
  refreshInterval: number
  createdAt: number
  updatedAt: number
}

export interface DashboardWidget {
  id: string
  type: 'metric' | 'chart' | 'table' | 'alert' | 'log'
  title: string
  position: {
    x: number
    y: number
    width: number
    height: number
  }
  config: Record<string, any>
}

export interface DashboardLayout {
  columns: number
  rows: number
  widgets: DashboardWidget[]
}

export interface LogEntry {
  id: string
  timestamp: number
  level: 'debug' | 'info' | 'warn' | 'error'
  message: string
  context?: Record<string, any>
  tags?: Record<string, string>
  source: string
  userId?: string
  sessionId?: string
  requestId?: string
  ip?: string
  userAgent?: string
}

export interface Trace {
  id: string
  traceId: string
  spanId: string
  parentSpanId?: string
  name: string
  startTime: number
  endTime: number
  duration: number
  tags: Record<string, string>
  logs: TraceLog[]
  error?: {
    message: string
    stack?: string
  }
}

export interface TraceLog {
  timestamp: number
  message: string
  fields: Record<string, any>
}

export interface MonitoringConfig {
  enabled: boolean
  endpoint: string
  apiKey: string
  environment: string
  service: string
  version: string
  sampleRate: number
  maxBatchSize: number
  flushInterval: number
  debug: boolean
}

export interface MonitoringService {
  trackMetric: (metric: Metric) => void
  trackError: (error: Error, context?: Record<string, any>) => void
  trackPerformance: (metric: PerformanceMetric) => void
  trackUser: (metric: UserMetric) => void
  trackBusiness: (metric: BusinessMetric) => void
  startTrace: (name: string, tags?: Record<string, string>) => Trace
  endTrace: (trace: Trace) => void
  addTraceLog: (trace: Trace, message: string, fields?: Record<string, any>) => void
  setUser: (userId: string, properties?: Record<string, any>) => void
  setSession: (sessionId: string) => void
  flush: () => Promise<void>
}

export interface HealthCheckService {
  register: (check: HealthCheck) => void
  unregister: (name: string) => void
  run: (name: string) => Promise<HealthCheck>
  runAll: () => Promise<HealthCheck[]>
  getStatus: () => Promise<Record<string, HealthCheck>>
}

export interface MetricsService {
  increment: (name: string, value?: number, tags?: Record<string, string>) => void
  gauge: (name: string, value: number, tags?: Record<string, string>) => void
  histogram: (name: string, value: number, tags?: Record<string, string>) => void
  timing: (name: string, value: number, tags?: Record<string, string>) => void
  getMetrics: () => Promise<Metric[]>
  flush: () => Promise<void>
}

export interface AlertService {
  create: (alert: Omit<Alert, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Alert>
  update: (id: string, updates: Partial<Alert>) => Promise<Alert>
  delete: (id: string) => Promise<void>
  get: (id: string) => Promise<Alert | null>
  list: (filters?: Record<string, any>) => Promise<Alert[]>
  acknowledge: (id: string, userId: string) => Promise<void>
  resolve: (id: string) => Promise<void>
}

export interface LogService {
  debug: (message: string, context?: Record<string, any>) => void
  info: (message: string, context?: Record<string, any>) => void
  warn: (message: string, context?: Record<string, any>) => void
  error: (message: string, error?: Error, context?: Record<string, any>) => void
  query: (filters?: Record<string, any>, limit?: number) => Promise<LogEntry[]>
  export: (filters?: Record<string, any>, format?: 'json' | 'csv') => Promise<string>
} 

