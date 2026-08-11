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
