export interface ProductoCategoria {
  id: number;
  nombre: string;
}

export interface ProductoMarca {
  id: number;
  nombre: string;
}

export interface ProductoImagen {
  id: number;
  url: string;
  orden: number;
  principal: boolean;
}

export interface ProductoEspecificacion {
  id: number;
  nombre: string;
  valor: string;
  orden: number;
}

export interface Producto {
  id: number;
  nombre: string;
  slug: string;
  codigo: string;
  descripcion: string | null;

  categoria_id: number;
  marca_id: number;

  activo: boolean;
  destacado: boolean;

  creado_en: string;
  actualizado_en: string;

  categoria?: ProductoCategoria;
  marca?: ProductoMarca;
  imagenes: ProductoImagen[];
  especificaciones: ProductoEspecificacion[];
}

export interface ProductosResponse {
  items: Producto[];
  total: number;
  page: number;
  limit: number;
  total_paginas: number;
}
