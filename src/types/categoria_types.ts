export interface Categoria {
  id: number;
  nombre: string;
  slug: string;
  descripcion: string | null;
  imagen: string | null;
  activo: boolean;
  categoria_padre_id: number | null;
  creado_en: string;
  actualizado_en: string;
}

export interface CategoriaCreate {
  nombre: string;
  descripcion?: string | null;
  imagen?: string | null;
  activo: boolean;
  categoria_padre_id?: number | null;
}

export interface CategoriaUpdate {
  nombre?: string;
  descripcion?: string | null;
  imagen?: string | null;
  activo?: boolean;
  categoria_padre_id?: number | null;
}
