/* eslint-disable @typescript-eslint/no-redundant-type-constituents */
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never;
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      graphql: {
        Args: {
          extensions?: Json;
          operationName?: string;
          query?: string;
          variables?: Json;
        };
        Returns: Json;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
  public: {
    Tables: {
      alliances: {
        Row: {
          created_at: string;
          expires_at: string | null;
          id: string;
          metadata: Json | null;
          profile_a_id: string;
          profile_b_id: string;
          status: Database["public"]["Enums"]["alliance_status"];
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          expires_at?: string | null;
          id?: string;
          metadata?: Json | null;
          profile_a_id: string;
          profile_b_id: string;
          status?: Database["public"]["Enums"]["alliance_status"];
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          expires_at?: string | null;
          id?: string;
          metadata?: Json | null;
          profile_a_id?: string;
          profile_b_id?: string;
          status?: Database["public"]["Enums"]["alliance_status"];
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "alliances_profile_a_id_fkey";
            columns: ["profile_a_id"];
            isOneToOne: false;
            referencedRelation: "user_profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "alliances_profile_b_id_fkey";
            columns: ["profile_b_id"];
            isOneToOne: false;
            referencedRelation: "user_profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      business_cards: {
        Row: {
          content: Json;
          created_at: string;
          display_config: Json;
          id: string;
          is_published: boolean;
          updated_at: string;
          user_profile_id: string;
        };
        Insert: {
          content?: Json;
          created_at?: string;
          display_config?: Json;
          id?: string;
          is_published?: boolean;
          updated_at?: string;
          user_profile_id: string;
        };
        Update: {
          content?: Json;
          created_at?: string;
          display_config?: Json;
          id?: string;
          is_published?: boolean;
          updated_at?: string;
          user_profile_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "business_cards_user_profile_id_fkey";
            columns: ["user_profile_id"];
            isOneToOne: true;
            referencedRelation: "user_profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      follows: {
        Row: {
          created_at: string;
          followed_profile_id: string;
          follower_profile_id: string;
          status: Database["public"]["Enums"]["follow_status"];
        };
        Insert: {
          created_at?: string;
          followed_profile_id: string;
          follower_profile_id: string;
          status?: Database["public"]["Enums"]["follow_status"];
        };
        Update: {
          created_at?: string;
          followed_profile_id?: string;
          follower_profile_id?: string;
          status?: Database["public"]["Enums"]["follow_status"];
        };
        Relationships: [
          {
            foreignKeyName: "follows_followed_profile_id_fkey";
            columns: ["followed_profile_id"];
            isOneToOne: false;
            referencedRelation: "user_profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "follows_follower_profile_id_fkey";
            columns: ["follower_profile_id"];
            isOneToOne: false;
            referencedRelation: "user_profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      root_accounts: {
        Row: {
          auth_user_id: string;
          created_at: string;
          data_retention_days: number | null;
          id: string;
          level: number;
          points: number;
          trust_days: number;
          updated_at: string;
        };
        Insert: {
          auth_user_id: string;
          created_at?: string;
          data_retention_days?: number | null;
          id?: string;
          level?: number;
          points?: number;
          trust_days?: number;
          updated_at?: string;
        };
        Update: {
          auth_user_id?: string;
          created_at?: string;
          data_retention_days?: number | null;
          id?: string;
          level?: number;
          points?: number;
          trust_days?: number;
          updated_at?: string;
        };
        Relationships: [];
      };
      user_profiles: {
        Row: {
          created_at: string;
          display_name: string;
          id: string;
          is_active: boolean;
          last_interacted_record_id: string | null;
          purpose: string | null;
          role_type: string;
          root_account_id: string;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          display_name: string;
          id?: string;
          is_active?: boolean;
          last_interacted_record_id?: string | null;
          purpose?: string | null;
          role_type?: string;
          root_account_id: string;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          display_name?: string;
          id?: string;
          is_active?: boolean;
          last_interacted_record_id?: string | null;
          purpose?: string | null;
          role_type?: string;
          root_account_id?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "user_profiles_root_account_id_fkey";
            columns: ["root_account_id"];
            isOneToOne: false;
            referencedRelation: "root_accounts";
            referencedColumns: ["id"];
          },
        ];
      };
      user_work_entries: {
        Row: {
          created_at: string;
          memo: string | null;
          status: string;
          tier: number | null;
          updated_at: string;
          user_id: string;
          work_id: string;
        };
        Insert: {
          created_at?: string;
          memo?: string | null;
          status: string;
          tier?: number | null;
          updated_at?: string;
          user_id: string;
          work_id: string;
        };
        Update: {
          created_at?: string;
          memo?: string | null;
          status?: string;
          tier?: number | null;
          updated_at?: string;
          user_id?: string;
          work_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "user_work_entries_work_id_fkey";
            columns: ["work_id"];
            isOneToOne: false;
            referencedRelation: "works";
            referencedColumns: ["id"];
          },
        ];
      };
      user_work_ratings: {
        Row: {
          created_at: string;
          last_tier: string | null;
          rating: string;
          updated_at: string;
          user_id: string;
          work_id: string;
        };
        Insert: {
          created_at?: string;
          last_tier?: string | null;
          rating: string;
          updated_at?: string;
          user_id: string;
          work_id: string;
        };
        Update: {
          created_at?: string;
          last_tier?: string | null;
          rating?: string;
          updated_at?: string;
          user_id?: string;
          work_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "user_work_ratings_work_id_fkey";
            columns: ["work_id"];
            isOneToOne: false;
            referencedRelation: "works";
            referencedColumns: ["id"];
          },
        ];
      };
      works: {
        Row: {
          affiliate_url: string | null;
          author: string | null;
          category: string;
          created_at: string;
          description: string | null;
          external_url: string | null;
          id: string;
          is_official: boolean;
          is_purchasable: boolean | null;
          owner_user_id: string | null;
          release_year: string | null;
          scale: string | null;
          status: string;
          tags: string[] | null;
          title: string;
          updated_at: string;
        };
        Insert: {
          affiliate_url?: string | null;
          author?: string | null;
          category: string;
          created_at?: string;
          description?: string | null;
          external_url?: string | null;
          id?: string;
          is_official?: boolean;
          is_purchasable?: boolean | null;
          owner_user_id?: string | null;
          release_year?: string | null;
          scale?: string | null;
          status?: string;
          tags?: string[] | null;
          title: string;
          updated_at?: string;
        };
        Update: {
          affiliate_url?: string | null;
          author?: string | null;
          category?: string;
          created_at?: string;
          description?: string | null;
          external_url?: string | null;
          id?: string;
          is_official?: boolean;
          is_purchasable?: boolean | null;
          owner_user_id?: string | null;
          release_year?: string | null;
          scale?: string | null;
          status?: string;
          tags?: string[] | null;
          title?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      alliance_status: "requested" | "pre_partner" | "partner";
      follow_status: "watch" | "follow";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<
  keyof Database,
  "public"
>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      alliance_status: ["requested", "pre_partner", "partner"],
      follow_status: ["watch", "follow"],
    },
  },
} as const;
