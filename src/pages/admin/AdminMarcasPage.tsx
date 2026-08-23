import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { getMarcas, actualizarMarca } from "../../services/marca_services";

import type { Marca } from "../../types/marca_type";

function AdminMarcasPage() {
  const [marcas, setMarcas] = useState<Marca[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function cargarMarcas() {
    try {
      setLoading(true);
      setError(null);

      const response = await getMarcas(false);

      setMarcas(response);
    } catch (error) {
      console.error("❌ ERROR CARGANDO MARCAS:", error);

      setError("No se pudieron cargar las marcas.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    cargarMarcas();
  }, []);

  async function handleCambiarEstado(marcaId: number, activo: boolean) {
    try {
      await actualizarMarca(marcaId, {
        activo,
      });

      setMarcas((marcasActuales) =>
        marcasActuales.map((marca) =>
          marca.id === marcaId
            ? {
                ...marca,
                activo,
              }
            : marca,
        ),
      );
    } catch (error) {
      console.error("❌ ERROR CAMBIANDO ESTADO:", error);

      setError(
        activo
          ? "No se pudo activar la marca."
          : "No se pudo desactivar la marca.",
      );
    }
  }

  if (loading) {
    return (
      <main className="mx-auto max-w-7xl px-6 py-12">
        <p className="text-sm text-slate-500">Cargando marcas...</p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-7xl px-6 py-10">
      {/* HEADER */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Marcas comerciales
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Administrá las marcas comerciales de los productos. Las líneas
            técnicas (BOSCH, HITACHI, etc.) se seleccionan al crear o editar
            cada producto.
          </p>
        </div>

        <Link
          to="/admin/marcas/nueva"
          className="rounded-lg bg-slate-900 px-5 py-3 text-center text-sm font-semibold text-white transition hover:bg-slate-700"
        >
          + Nueva marca comercial
        </Link>
      </div>

      {/* ERROR */}

      {error && (
        <div className="mt-6 rounded-lg bg-red-50 p-4 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* LISTADO */}

      <div className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white">
        {marcas.length === 0 ? (
          <div className="p-10 text-center">
            <h2 className="text-lg font-semibold text-slate-900">
              No hay marcas
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Todavía no agregaste ninguna marca.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-200">
            {marcas.map((marca) => (
              <div
                key={marca.id}
                className="flex flex-col gap-5 p-6 sm:flex-row sm:items-center sm:justify-between"
              >
                {/* INFORMACIÓN */}

                <div className="flex items-center gap-4">
                  {/* LOGO */}

                  <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-slate-100">
                    {marca.logo ? (
                      <img
                        src={marca.logo}
                        alt={marca.nombre}
                        className="max-h-12 max-w-12 object-contain"
                      />
                    ) : (
                      <span className="text-lg font-bold text-slate-400">
                        {marca.nombre.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>

                  {/* DATOS */}

                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <h2 className="font-semibold text-slate-900">
                        {marca.nombre}
                      </h2>

                      <span
                        className={
                          marca.activo
                            ? "rounded-full bg-green-50 px-2.5 py-1 text-xs font-semibold text-green-700"
                            : "rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-500"
                        }
                      >
                        {marca.activo ? "Activa" : "Inactiva"}
                      </span>
                    </div>

                    {marca.descripcion && (
                      <p className="mt-1 max-w-xl text-sm text-slate-500">
                        {marca.descripcion}
                      </p>
                    )}

                    <p className="mt-1 text-xs text-slate-400">/{marca.slug}</p>
                  </div>
                </div>

                {/* ACCIONES */}

                <div className="flex gap-2">
                  <Link
                    to={`/admin/marcas/${marca.id}/editar`}
                    className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                  >
                    Editar
                  </Link>

                  {marca.activo ? (
                    <button
                      type="button"
                      onClick={() => handleCambiarEstado(marca.id, false)}
                      className="rounded-lg border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50"
                    >
                      Desactivar
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleCambiarEstado(marca.id, true)}
                      className="rounded-lg border border-green-200 px-4 py-2 text-sm font-semibold text-green-700 transition hover:bg-green-50"
                    >
                      Activar
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

export default AdminMarcasPage;
