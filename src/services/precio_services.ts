import { apiFetch } from "./api";

export interface AumentoPrecio {
  productos_actualizados: number;
  porcentaje_aplicado: number;
  solo_activos: boolean;
}

export interface ActualizacionPrecio extends AumentoPrecio {
  id: number;
  admin_id: number;
  creado_en: string;
  detalles_guardados: boolean;
  deshecha_en: string | null;
}

export interface DeshacerAumentoRespuesta {
  actualizacion_id: number;
  productos_restaurados: number;
}

export function aplicarAumentoPrecios(data: {
  porcentaje: number;
  solo_activos: boolean;
}) {
  return apiFetch<AumentoPrecio>("/productos/precios/aumento", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function getHistorialPrecios() {
  return apiFetch<ActualizacionPrecio[]>("/productos/precios/historial");
}

export function deshacerAumentoPrecios(actualizacionId: number) {
  return apiFetch<DeshacerAumentoRespuesta>(
    `/productos/precios/historial/${actualizacionId}/deshacer`,
    { method: "POST" },
  );
}
