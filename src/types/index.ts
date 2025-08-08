export interface User {
  id: string;
  email: string;
  nom?: string;
  prenom?: string;
  role?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Ville {
  id: string;
  nom: string;
  slug: string;
  description?: string;
  descriptionLongue?: string;
  titleSeo?: string;
  villesLiees?: string[];
  latitude?: number | null;
  longitude?: number | null;
  departementNumero?: string;
  departementNom?: string;
  villeMereId?: string;
  conciergerie_count?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface Conciergerie {
  id: string;
  nom: string;
  description?: string;
  logo?: string;
  villeId: string;
  villesIds?: string[];
  mail?: string;
  nomContact?: string;
  telephoneContact?: string;
  typeLogementAccepte: string;
  superficieMin: number;
  nombreChambresMin: number;
  accepteResidencePrincipale: boolean;
  accepteGestionPartielle: boolean;
  score: number;
  scoreManuel?: number | null;
  tva: "TTC" | "HT" | null;
  zoneCouverte?: string;
  deductionFrais?: string;
  urlAvis?: string;
  validated?: boolean;
  formules?: Formule[];
  villes?: Ville[];
  createdAt?: string;
  updatedAt?: string;
}

export interface Formule {
  id: string;
  nom: string;
  description?: string;
  conciergerieId: string;
  commission: number;
  dureeGestionMin: number;
  servicesInclus: string[];
  fraisReapprovisionnement: 'reel' | 'forfait' | 'inclus';
  forfaitReapprovisionnement: number;
  fraisSupplementaireLocation: number;
  fraisDemarrage: number;
  abonnementMensuel: number;
  fraisMenageHeure: number;
  locationLinge: 'inclus' | 'optionnel' | 'obligatoire';
  prixLocationLinge: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface Avis {
  id: string;
  conciergerieId: string;
  userId?: string;
  emetteur: string;
  note: number;
  commentaire: string;
  valide: boolean;
  date?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Lead {
  id: string;
  nom: string;
  mail: string;
  telephone: string;
  ville: string;
  adresse: string;
  typeBien: 'standard' | 'luxe';
  superficie: number;
  nombreChambres: number;
  dureeEspacementDisposition: 'moins3mois' | '3a6mois' | '6a12mois' | 'plus1an';
  prestationsRecherchees: string[];
  residencePrincipale?: boolean;
  plusieursLogements?: boolean;
  message?: string;
  formuleId?: string;
  date?: string;
  dateVue?: string;
  createdAt?: string;
  updatedAt?: string;
  formuleNom?: string;
  conciergerieNom?: string;
}

export interface Article {
  id: string;
  titre: string;
  contenu: string;
  excerpt?: string;
  slug: string;
  datePublication?: string;
  image?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface PropertyTypeOption {
  id: string;
  label: string;
}

export interface Service {
  id: string;
  label: string;
  icon?: React.ReactNode;
}

export interface Filter {
  typeBien?: string;
  superficie?: number;
  nombreChambres?: number;
  commissionMax?: number;
  dureeGestionMin?: number;
  servicesInclus?: string[];
  accepteResidencePrincipale?: boolean;
  accepteGestionPartielle?: boolean;
  noteMin?: number;
}

export interface CitiesManagerProps {
  cities: Ville[];
  onAdd: (city: Ville) => Promise<void>;
  onUpdate: (city: Ville) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export interface CityPopulatorProps {
  onCitiesAdded: (count: number) => void;
}

export interface ImageFile {
  id: string;
  name: string;
  url: string;
  size?: number;
  type?: string;
}

export interface ContactMessage {
  id: string;
  created_at: string;
  nom: string;
  email: string;
  sujet: string;
  message: string;
  is_read: boolean;
  is_processed: boolean;
}

export interface Subscription {
  id: string;
  conciergerie_id: string;
  basic_listing: boolean;
  partner_listing: boolean;
  phone_number: boolean;
  website_link: boolean;
  backlink: boolean;
  conciergerie_page_link: boolean;
  monthly_amount: number;
  use_custom_amount: boolean;
  total_points: number;
  points_options: number;
  payment_status: string;
  website_url?: string | null;
  phone_number_value?: string | null;
  stripe_session_id?: string | null;
  pending_monthly_amount?: number | null;
  pending_stripe_session_id?: string | null;
  created_at: string;
  updated_at: string;
}

