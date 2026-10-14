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
    PostgrestVersion: "12.2.12 (cd3cf9e)"
  }
  api: {
    Tables: {
      course_chat: {
        Row: {
          course_id: string | null
          created_at: string | null
          emoji_type: string | null
          id: string
          message: string
          user_id: string | null
        }
        Insert: {
          course_id?: string | null
          created_at?: string | null
          emoji_type?: string | null
          id?: string
          message: string
          user_id?: string | null
        }
        Update: {
          course_id?: string | null
          created_at?: string | null
          emoji_type?: string | null
          id?: string
          message?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "course_chat_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "disc_golf_courses"
            referencedColumns: ["id"]
          },
        ]
      }
      course_conditions: {
        Row: {
          condition_type: string
          course_id: string | null
          created_at: string | null
          description: string | null
          id: string
          severity: number | null
          user_id: string | null
        }
        Insert: {
          condition_type: string
          course_id?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          severity?: number | null
          user_id?: string | null
        }
        Update: {
          condition_type?: string
          course_id?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          severity?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "course_conditions_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "disc_golf_courses"
            referencedColumns: ["id"]
          },
        ]
      }
      course_presence: {
        Row: {
          course_id: string | null
          created_at: string | null
          id: string
          is_active: boolean | null
          last_seen: string | null
          user_id: string | null
        }
        Insert: {
          course_id?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          last_seen?: string | null
          user_id?: string | null
        }
        Update: {
          course_id?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          last_seen?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "course_presence_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "disc_golf_courses"
            referencedColumns: ["id"]
          },
        ]
      }
      disc_golf_courses: {
        Row: {
          city: string
          classification: string | null
          configs: string | null
          contact_info: Json | null
          country: string
          created_at: string
          description: string | null
          designer: string | null
          directions: string | null
          elevation: string | null
          established: number | null
          foliage: string | null
          holes: number
          id: string
          latitude: number | null
          length: Json | null
          longitude: number | null
          name: string
          par: number | null
          postal_code: string | null
          property: Json | null
          rating: number | null
          services: string | null
          state: string
          targets: Json | null
          tees: Json | null
          updated_at: string
        }
        Insert: {
          city: string
          classification?: string | null
          configs?: string | null
          contact_info?: Json | null
          country?: string
          created_at?: string
          description?: string | null
          designer?: string | null
          directions?: string | null
          elevation?: string | null
          established?: number | null
          foliage?: string | null
          holes: number
          id?: string
          latitude?: number | null
          length?: Json | null
          longitude?: number | null
          name: string
          par?: number | null
          postal_code?: string | null
          property?: Json | null
          rating?: number | null
          services?: string | null
          state: string
          targets?: Json | null
          tees?: Json | null
          updated_at?: string
        }
        Update: {
          city?: string
          classification?: string | null
          configs?: string | null
          contact_info?: Json | null
          country?: string
          created_at?: string
          description?: string | null
          designer?: string | null
          directions?: string | null
          elevation?: string | null
          established?: number | null
          foliage?: string | null
          holes?: number
          id?: string
          latitude?: number | null
          length?: Json | null
          longitude?: number | null
          name?: string
          par?: number | null
          postal_code?: string | null
          property?: Json | null
          rating?: number | null
          services?: string | null
          state?: string
          targets?: Json | null
          tees?: Json | null
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          full_name: string | null
          id: string
          updated_at: string | null
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          full_name?: string | null
          id: string
          updated_at?: string | null
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string | null
          username?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      cleanup_old_presence: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      get_disc_golf_courses: {
        Args: Record<PropertyKey, never>
        Returns: {
          id: string
          name: string
          city: string
          state: string
          postal_code: string
          country: string
          latitude: number
          longitude: number
          contact_info: Json
          established: number
          designer: string
          classification: string
          rating: number
          holes: number
          configs: string
          length: Json
          par: number
          tees: Json
          targets: Json
          property: Json
          services: string
          description: string
          directions: string
          elevation: string
          foliage: string
          created_at: string
          updated_at: string
        }[]
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
  api: {
    Enums: {},
  },
} as const
