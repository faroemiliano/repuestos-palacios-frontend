import { apiFetch } from "./api";

import type { Consulta, ConsultaCreate } from "../types/consulta_type";

export async function getConsultas(): Promise<Consulta[]> {
  return apiFetch<Consulta[]>("/consultas/");
}

export async function crearConsulta(data: ConsultaCreate): Promise<Consulta> {
  return apiFetch("/consultas/", {
    method: "POST",
    body: JSON.stringify(data),
  });
}
