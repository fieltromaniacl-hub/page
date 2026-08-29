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
      admins: {
        Row: {
          creado_en: string
          nombre: string | null
          user_id: string
        }
        Insert: {
          creado_en?: string
          nombre?: string | null
          user_id: string
        }
        Update: {
          creado_en?: string
          nombre?: string | null
          user_id?: string
        }
        Relationships: []
      }
      categorias: {
        Row: {
          creado_en: string
          descripcion: string | null
          id: string
          nombre: string
          orden: number
          slug: string
        }
        Insert: {
          creado_en?: string
          descripcion?: string | null
          id?: string
          nombre: string
          orden?: number
          slug: string
        }
        Update: {
          creado_en?: string
          descripcion?: string | null
          id?: string
          nombre?: string
          orden?: number
          slug?: string
        }
        Relationships: []
      }
      pedido_items: {
        Row: {
          cantidad: number
          id: string
          nombre: string
          pedido_id: string
          personalizacion: Json
          precio_unitario: number
          producto_id: string | null
          slug: string | null
        }
        Insert: {
          cantidad: number
          id?: string
          nombre: string
          pedido_id: string
          personalizacion?: Json
          precio_unitario: number
          producto_id?: string | null
          slug?: string | null
        }
        Update: {
          cantidad?: number
          id?: string
          nombre?: string
          pedido_id?: string
          personalizacion?: Json
          precio_unitario?: number
          producto_id?: string | null
          slug?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "pedido_items_pedido_id_fkey"
            columns: ["pedido_id"]
            isOneToOne: false
            referencedRelation: "pedidos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pedido_items_producto_id_fkey"
            columns: ["producto_id"]
            isOneToOne: false
            referencedRelation: "productos"
            referencedColumns: ["id"]
          },
        ]
      }
      pedidos: {
        Row: {
          actualizado_en: string
          cliente_email: string
          cliente_nombre: string
          cliente_telefono: string | null
          comuna: string | null
          correo_enviado: boolean
          correo_error: string | null
          creado_en: string
          estado: Database["public"]["Enums"]["estado_pedido"]
          id: string
          notas: string | null
          numero: string
          region: string | null
          total: number
        }
        Insert: {
          actualizado_en?: string
          cliente_email: string
          cliente_nombre: string
          cliente_telefono?: string | null
          comuna?: string | null
          correo_enviado?: boolean
          correo_error?: string | null
          creado_en?: string
          estado?: Database["public"]["Enums"]["estado_pedido"]
          id?: string
          notas?: string | null
          numero: string
          region?: string | null
          total: number
        }
        Update: {
          actualizado_en?: string
          cliente_email?: string
          cliente_nombre?: string
          cliente_telefono?: string | null
          comuna?: string | null
          correo_enviado?: boolean
          correo_error?: string | null
          creado_en?: string
          estado?: Database["public"]["Enums"]["estado_pedido"]
          id?: string
          notas?: string | null
          numero?: string
          region?: string | null
          total?: number
        }
        Relationships: []
      }
      producto_campos: {
        Row: {
          ayuda: string | null
          etiqueta: string
          id: string
          max_largo: number | null
          opciones: string[]
          orden: number
          producto_id: string
          requerido: boolean
          tipo: Database["public"]["Enums"]["tipo_campo"]
        }
        Insert: {
          ayuda?: string | null
          etiqueta: string
          id?: string
          max_largo?: number | null
          opciones?: string[]
          orden?: number
          producto_id: string
          requerido?: boolean
          tipo?: Database["public"]["Enums"]["tipo_campo"]
        }
        Update: {
          ayuda?: string | null
          etiqueta?: string
          id?: string
          max_largo?: number | null
          opciones?: string[]
          orden?: number
          producto_id?: string
          requerido?: boolean
          tipo?: Database["public"]["Enums"]["tipo_campo"]
        }
        Relationships: [
          {
            foreignKeyName: "producto_campos_producto_id_fkey"
            columns: ["producto_id"]
            isOneToOne: false
            referencedRelation: "productos"
            referencedColumns: ["id"]
          },
        ]
      }
      producto_imagenes: {
        Row: {
          alt: string
          creado_en: string
          id: string
          orden: number
          producto_id: string
          url: string
        }
        Insert: {
          alt?: string
          creado_en?: string
          id?: string
          orden?: number
          producto_id: string
          url: string
        }
        Update: {
          alt?: string
          creado_en?: string
          id?: string
          orden?: number
          producto_id?: string
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "producto_imagenes_producto_id_fkey"
            columns: ["producto_id"]
            isOneToOne: false
            referencedRelation: "productos"
            referencedColumns: ["id"]
          },
        ]
      }
      productos: {
        Row: {
          actualizado_en: string
          cantidad: number | null
          categoria_id: string | null
          creado_en: string
          cuidados: string | null
          descripcion: string | null
          destacado: boolean
          dias_confeccion: number | null
          edad_max: number | null
          edad_min: number | null
          estado: Database["public"]["Enums"]["estado_producto"]
          habilidades: string[]
          id: string
          materiales: string | null
          medidas: string | null
          nombre: string
          orden: number
          precio: number
          precio_antes: number | null
          resumen: string | null
          seo_descripcion: string | null
          seo_titulo: string | null
          slug: string
          stock: Database["public"]["Enums"]["estado_stock"]
        }
        Insert: {
          actualizado_en?: string
          cantidad?: number | null
          categoria_id?: string | null
          creado_en?: string
          cuidados?: string | null
          descripcion?: string | null
          destacado?: boolean
          dias_confeccion?: number | null
          edad_max?: number | null
          edad_min?: number | null
          estado?: Database["public"]["Enums"]["estado_producto"]
          habilidades?: string[]
          id?: string
          materiales?: string | null
          medidas?: string | null
          nombre: string
          orden?: number
          precio: number
          precio_antes?: number | null
          resumen?: string | null
          seo_descripcion?: string | null
          seo_titulo?: string | null
          slug: string
          stock?: Database["public"]["Enums"]["estado_stock"]
        }
        Update: {
          actualizado_en?: string
          cantidad?: number | null
          categoria_id?: string | null
          creado_en?: string
          cuidados?: string | null
          descripcion?: string | null
          destacado?: boolean
          dias_confeccion?: number | null
          edad_max?: number | null
          edad_min?: number | null
          estado?: Database["public"]["Enums"]["estado_producto"]
          habilidades?: string[]
          id?: string
          materiales?: string | null
          medidas?: string | null
          nombre?: string
          orden?: number
          precio?: number
          precio_antes?: number | null
          resumen?: string | null
          seo_descripcion?: string | null
          seo_titulo?: string | null
          slug?: string
          stock?: Database["public"]["Enums"]["estado_stock"]
        }
        Relationships: [
          {
            foreignKeyName: "productos_categoria_id_fkey"
            columns: ["categoria_id"]
            isOneToOne: false
            referencedRelation: "categorias"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      es_admin: { Args: never; Returns: boolean }
    }
    Enums: {
      estado_pedido:
        | "recibido"
        | "contactado"
        | "confirmado"
        | "en_confeccion"
        | "enviado"
        | "entregado"
        | "cancelado"
      estado_producto: "activo" | "inactivo" | "archivado"
      estado_stock: "disponible" | "por_encargo" | "agotado"
      tipo_campo: "texto" | "parrafo" | "opcion" | "color" | "numero"
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
    Enums: {
      estado_pedido: [
        "recibido",
        "contactado",
        "confirmado",
        "en_confeccion",
        "enviado",
        "entregado",
        "cancelado",
      ],
      estado_producto: ["activo", "inactivo", "archivado"],
      estado_stock: ["disponible", "por_encargo", "agotado"],
      tipo_campo: ["texto", "parrafo", "opcion", "color", "numero"],
    },
  },
} as const

