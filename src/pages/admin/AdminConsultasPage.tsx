import { useEffect, useMemo, useState } from "react";

import { getConsultas } from "../../services/consulta_services";
import { getProductoById } from "../../services/producto_services";
import type { Consulta, EstadoConsulta } from "../../types/consulta_type";

const ESTADOS: Record<EstadoConsulta, string> = {
  PENDIENTE: "bg-amber-50 text-amber-800 ring-amber-200",
  CONTACTADO: "bg-sky-50 text-sky-800 ring-sky-200",
  CERRADO: "bg-slate-100 text-slate-700 ring-slate-200",
};

function formatearFecha(fecha: string): string {
  return new Intl.DateTimeFormat("es-AR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(fecha));
}

function AdminConsultasPage() {
  const [consultas, setConsultas] = useState<Consulta[]>([]);
  const [codigosProducto, setCodigosProducto] = useState<Record<number, string>>(
    {},
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function cargarConsultas() {
      try {
        setLoading(true);
        setError(null);

        const response = await getConsultas();

        setConsultas(response);

        const productoIds = [
          ...new Set(
            response
              .map((consulta) => consulta.producto_id)
              .filter((productoId): productoId is number => productoId !== null),
          ),
        ];

        const productos = await Promise.allSettled(
          productoIds.map(async (productoId) => {
            const producto = await getProductoById(productoId);

            return [productoId, producto.codigo] as const;
          }),
        );

        setCodigosProducto(
          Object.fromEntries(
            productos.flatMap((resultado) =>
              resultado.status === "fulfilled" ? [resultado.value] : [],
            ),
          ),
        );
      } catch (error) {
        console.error("ERROR CARGANDO CONSULTAS:", error);
        setError("No se pudieron cargar las consultas recibidas.");
      } finally {
        setLoading(false);
      }
    }

    cargarConsultas();
  }, []);

  const consultasOrdenadas = useMemo(
    () =>
      [...consultas].sort(
        (a, b) =>
          new Date(b.creado_en).getTime() - new Date(a.creado_en).getTime(),
      ),
    [consultas],
  );

  return (
    <main className="mx-auto max-w-5xl py-2">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
            Administración
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
            Mensajes y consultas
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Revisá los mensajes que enviaron los clientes desde el sitio.
          </p>
        </div>

        {!loading && (
          <span className="w-fit rounded-full bg-brand-red-soft px-3 py-1.5 text-sm font-semibold text-brand-red-dark">
            {consultas.length} {consultas.length === 1 ? "consulta" : "consultas"}
          </span>
        )}
      </div>

      {loading && (
        <div className="mt-8 space-y-4">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="h-40 animate-pulse rounded-2xl border border-slate-200 bg-white"
            />
          ))}
        </div>
      )}

      {error && (
        <div className="mt-8 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {!loading && !error && consultasOrdenadas.length === 0 && (
        <div className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
          <p className="text-lg font-semibold text-slate-900">
            Todavía no hay consultas
          </p>
          <p className="mt-2 text-sm text-slate-500">
            Los mensajes enviados desde el formulario de contacto aparecerán acá.
          </p>
        </div>
      )}

      {!loading && !error && consultasOrdenadas.length > 0 && (
        <div className="mt-8 space-y-4">
          {consultasOrdenadas.map((consulta) => (
            <article
              key={consulta.id}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-lg font-bold text-slate-900">
                      {consulta.nombre}
                    </h2>
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${ESTADOS[consulta.estado]}`}
                    >
                      {consulta.estado}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-slate-500">
                    Recibida el {formatearFecha(consulta.creado_en)}
                  </p>
                </div>

                {consulta.producto_id && (
                  <span className="w-fit rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600">
                    {codigosProducto[consulta.producto_id]
                      ? `Código ${codigosProducto[consulta.producto_id]}`
                      : "Código de producto no disponible"}
                  </span>
                )}
              </div>

              <div className="mt-5 grid gap-3 border-y border-slate-100 py-4 text-sm sm:grid-cols-2">
                <a
                  href={`tel:${consulta.telefono}`}
                  className="font-medium text-slate-700 transition hover:text-brand-red"
                >
                  Teléfono: {consulta.telefono}
                </a>
                {consulta.email ? (
                  <a
                    href={`mailto:${consulta.email}`}
                    className="break-all font-medium text-slate-700 transition hover:text-brand-red"
                  >
                    Email: {consulta.email}
                  </a>
                ) : (
                  <span className="text-slate-400">Sin email informado</span>
                )}
              </div>

              <p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-slate-700">
                {consulta.mensaje}
              </p>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}

export default AdminConsultasPage;
