import { apiFetch } from "./api";
import type { Categoria } from "../types/categoria_types";

export async function getCategoriasRaiz(): Promise<Categoria[]> {
  return apiFetch<Categoria[]>("/categorias/raices");
}
