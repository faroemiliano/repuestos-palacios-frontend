import { apiFetch } from "./api";

import type { Producto, ProductosResponse } from "../types/products_type";

interface GetProductosParams {
  buscar?: string;
  categoria_id?: number;
  marca_id?: number;
  destacado?: boolean;
  solo_activos?: boolean;
  page?: number;
  limit?: number;
  orden?: string;
}

export async function getProductos(
  params: GetProductosParams = {},
): Promise<ProductosResponse> {
  const searchParams = new URLSearchParams();

  if (params.buscar) {
    searchParams.set("buscar", params.buscar);
  }

  if (params.categoria_id !== undefined) {
    searchParams.set("categoria_id", String(params.categoria_id));
  }

  if (params.marca_id !== undefined) {
    searchParams.set("marca_id", String(params.marca_id));
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

export async function getProductosDestacados(): Promise<ProductosResponse> {
  return getProductos({
    destacado: true,
    solo_activos: true,
    page: 1,
    limit: 8,
    orden: "nombre_asc",
  });
}

export async function getProductoBySlug(slug: string): Promise<Producto> {
  return apiFetch<Producto>(`/productos/slug/${slug}`);
}
