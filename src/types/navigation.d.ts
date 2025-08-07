// Types pour la navigation

export interface NavigationItem {
  name: string
  href: string
  icon?: React.ComponentType<{ className?: string }>
  children?: NavigationItem[]
  external?: boolean
}

export interface BreadcrumbItem {
  name: string
  href?: string
  current?: boolean
}

export interface MenuItem {
  label: string
  href: string
  description?: string
  icon?: React.ComponentType<{ className?: string }>
  external?: boolean
}

export interface FooterLink {
  name: string
  href: string
  external?: boolean
}

export interface SocialLink {
  name: string
  href: string
  icon: React.ComponentType<{ className?: string }>
} 