import { apiFetch } from "./api";
import type { Marca } from "../types/marca_type";

export async function getMarcas(soloActivas: boolean = true): Promise<Marca[]> {
  return apiFetch(`/marcas/?solo_activas=${soloActivas}`);
}

export async function getMarca(id: number): Promise<Marca> {
  return apiFetch(`/marcas/${id}`);
}

export async function getMarcaBySlug(slug: string): Promise<Marca> {
  return apiFetch(`/marcas/slug/${slug}`);
}
