// Types pour les formulaires

export interface LoginFormData {
  email: string
  password: string
}

export interface RegisterFormData {
  email: string
  password: string
  confirmPassword: string
  nom?: string
  prenom?: string
  telephone?: string
  acceptTerms: boolean
}

export interface ConciergerieFormData {
  nom: string
  description: string
  siteWeb?: string
  telephone?: string
  email?: string
  adresse?: string
  villeId: string
  services: string[]
  tarifs: {
    commission?: number
    frais?: number
    minimum?: number
  }
}

export interface ContactFormData {
  nom: string
  email: string
  telephone?: string
  sujet: string
  message: string
}

export interface DevisFormData {
  nom: string
  email: string
  telephone: string
  ville: string
  typeBien: string
  nombreChambres: number
  revenusEstimes?: number
  message?: string
}

export interface SearchFormData {
  ville?: string
  services?: string[]
  prixMin?: number
  prixMax?: number
  noteMin?: number
}

export interface FilterFormData {
  categories: string[]
  prix: [number, number]
  note: number
  services: string[]
  disponibilite: boolean
} 
