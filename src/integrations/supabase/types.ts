export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      dashboard_statistics: {
        Row: {
          bg_color: string
          color: string
          created_at: string
          description: string
          icon_name: string
          id: string
          title: string
          updated_at: string
          user_id: string
          value: string
        }
        Insert: {
          bg_color: string
          color: string
          created_at?: string
          description: string
          icon_name: string
          id?: string
          title: string
          updated_at?: string
          user_id: string
          value: string
        }
        Update: {
          bg_color?: string
          color?: string
          created_at?: string
          description?: string
          icon_name?: string
          id?: string
          title?: string
          updated_at?: string
          user_id?: string
          value?: string
        }
        Relationships: []
      }
      dashboard_stats: {
        Row: {
          completed_reviews: number | null
          created_at: string
          id: string
          pending_reviews: number | null
          total_reviews: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          completed_reviews?: number | null
          created_at?: string
          id?: string
          pending_reviews?: number | null
          total_reviews?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          completed_reviews?: number | null
          created_at?: string
          id?: string
          pending_reviews?: number | null
          total_reviews?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      features: {
        Row: {
          created_at: string
          description: string
          icon_name: string
          id: string
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description: string
          icon_name: string
          id?: string
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string
          icon_name?: string
          id?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      history: {
        Row: {
          action: string
          created_at: string
          details: string | null
          id: string
          review_id: string
          user_id: string
        }
        Insert: {
          action: string
          created_at?: string
          details?: string | null
          id?: string
          review_id: string
          user_id: string
        }
        Update: {
          action?: string
          created_at?: string
          details?: string | null
          id?: string
          review_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "history_review_id_fkey"
            columns: ["review_id"]
            isOneToOne: false
            referencedRelation: "reviews"
            referencedColumns: ["id"]
          },
        ]
      }
      homepage_data: {
        Row: {
          created_at: string
          hero_description: string
          hero_title: string
          id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          hero_description?: string
          hero_title?: string
          id?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          hero_description?: string
          hero_title?: string
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      phone_otps: {
        Row: {
          created_at: string
          expires_at: string
          id: string
          otp_code: string
          phone_number: string
        }
        Insert: {
          created_at?: string
          expires_at: string
          id?: string
          otp_code: string
          phone_number: string
        }
        Update: {
          created_at?: string
          expires_at?: string
          id?: string
          otp_code?: string
          phone_number?: string
        }
        Relationships: []
      }
      process_steps: {
        Row: {
          created_at: string
          description: string
          id: string
          step_number: number
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description: string
          id?: string
          step_number: number
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string
          id?: string
          step_number?: number
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          id: string
          mobile_number: string | null
          name: string | null
          otp_enabled: boolean | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          id: string
          mobile_number?: string | null
          name?: string | null
          otp_enabled?: boolean | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          id?: string
          mobile_number?: string | null
          name?: string | null
          otp_enabled?: boolean | null
          updated_at?: string
        }
        Relationships: []
      }
      recent_reviews: {
        Row: {
          created_at: string
          date: string
          id: string
          issues: number
          name: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          date?: string
          id?: string
          issues?: number
          name: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          date?: string
          id?: string
          issues?: number
          name?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      review_history: {
        Row: {
          bugs: number
          created_at: string
          file_name: string
          id: string
          language: string
          optimization_samples: Json | null
          optimizations: number
          review_date: string
          status: string
          suggestions: number
          updated_at: string
          user_id: string
        }
        Insert: {
          bugs?: number
          created_at?: string
          file_name: string
          id?: string
          language?: string
          optimization_samples?: Json | null
          optimizations?: number
          review_date?: string
          status?: string
          suggestions?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          bugs?: number
          created_at?: string
          file_name?: string
          id?: string
          language?: string
          optimization_samples?: Json | null
          optimizations?: number
          review_date?: string
          status?: string
          suggestions?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      reviews: {
        Row: {
          code_snippet: string
          created_at: string
          feedback: string | null
          id: string
          language: string
          status: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          code_snippet: string
          created_at?: string
          feedback?: string | null
          id?: string
          language: string
          status?: string
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          code_snippet?: string
          created_at?: string
          feedback?: string | null
          id?: string
          language?: string
          status?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      create_phone_otps_if_not_exists: {
        Args: Record<PropertyKey, never>
        Returns: undefined
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

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
