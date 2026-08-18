import { apiFetch } from "./api";

import type {
  Producto,
  ProductoCategoria,
  ProductoMarca,
  ProductoTipo,
  ProductosResponse,
} from "../types/products_type";

interface GetProductosParams {
  buscar?: string;
  categoria_id?: number;
  tipo_id?: number;
  marca_id?: number;
  linea_id?: number;
  destacado?: boolean;
  solo_activos?: boolean;
  page?: number;
  limit?: number;
  orden?: string;
}

export async function getCategoriasFiltro(): Promise<ProductoCategoria[]> {
  return apiFetch<ProductoCategoria[]>("/productos/filtros/categorias");
}

export async function getTiposPorCategoria(
  categoriaId: number,
): Promise<ProductoTipo[]> {
  return apiFetch<ProductoTipo[]>(
    `/productos/filtros/categorias/${categoriaId}/tipos`,
  );
}

export async function getMarcasPorCategoriaYTipo(
  categoriaId: number,
  tipoId: number,
): Promise<ProductoMarca[]> {
  return apiFetch<ProductoMarca[]>(
    `/productos/filtros/categorias/${categoriaId}/tipos/${tipoId}/marcas`,
  );
}

export async function getLineasPorCategoriaYTipo(
  categoriaId: number,
  tipoId: number,
): Promise<ProductoMarca[]> {
  return apiFetch<ProductoMarca[]>(
    `/productos/filtros/categorias/${categoriaId}/tipos/${tipoId}/lineas`,
  );
}

// =========================================================
// OBTENER PRODUCTOS
// =========================================================

export async function getProductos(
  params: GetProductosParams = {},
): Promise<ProductosResponse> {
  const searchParams = new URLSearchParams();

  if (params.buscar?.trim()) {
    searchParams.set("buscar", params.buscar.trim());
  }

  if (params.categoria_id !== undefined) {
    searchParams.set("categoria_id", String(params.categoria_id));
  }

  if (params.tipo_id !== undefined) {
    searchParams.set("tipo_id", String(params.tipo_id));
  }

  if (params.marca_id !== undefined) {
    searchParams.set("marca_id", String(params.marca_id));
  }

  if (params.linea_id !== undefined) {
    searchParams.set("linea_id", String(params.linea_id));
  }

  if (params.destacado !== undefined) {
    searchParams.set("destacado", String(params.destacado));
  }

  if (params.solo_activos !== undefined) {
    searchParams.set("solo_activos", String(params.solo_activos));
  }

  if (params.page !== undefined) {
    searchParams.set("page", String(params.page));
  }

  if (params.limit !== undefined) {
    searchParams.set("limit", String(params.limit));
  }

  if (params.orden) {
    searchParams.set("orden", params.orden);
  }

  const query = searchParams.toString();

  const endpoint = query ? `/productos/?${query}` : "/productos/";

  return apiFetch<ProductosResponse>(endpoint);
}

// =========================================================
// PRODUCTOS DESTACADOS
// =========================================================

export async function getProductosDestacados(): Promise<ProductosResponse> {
  return getProductos({
    destacado: true,
    solo_activos: true,
    page: 1,
    limit: 8,
    orden: "nombre_asc",
  });
}

// =========================================================
// PRODUCTO POR SLUG
// =========================================================

export async function getProductoBySlug(slug: string): Promise<Producto> {
  return apiFetch<Producto>(`/productos/slug/${encodeURIComponent(slug)}`);
}

// =========================================================
// PRODUCTO POR ID
// =========================================================

export async function getProductoById(id: number): Promise<Producto> {
  return apiFetch<Producto>(`/productos/${id}`);
}

// =========================================================
// ACTUALIZAR PRODUCTO
// =========================================================

export async function updateProducto(
  id: number,
  data: {
    nombre?: string;
    slug?: string;
    codigo?: string;
    descripcion?: string | null;
    precio?: number | null;
    categoria_id?: number;
    tipo_id?: number;
    linea_id?: number | null;
    marca_id?: number;
    activo?: boolean;
    destacado?: boolean;
  },
): Promise<Producto> {
  return apiFetch<Producto>(`/productos/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

// =========================================================
// ELIMINAR PRODUCTO
// =========================================================

export async function deleteProducto(id: number): Promise<void> {
  await apiFetch<void>(`/productos/${id}`, {
    method: "DELETE",
  });
}
