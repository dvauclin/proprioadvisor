// Types pour les contextes

export interface AuthContextType {
  user: User | null
  profile: User | null
  loading: boolean
  isAdmin: boolean
  signIn: (email: string, password: string) => Promise<{ error?: any }>
  signUp: (email: string, password: string, userData?: Partial<User>) => Promise<{ error?: any }>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<{ error?: any }>
  updateProfile: (data: Partial<User>) => Promise<{ error?: any }>
}

export interface FavoritesContextType {
  favorites: Conciergerie[]
  favoritesCount: number
  addToFavorites: (conciergerie: Conciergerie) => void
  removeFromFavorites: (conciergerieId: string) => void
  isFavorite: (conciergerieId: string) => boolean
  clearFavorites: () => void
}

export interface CookieConsentContextType {
  cookieConsent: {
    necessary: boolean
    analytics: boolean
    marketing: boolean
  }
  hasResponded: boolean
  updateCookieConsent: (consent: {
    necessary: boolean
    analytics: boolean
    marketing: boolean
  }) => void
  resetCookieConsent: () => void
}

export interface ThemeContextType {
  theme: 'light' | 'dark' | 'system'
  setTheme: (theme: 'light' | 'dark' | 'system') => void
  resolvedTheme: 'light' | 'dark'
}

export interface LoadingContextType {
  loading: boolean
  setLoading: (loading: boolean) => void
  loadingMessage: string
  setLoadingMessage: (message: string) => void
}

export interface NotificationContextType {
  notifications: Notification[]
  addNotification: (notification: Omit<Notification, 'id'>) => void
  removeNotification: (id: string) => void
  clearNotifications: () => void
}

export interface Notification {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message?: string
  duration?: number
  action?: {
    label: string
    onClick: () => void
  }
}

export interface ModalContextType {
  modals: Modal[]
  openModal: (modal: Omit<Modal, 'id'>) => void
  closeModal: (id: string) => void
  closeAllModals: () => void
}

export interface Modal {
  id: string
  component: React.ComponentType<any>
  props?: Record<string, any>
  onClose?: () => void
} 