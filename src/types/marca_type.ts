export interface Marca {
  id: number;
  nombre: string;
  slug: string;
  descripcion: string | null;
  logo: string | null;
  activo: boolean;
  creado_en: string;
  actualizado_en: string;
}

export interface MarcaCreate {
  nombre: string;
  descripcion?: string | null;
  logo?: string | null;
  activo?: boolean;
}

export interface MarcaUpdate {
  nombre?: string;
  descripcion?: string | null;
  logo?: string | null;
  activo?: boolean;
}
