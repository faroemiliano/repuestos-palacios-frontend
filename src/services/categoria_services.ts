import { apiFetch } from "./api";

import type {
  Categoria,
  CategoriaCreate,
  CategoriaUpdate,
} from "../types/categoria_types";

import type { Marca } from "../types/marca_type";

export async function getCategorias(
  soloActivas: boolean = true,
): Promise<Categoria[]> {
  return apiFetch<Categoria[]>(`/categorias/?solo_activas=${soloActivas}`);
}

export async function getCategoriasRaiz(
  soloActivas: boolean = true,
): Promise<Categoria[]> {
  return apiFetch<Categoria[]>(
    `/categorias/raices?solo_activas=${soloActivas}`,
  );
}

export async function getCategoria(categoriaId: number): Promise<Categoria> {
  return apiFetch<Categoria>(`/categorias/${categoriaId}`);
}

export async function getMarcasPorCategoria(
  categoriaId: number,
): Promise<Marca[]> {
  return apiFetch<Marca[]>(`/categorias/${categoriaId}/marcas`);
}

export async function crearCategoria(
  data: CategoriaCreate,
): Promise<Categoria> {
  return apiFetch<Categoria>("/categorias/", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function actualizarCategoria(
  categoriaId: number,
  data: CategoriaUpdate,
): Promise<Categoria> {
  return apiFetch<Categoria>(`/categorias/${categoriaId}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function eliminarCategoria(categoriaId: number): Promise<void> {
  await apiFetch(`/categorias/${categoriaId}`, {
    method: "DELETE",
  });
}
