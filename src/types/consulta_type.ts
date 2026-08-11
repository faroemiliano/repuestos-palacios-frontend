export type EstadoConsulta = "PENDIENTE" | "CONTACTADO" | "CERRADO";

export interface ConsultaCreate {
  producto_id?: number | null;
  nombre: string;
  telefono: string;
  email?: string | null;
  mensaje: string;
}

export interface Consulta {
  id: number;
  producto_id: number | null;
  nombre: string;
  telefono: string;
  email: string | null;
  mensaje: string;
  estado: EstadoConsulta;
  creado_en: string;
  actualizado_en: string;
}
