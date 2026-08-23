export interface ProductoCategoria {
  id: number;
  nombre: string;
}

export interface ProductoMarca {
  id: number;
  nombre: string;
}

export interface ProductoTipo {
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
  equivalencias: string | null;
  precio: number | null;

  categoria_id: number;
  tipo_id: number;
  linea_id: number | null;
  marca_id: number;

  activo: boolean;
  destacado: boolean;

  creado_en: string;
  actualizado_en: string;

  categoria?: ProductoCategoria;
  tipo?: ProductoTipo;
  linea?: ProductoCategoria;
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
