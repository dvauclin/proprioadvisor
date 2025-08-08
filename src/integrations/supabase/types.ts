export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      articles: {
        Row: {
          contenu: string
          created_at: string | null
          date_modification: string | null
          excerpt: string | null
          id: string
          image: string | null
          question_1: string | null
          question_2: string | null
          question_3: string | null
          question_4: string | null
          question_5: string | null
          reponse_1: string | null
          reponse_2: string | null
          reponse_3: string | null
          reponse_4: string | null
          reponse_5: string | null
          resume: string | null
          slug: string
          titre: string
        }
        Insert: {
          contenu: string
          created_at?: string | null
          date_modification?: string | null
          excerpt?: string | null
          id?: string
          image?: string | null
          question_1?: string | null
          question_2?: string | null
          question_3?: string | null
          question_4?: string | null
          question_5?: string | null
          reponse_1?: string | null
          reponse_2?: string | null
          reponse_3?: string | null
          reponse_4?: string | null
          reponse_5?: string | null
          resume?: string | null
          slug: string
          titre: string
        }
        Update: {
          contenu?: string
          created_at?: string | null
          date_modification?: string | null
          excerpt?: string | null
          id?: string
          image?: string | null
          question_1?: string | null
          question_2?: string | null
          question_3?: string | null
          question_4?: string | null
          question_5?: string | null
          reponse_1?: string | null
          reponse_2?: string | null
          reponse_3?: string | null
          reponse_4?: string | null
          reponse_5?: string | null
          resume?: string | null
          slug?: string
          titre?: string
        }
        Relationships: []
      }
      avis: {
        Row: {
          commentaire: string | null
          conciergerie_id: string
          created_at: string | null
          date: string | null
          emetteur: string
          id: string
          note: number
          valide: boolean
        }
        Insert: {
          commentaire?: string | null
          conciergerie_id: string
          created_at?: string | null
          date?: string | null
          emetteur: string
          id?: string
          note: number
          valide?: boolean
        }
        Update: {
          commentaire?: string | null
          conciergerie_id?: string
          created_at?: string | null
          date?: string | null
          emetteur?: string
          id?: string
          note?: number
          valide?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "avis_conciergerie_id_fkey"
            columns: ["conciergerie_id"]
            isOneToOne: false
            referencedRelation: "conciergeries"
            referencedColumns: ["id"]
          },
        ]
      }
      conciergeries: {
        Row: {
          accepte_gestion_partielle: boolean
          accepte_residence_principale: boolean
          created_at: string | null
          deduction_frais: string | null
          id: string
          logo: string | null
          mail: string | null
          nom: string
          nom_contact: string | null
          nombre_chambres_min: number | null
          score_manuel: number | null
          superficie_min: number | null
          telephone_contact: string | null
          tva: string | null
          type_logement_accepte: string
          url_avis: string | null
          validated: boolean
          villes_ids: string[] | null
          zone_couverte: string | null
        }
        Insert: {
          accepte_gestion_partielle?: boolean
          accepte_residence_principale?: boolean
          created_at?: string | null
          deduction_frais?: string | null
          id?: string
          logo?: string | null
          mail?: string | null
          nom: string
          nom_contact?: string | null
          nombre_chambres_min?: number | null
          score_manuel?: number | null
          superficie_min?: number | null
          telephone_contact?: string | null
          tva?: string | null
          type_logement_accepte: string
          url_avis?: string | null
          validated?: boolean
          villes_ids?: string[] | null
          zone_couverte?: string | null
        }
        Update: {
          accepte_gestion_partielle?: boolean
          accepte_residence_principale?: boolean
          created_at?: string | null
          deduction_frais?: string | null
          id?: string
          logo?: string | null
          mail?: string | null
          nom?: string
          nom_contact?: string | null
          nombre_chambres_min?: number | null
          score_manuel?: number | null
          superficie_min?: number | null
          telephone_contact?: string | null
          tva?: string | null
          type_logement_accepte?: string
          url_avis?: string | null
          validated?: boolean
          villes_ids?: string[] | null
          zone_couverte?: string | null
        }
        Relationships: []
      }
      contact_messages: {
        Row: {
          created_at: string
          email: string
          id: string
          is_processed: boolean
          is_read: boolean
          message: string
          nom: string
          sujet: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          is_processed?: boolean
          is_read?: boolean
          message: string
          nom: string
          sujet: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          is_processed?: boolean
          is_read?: boolean
          message?: string
          nom?: string
          sujet?: string
        }
        Relationships: []
      }
      formules: {
        Row: {
          abonnement_mensuel: number | null
          commission: number | null
          conciergerie_id: string
          created_at: string | null
          duree_gestion_min: number | null
          forfait_reapprovisionnement: number | null
          frais_demarrage: number | null
          frais_menage_heure: number | null
          frais_reapprovisionnement: string | null
          frais_supplementaire_location: number | null
          id: string
          location_linge: string | null
          nom: string
          prix_location_linge: number | null
          services_inclus: string[] | null
        }
        Insert: {
          abonnement_mensuel?: number | null
          commission?: number | null
          conciergerie_id: string
          created_at?: string | null
          duree_gestion_min?: number | null
          forfait_reapprovisionnement?: number | null
          frais_demarrage?: number | null
          frais_menage_heure?: number | null
          frais_reapprovisionnement?: string | null
          frais_supplementaire_location?: number | null
          id?: string
          location_linge?: string | null
          nom: string
          prix_location_linge?: number | null
          services_inclus?: string[] | null
        }
        Update: {
          abonnement_mensuel?: number | null
          commission?: number | null
          conciergerie_id?: string
          created_at?: string | null
          duree_gestion_min?: number | null
          forfait_reapprovisionnement?: number | null
          frais_demarrage?: number | null
          frais_menage_heure?: number | null
          frais_reapprovisionnement?: string | null
          frais_supplementaire_location?: number | null
          id?: string
          location_linge?: string | null
          nom?: string
          prix_location_linge?: number | null
          services_inclus?: string[] | null
        }
        Relationships: [
          {
            foreignKeyName: "formules_conciergerie_id_fkey"
            columns: ["conciergerie_id"]
            isOneToOne: false
            referencedRelation: "conciergeries"
            referencedColumns: ["id"]
          },
        ]
      }
      leads: {
        Row: {
          adresse: string
          date: string | null
          date_vue: string | null
          duree_mise_disposition: string
          formule_id: string | null
          id: string
          mail: string
          message: string | null
          nom: string
          nombre_chambres: number
          plusieurs_logements: boolean | null
          prestations_recherchees: string[]
          residence_principale: boolean | null
          superficie: number
          telephone: string
          type_bien: string
          ville: string
        }
        Insert: {
          adresse: string
          date?: string | null
          date_vue?: string | null
          duree_mise_disposition: string
          formule_id?: string | null
          id?: string
          mail: string
          message?: string | null
          nom: string
          nombre_chambres: number
          plusieurs_logements?: boolean | null
          prestations_recherchees: string[]
          residence_principale?: boolean | null
          superficie: number
          telephone: string
          type_bien: string
          ville: string
        }
        Update: {
          adresse?: string
          date?: string | null
          date_vue?: string | null
          duree_mise_disposition?: string
          formule_id?: string | null
          id?: string
          mail?: string
          message?: string | null
          nom?: string
          nombre_chambres?: number
          plusieurs_logements?: boolean | null
          prestations_recherchees?: string[]
          residence_principale?: boolean | null
          superficie?: number
          telephone?: string
          type_bien?: string
          ville?: string
        }
        Relationships: [
          {
            foreignKeyName: "leads_formule_id_fkey"
            columns: ["formule_id"]
            isOneToOne: false
            referencedRelation: "formules"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string | null
          email: string
          id: string
          role: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          id: string
          role?: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          role?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          backlink: boolean
          basic_listing: boolean
          conciergerie_id: string
          conciergerie_page_link: boolean
          created_at: string
          id: string
          monthly_amount: number
          partner_listing: boolean
          payment_status: string
          pending_monthly_amount: number | null
          pending_stripe_session_id: string | null
          phone_number: boolean
          phone_number_value: string | null
          points_options: number
          stripe_session_id: string | null
          stripe_subscription_id: string | null
          subscription_renewal_day: number | null
          total_points: number
          updated_at: string
          use_custom_amount: boolean
          website_link: boolean
          website_url: string | null
        }
        Insert: {
          backlink?: boolean
          basic_listing?: boolean
          conciergerie_id: string
          conciergerie_page_link?: boolean
          created_at?: string
          id?: string
          monthly_amount: number
          partner_listing?: boolean
          payment_status?: string
          pending_monthly_amount?: number | null
          pending_stripe_session_id?: string | null
          phone_number?: boolean
          phone_number_value?: string | null
          points_options?: number
          stripe_session_id?: string | null
          stripe_subscription_id?: string | null
          subscription_renewal_day?: number | null
          total_points?: number
          updated_at?: string
          use_custom_amount?: boolean
          website_link?: boolean
          website_url?: string | null
        }
        Update: {
          backlink?: boolean
          basic_listing?: boolean
          conciergerie_id?: string
          conciergerie_page_link?: boolean
          created_at?: string
          id?: string
          monthly_amount?: number
          partner_listing?: boolean
          payment_status?: string
          pending_monthly_amount?: number | null
          pending_stripe_session_id?: string | null
          phone_number?: boolean
          phone_number_value?: string | null
          points_options?: number
          stripe_session_id?: string | null
          stripe_subscription_id?: string | null
          subscription_renewal_day?: number | null
          total_points?: number
          updated_at?: string
          use_custom_amount?: boolean
          website_link?: boolean
          website_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_conciergerie_id_fkey"
            columns: ["conciergerie_id"]
            isOneToOne: false
            referencedRelation: "conciergeries"
            referencedColumns: ["id"]
          },
        ]
      }
      villes: {
        Row: {
          created_at: string | null
          departement_nom: string | null
          departement_numero: string | null
          description: string | null
          description_longue: string | null
          id: string
          latitude: number | null
          longitude: number | null
          nom: string
          slug: string
          title_seo: string | null
          ville_mere_id: string | null
          villes_liees: string[] | null
        }
        Insert: {
          created_at?: string | null
          departement_nom?: string | null
          departement_numero?: string | null
          description?: string | null
          description_longue?: string | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          nom: string
          slug: string
          title_seo?: string | null
          ville_mere_id?: string | null
          villes_liees?: string[] | null
        }
        Update: {
          created_at?: string | null
          departement_nom?: string | null
          departement_numero?: string | null
          description?: string | null
          description_longue?: string | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          nom?: string
          slug?: string
          title_seo?: string | null
          ville_mere_id?: string | null
          villes_liees?: string[] | null
        }
        Relationships: [
          {
            foreignKeyName: "villes_ville_mere_id_fkey"
            columns: ["ville_mere_id"]
            isOneToOne: false
            referencedRelation: "villes"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_conciergerie_stats: {
        Args: Record<PropertyKey, never>
        Returns: {
          conciergerie_id: string
          nom: string
          email: string
          monthly_amount: number
          total_points: number
          subscription_created_at: string
        }[]
      }
      get_conciergerie_stats_enrichie: {
        Args: Record<PropertyKey, never>
        Returns: {
          conciergerie_id: string
          nom: string
          email: string
          montant_abonnement: number
          points: number
          leads_total: number
          leads_mois_courant: number
          villes: Json
        }[]
      }
      get_user_role: {
        Args: { user_id: string }
        Returns: string
      }
      is_admin: {
        Args: { user_id: string }
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const

