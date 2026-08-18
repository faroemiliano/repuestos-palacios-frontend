import { apiFetch } from "./api";

import type { Marca, MarcaCreate, MarcaUpdate } from "../types/marca_type";

export async function getMarcas(soloActivas: boolean = true): Promise<Marca[]> {
  return apiFetch<Marca[]>(`/marcas/?solo_activas=${soloActivas}`);
}

export async function getMarcasPorCategoria(
  categoriaId: number,
  soloActivas: boolean = true,
): Promise<Marca[]> {
  return apiFetch<Marca[]>(
    `/marcas/categoria/${categoriaId}?solo_activas=${soloActivas}`,
  );
}

export async function getMarca(marcaId: number): Promise<Marca> {
  return apiFetch<Marca>(`/marcas/${marcaId}`);
}

export async function crearMarca(data: MarcaCreate): Promise<Marca> {
  return apiFetch<Marca>("/marcas/", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function actualizarMarca(
  marcaId: number,
  data: MarcaUpdate,
): Promise<Marca> {
  return apiFetch<Marca>(`/marcas/${marcaId}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function eliminarMarca(marcaId: number): Promise<void> {
  await apiFetch(`/marcas/${marcaId}`, {
    method: "DELETE",
  });
}
