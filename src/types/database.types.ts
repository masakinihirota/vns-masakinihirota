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
      group_members: {
        Row: {
          group_id: string;
          joined_at: string;
          role: string | null;
          user_profile_id: string;
        };
        Insert: {
          group_id: string;
          joined_at?: string;
          role?: string | null;
          user_profile_id: string;
        };
        Update: {
          group_id?: string;
          joined_at?: string;
          role?: string | null;
          user_profile_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "group_members_group_id_fkey";
            columns: ["group_id"];
            isOneToOne: false;
            referencedRelation: "groups";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "group_members_user_profile_id_fkey";
            columns: ["user_profile_id"];
            isOneToOne: false;
            referencedRelation: "user_profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      groups: {
        Row: {
          avatar_url: string | null;
          cover_url: string | null;
          created_at: string;
          description: string | null;
          id: string;
          is_official: boolean | null;
          leader_id: string | null;
          name: string;
          updated_at: string;
        };
        Insert: {
          avatar_url?: string | null;
          cover_url?: string | null;
          created_at?: string;
          description?: string | null;
          id?: string;
          is_official?: boolean | null;
          leader_id?: string | null;
          name: string;
          updated_at?: string;
        };
        Update: {
          avatar_url?: string | null;
          cover_url?: string | null;
          created_at?: string;
          description?: string | null;
          id?: string;
          is_official?: boolean | null;
          leader_id?: string | null;
          name?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "groups_leader_id_fkey";
            columns: ["leader_id"];
            isOneToOne: false;
            referencedRelation: "user_profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      market_items: {
        Row: {
          created_at: string;
          currency: string | null;
          description: string | null;
          id: string;
          nation_id: string;
          price: number;
          seller_group_id: string | null;
          seller_id: string | null;
          status: string | null;
          title: string;
          type: string | null;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          currency?: string | null;
          description?: string | null;
          id?: string;
          nation_id: string;
          price: number;
          seller_group_id?: string | null;
          seller_id?: string | null;
          status?: string | null;
          title: string;
          type?: string | null;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          currency?: string | null;
          description?: string | null;
          id?: string;
          nation_id?: string;
          price?: number;
          seller_group_id?: string | null;
          seller_id?: string | null;
          status?: string | null;
          title?: string;
          type?: string | null;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "market_items_nation_id_fkey";
            columns: ["nation_id"];
            isOneToOne: false;
            referencedRelation: "nations";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "market_items_seller_group_id_fkey";
            columns: ["seller_group_id"];
            isOneToOne: false;
            referencedRelation: "groups";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "market_items_seller_id_fkey";
            columns: ["seller_id"];
            isOneToOne: false;
            referencedRelation: "user_profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      market_transactions: {
        Row: {
          buyer_id: string | null;
          completed_at: string | null;
          created_at: string;
          fee_amount: number;
          fee_rate: number;
          id: string;
          item_id: string;
          price: number;
          seller_id: string | null;
          seller_revenue: number;
          status: string | null;
        };
        Insert: {
          buyer_id?: string | null;
          completed_at?: string | null;
          created_at?: string;
          fee_amount: number;
          fee_rate: number;
          id?: string;
          item_id: string;
          price: number;
          seller_id?: string | null;
          seller_revenue: number;
          status?: string | null;
        };
        Update: {
          buyer_id?: string | null;
          completed_at?: string | null;
          created_at?: string;
          fee_amount?: number;
          fee_rate?: number;
          id?: string;
          item_id?: string;
          price?: number;
          seller_id?: string | null;
          seller_revenue?: number;
          status?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "market_transactions_buyer_id_fkey";
            columns: ["buyer_id"];
            isOneToOne: false;
            referencedRelation: "user_profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "market_transactions_item_id_fkey";
            columns: ["item_id"];
            isOneToOne: false;
            referencedRelation: "market_items";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "market_transactions_seller_id_fkey";
            columns: ["seller_id"];
            isOneToOne: false;
            referencedRelation: "user_profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      nation_citizens: {
        Row: {
          joined_at: string;
          nation_id: string;
          role: string | null;
          user_profile_id: string;
        };
        Insert: {
          joined_at?: string;
          nation_id: string;
          role?: string | null;
          user_profile_id: string;
        };
        Update: {
          joined_at?: string;
          nation_id?: string;
          role?: string | null;
          user_profile_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "nation_citizens_nation_id_fkey";
            columns: ["nation_id"];
            isOneToOne: false;
            referencedRelation: "nations";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "nation_citizens_user_profile_id_fkey";
            columns: ["user_profile_id"];
            isOneToOne: false;
            referencedRelation: "user_profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      nation_event_participants: {
        Row: {
          event_id: string;
          joined_at: string;
          status: string | null;
          user_profile_id: string;
        };
        Insert: {
          event_id: string;
          joined_at?: string;
          status?: string | null;
          user_profile_id: string;
        };
        Update: {
          event_id?: string;
          joined_at?: string;
          status?: string | null;
          user_profile_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "nation_event_participants_event_id_fkey";
            columns: ["event_id"];
            isOneToOne: false;
            referencedRelation: "nation_events";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "nation_event_participants_user_profile_id_fkey";
            columns: ["user_profile_id"];
            isOneToOne: false;
            referencedRelation: "user_profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      nation_events: {
        Row: {
          conditions: string | null;
          created_at: string;
          description: string | null;
          end_at: string | null;
          id: string;
          image_url: string | null;
          max_participants: number | null;
          nation_id: string;
          organizer_id: string | null;
          recruitment_end_at: string | null;
          recruitment_start_at: string | null;
          sponsors: string | null;
          start_at: string;
          status: string | null;
          title: string;
          type: string | null;
          updated_at: string;
        };
        Insert: {
          conditions?: string | null;
          created_at?: string;
          description?: string | null;
          end_at?: string | null;
          id?: string;
          image_url?: string | null;
          max_participants?: number | null;
          nation_id: string;
          organizer_id?: string | null;
          recruitment_end_at?: string | null;
          recruitment_start_at?: string | null;
          sponsors?: string | null;
          start_at: string;
          status?: string | null;
          title: string;
          type?: string | null;
          updated_at?: string;
        };
        Update: {
          conditions?: string | null;
          created_at?: string;
          description?: string | null;
          end_at?: string | null;
          id?: string;
          image_url?: string | null;
          max_participants?: number | null;
          nation_id?: string;
          organizer_id?: string | null;
          recruitment_end_at?: string | null;
          recruitment_start_at?: string | null;
          sponsors?: string | null;
          start_at?: string;
          status?: string | null;
          title?: string;
          type?: string | null;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "nation_events_nation_id_fkey";
            columns: ["nation_id"];
            isOneToOne: false;
            referencedRelation: "nations";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "nation_events_organizer_id_fkey";
            columns: ["organizer_id"];
            isOneToOne: false;
            referencedRelation: "user_profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      nation_groups: {
        Row: {
          group_id: string;
          joined_at: string;
          nation_id: string;
          role: string | null;
        };
        Insert: {
          group_id: string;
          joined_at?: string;
          nation_id: string;
          role?: string | null;
        };
        Update: {
          group_id?: string;
          joined_at?: string;
          nation_id?: string;
          role?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "nation_groups_group_id_fkey";
            columns: ["group_id"];
            isOneToOne: false;
            referencedRelation: "groups";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "nation_groups_nation_id_fkey";
            columns: ["nation_id"];
            isOneToOne: false;
            referencedRelation: "nations";
            referencedColumns: ["id"];
          },
        ];
      };
      nation_posts: {
        Row: {
          author_group_id: string | null;
          author_id: string | null;
          content: string;
          created_at: string;
          id: string;
          nation_id: string;
          type: string | null;
          updated_at: string;
        };
        Insert: {
          author_group_id?: string | null;
          author_id?: string | null;
          content: string;
          created_at?: string;
          id?: string;
          nation_id: string;
          type?: string | null;
          updated_at?: string;
        };
        Update: {
          author_group_id?: string | null;
          author_id?: string | null;
          content?: string;
          created_at?: string;
          id?: string;
          nation_id?: string;
          type?: string | null;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "nation_posts_author_group_id_fkey";
            columns: ["author_group_id"];
            isOneToOne: false;
            referencedRelation: "groups";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "nation_posts_author_id_fkey";
            columns: ["author_id"];
            isOneToOne: false;
            referencedRelation: "user_profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "nation_posts_nation_id_fkey";
            columns: ["nation_id"];
            isOneToOne: false;
            referencedRelation: "nations";
            referencedColumns: ["id"];
          },
        ];
      };
      nations: {
        Row: {
          avatar_url: string | null;
          cover_url: string | null;
          created_at: string;
          description: string | null;
          foundation_fee: number | null;
          id: string;
          is_official: boolean | null;
          name: string;
          owner_group_id: string | null;
          owner_user_id: string | null;
          transaction_fee_rate: number | null;
          updated_at: string;
        };
        Insert: {
          avatar_url?: string | null;
          cover_url?: string | null;
          created_at?: string;
          description?: string | null;
          foundation_fee?: number | null;
          id?: string;
          is_official?: boolean | null;
          name: string;
          owner_group_id?: string | null;
          owner_user_id?: string | null;
          transaction_fee_rate?: number | null;
          updated_at?: string;
        };
        Update: {
          avatar_url?: string | null;
          cover_url?: string | null;
          created_at?: string;
          description?: string | null;
          foundation_fee?: number | null;
          id?: string;
          is_official?: boolean | null;
          name?: string;
          owner_group_id?: string | null;
          owner_user_id?: string | null;
          transaction_fee_rate?: number | null;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "nations_owner_group_id_fkey";
            columns: ["owner_group_id"];
            isOneToOne: false;
            referencedRelation: "groups";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "nations_owner_user_id_fkey";
            columns: ["owner_user_id"];
            isOneToOne: false;
            referencedRelation: "user_profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      notifications: {
        Row: {
          created_at: string;
          id: string;
          is_read: boolean | null;
          link_url: string | null;
          message: string;
          title: string;
          type: string;
          user_profile_id: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          is_read?: boolean | null;
          link_url?: string | null;
          message: string;
          title: string;
          type: string;
          user_profile_id: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          is_read?: boolean | null;
          link_url?: string | null;
          message?: string;
          title?: string;
          type?: string;
          user_profile_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "notifications_user_profile_id_fkey";
            columns: ["user_profile_id"];
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
      complete_transaction: {
        Args: { p_transaction_id: string; p_user_id: string };
        Returns: boolean;
      };
      create_nation: {
        Args: { p_description: string; p_name: string; p_owner_id: string };
        Returns: string;
      };
      start_transaction: {
        Args: { p_counter_party_id: string; p_item_id: string };
        Returns: string;
      };
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
