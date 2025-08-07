// Types pour les hooks

export interface UseLocalStorageOptions<T> {
  defaultValue?: T
  serialize?: (value: T) => string
  deserialize?: (value: string) => T
}

export interface UseDebounceOptions {
  delay: number
  leading?: boolean
  trailing?: boolean
  maxWait?: number
}

export interface UseThrottleOptions {
  delay: number
  leading?: boolean
  trailing?: boolean
}

export interface UseIntersectionObserverOptions {
  root?: Element | null
  rootMargin?: string
  threshold?: number | number[]
}

export interface UseMediaQueryOptions {
  defaultValue?: boolean
  ssr?: boolean
}

export interface UseClickOutsideOptions {
  enabled?: boolean
  refs?: React.RefObject<Element>[]
}

export interface UseKeyPressOptions {
  targetKey: string | string[]
  event?: 'keydown' | 'keyup' | 'keypress'
  preventDefault?: boolean
  stopPropagation?: boolean
}

export interface UseScrollOptions {
  element?: Element | null
  throttle?: number
  passive?: boolean
}

export interface UseWindowSizeOptions {
  initialWidth?: number
  initialHeight?: number
  ssr?: boolean
}

export interface UsePreviousOptions<T> {
  initialValue?: T
}

export interface UseToggleOptions {
  initialValue?: boolean
}

export interface UseCounterOptions {
  initialValue?: number
  min?: number
  max?: number
  step?: number
}

export interface UseArrayOptions<T> {
  initialValue?: T[]
}

export interface UseBooleanOptions {
  initialValue?: boolean
}

export interface UseNumberOptions {
  initialValue?: number
  min?: number
  max?: number
  step?: number
}

export interface UseStringOptions {
  initialValue?: string
}

export interface UseObjectOptions<T> {
  initialValue?: T
}

export interface UseAsyncOptions<T> {
  immediate?: boolean
  onSuccess?: (data: T) => void
  onError?: (error: Error) => void
  onSettled?: (data: T | null, error: Error | null) => void
}

export interface UseAsyncResult<T> {
  data: T | null
  error: Error | null
  loading: boolean
  execute: (...args: any[]) => Promise<void>
  reset: () => void
}

export interface UseFormOptions<T> {
  initialValues: T
  validationSchema?: ValidationSchema
  onSubmit: (values: T) => void | Promise<void>
  onError?: (errors: Record<string, string>) => void
}

export interface UseFormResult<T> {
  values: T
  errors: Record<string, string>
  touched: Record<string, boolean>
  isValid: boolean
  isSubmitting: boolean
  handleChange: (field: keyof T, value: any) => void
  handleBlur: (field: keyof T) => void
  handleSubmit: (e?: React.FormEvent) => void
  reset: () => void
  setFieldValue: (field: keyof T, value: any) => void
  setFieldError: (field: keyof T, error: string) => void
  setFieldTouched: (field: keyof T, touched: boolean) => void
}

export interface UseQueryOptions<T> {
  queryKey: string[]
  queryFn: () => Promise<T>
  enabled?: boolean
  staleTime?: number
  cacheTime?: number
  retry?: number | boolean
  retryDelay?: number
  onSuccess?: (data: T) => void
  onError?: (error: Error) => void
  onSettled?: (data: T | null, error: Error | null) => void
}

export interface UseQueryResult<T> {
  data: T | undefined
  error: Error | null
  isLoading: boolean
  isError: boolean
  isSuccess: boolean
  isFetching: boolean
  refetch: () => void
}

export interface UseMutationOptions<T, V> {
  mutationFn: (variables: V) => Promise<T>
  onSuccess?: (data: T, variables: V) => void
  onError?: (error: Error, variables: V) => void
  onSettled?: (data: T | null, error: Error | null, variables: V) => void
}

export interface UseMutationResult<T, V> {
  data: T | null
  error: Error | null
  isLoading: boolean
  isError: boolean
  isSuccess: boolean
  mutate: (variables: V) => void
  mutateAsync: (variables: V) => Promise<T>
  reset: () => void
} 