import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { apiFetch } from "../../services/api";
import type { Categoria } from "../../types/categoria_types";

function AdminCategoriasPage() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);

  const [categoriasAbiertas, setCategoriasAbiertas] = useState<Set<number>>(
    new Set(),
  );

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function cargarCategorias() {
    try {
      setLoading(true);
      setError(null);

      const response = await apiFetch<Categoria[]>(
        "/categorias/?solo_activas=false",
      );

      setCategorias(response);
    } catch (error) {
      console.error("❌ ERROR CARGANDO CATEGORÍAS:", error);

      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("No se pudieron cargar las categorías.");
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    cargarCategorias();
  }, []);

  function toggleCategoria(categoriaId: number) {
    setCategoriasAbiertas((actuales) => {
      const nuevas = new Set(actuales);

      if (nuevas.has(categoriaId)) {
        nuevas.delete(categoriaId);
      } else {
        nuevas.add(categoriaId);
      }

      return nuevas;
    });
  }

  async function handleCambiarEstado(categoria: Categoria) {
    if (
      categoria.activo
      && !window.confirm(
        `Desactivar ${categoria.nombre} también desactivará todos sus productos asociados. Después podrás reactivarlos uno por uno. ¿Deseás continuar?`,
      )
    ) {
      return;
    }

    try {
      await apiFetch(`/categorias/${categoria.id}`, {
        method: "PUT",
        body: JSON.stringify({
          activo: !categoria.activo,
        }),
      });

      setCategorias((categoriasActuales) =>
        categoriasActuales.map((item) =>
          item.id === categoria.id
            ? {
                ...item,
                activo: !item.activo,
              }
            : item,
        ),
      );
    } catch (error) {
      console.error("❌ ERROR CAMBIANDO ESTADO:", error);

      setError("No se pudo cambiar el estado de la categoría.");
    }
  }

  function obtenerHijas(categoriaId: number): Categoria[] {
    return categorias.filter(
      (categoria) => categoria.categoria_padre_id === categoriaId,
    );
  }

  const categoriasRaiz = categorias.filter(
    (categoria) => categoria.categoria_padre_id === null,
  );

  if (loading) {
    return (
      <main className="mx-auto max-w-7xl px-6 py-10">
        <p className="text-sm text-slate-500">Cargando categorías...</p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-7xl px-6 py-10">
      {/* HEADER */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Categorías
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Administrá las categorías principales y sus tipos de producto.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link
            to="/admin/categorias/nueva"
            className="rounded-lg bg-slate-900 px-5 py-3 text-center text-sm font-semibold text-white transition hover:bg-slate-700"
          >
            Nueva categoría o tipo
          </Link>
        </div>
      </div>

      {/* ERROR */}

      {error && (
        <div className="mt-6 rounded-lg bg-red-50 p-4 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* LISTADO */}

      <div className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white">
        {categoriasRaiz.length === 0 ? (
          <div className="p-10 text-center">
            <h2 className="text-lg font-semibold text-slate-900">
              No hay categorías
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Todavía no hay categorías cargadas.
            </p>

            <Link
              to="/admin/categorias/nueva"
              className="mt-5 inline-block text-sm font-semibold text-slate-900 hover:underline"
            >
              Crear primera categoría →
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-slate-200">
            {categoriasRaiz.map((categoria) => {
              const hijas = obtenerHijas(categoria.id);

              const abierta = categoriasAbiertas.has(categoria.id);

              return (
                <div key={categoria.id}>
                  {/* CATEGORÍA PADRE */}

                  <div className={`flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between ${!categoria.activo ? "bg-red-50/80" : ""}`}>
                    <div className="flex items-center gap-4">
                      {/* BOTÓN EXPANDIR */}

                      {hijas.length > 0 ? (
                        <button
                          type="button"
                          onClick={() => toggleCategoria(categoria.id)}
                          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
                          aria-label={
                            abierta
                              ? "Ocultar subcategorías"
                              : "Mostrar subcategorías"
                          }
                        >
                          <span
                            className={`transition-transform ${
                              abierta ? "rotate-90" : ""
                            }`}
                          >
                            ▶
                          </span>
                        </button>
                      ) : (
                        <div className="h-9 w-9 shrink-0" />
                      )}

                      {/* IMAGEN */}

                      <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-slate-100">
                        {categoria.imagen ? (
                          <img
                            src={categoria.imagen}
                            alt={categoria.nombre}
                            className="h-full w-full object-contain p-2"
                          />
                        ) : (
                          <span className="text-lg font-bold text-slate-400">
                            {categoria.nombre.charAt(0).toUpperCase()}
                          </span>
                        )}
                      </div>

                      {/* INFORMACIÓN */}

                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h2 className="font-semibold text-slate-900">
                            {categoria.nombre}
                          </h2>

                          <span
                            className={`rounded-full px-2 py-1 text-xs font-semibold ${
                              categoria.activo
                                ? "bg-green-50 text-green-700"
                                : "bg-red-50 text-red-600"
                            }`}
                          >
                            {categoria.activo ? "Activa" : "Inactiva"}
                          </span>

                          {hijas.length > 0 && (
                            <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-medium text-slate-500">
                              {hijas.length}{" "}
                              {hijas.length === 1
                                ? "tipo"
                                : "tipos"}
                            </span>
                          )}
                        </div>

                        <p className="mt-1 text-xs text-slate-400">
                          /{categoria.slug}
                        </p>

                        {categoria.descripcion && (
                          <p className="mt-2 line-clamp-1 text-sm text-slate-500">
                            {categoria.descripcion}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* ACCIONES */}

                    <div className="flex flex-wrap gap-2 sm:pl-12">
                      <Link
                        to={`/admin/categorias/${categoria.id}/editar`}
                        className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                      >
                        Editar
                      </Link>

                      <button
                        type="button"
                        onClick={() => handleCambiarEstado(categoria)}
                        className={`rounded-lg border px-4 py-2 text-sm font-semibold transition ${
                          categoria.activo
                            ? "border-red-200 text-red-600 hover:bg-red-50"
                            : "border-green-200 text-green-700 hover:bg-green-50"
                        }`}
                      >
                        {categoria.activo ? "Desactivar" : "Activar"}
                      </button>
                    </div>
                  </div>

                  {/* TIPOS */}

                  {abierta && hijas.length > 0 && (
                    <div className="border-t border-slate-100 bg-slate-50/50">
                      {hijas.map((hija) => (
                        <div
                          key={hija.id}
                          className={`flex flex-col gap-4 border-b border-slate-100 px-5 py-4 pl-16 last:border-b-0 sm:flex-row sm:items-center sm:justify-between sm:pl-24 ${!hija.activo ? "bg-red-100/70" : ""}`}
                        >
                          <div className="flex items-center gap-3">
                            {/* INDICADOR */}

                            <span className="text-slate-300">└</span>

                            {/* IMAGEN */}

                            <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-white">
                              {hija.imagen ? (
                                <img
                                  src={hija.imagen}
                                  alt={hija.nombre}
                                  className="h-full w-full object-contain p-2"
                                />
                              ) : (
                                <span className="text-sm font-bold text-slate-400">
                                  {hija.nombre.charAt(0).toUpperCase()}
                                </span>
                              )}
                            </div>

                            {/* INFORMACIÓN */}

                            <div>
                              <div className="flex flex-wrap items-center gap-2">
                                <p className="text-sm font-semibold text-slate-800">
                                  {hija.nombre}
                                </p>

                                <span
                                  className={`rounded-full px-2 py-1 text-xs font-semibold ${
                                    hija.activo
                                      ? "bg-green-50 text-green-700"
                                      : "bg-red-50 text-red-600"
                                  }`}
                                >
                                  {hija.activo ? "Activa" : "Inactiva"}
                                </span>
                              </div>

                              <p className="mt-1 text-xs text-slate-400">
                                /{hija.slug}
                              </p>

                              <p className="mt-1 text-xs font-medium text-slate-500">
                                Tipo de {categoria.nombre}
                              </p>
                            </div>
                          </div>

                          {/* ACCIONES HIJA */}

                          <div className="flex flex-wrap gap-2">
                            <Link
                              to={`/admin/categorias/${hija.id}/editar`}
                              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-white"
                            >
                              Editar
                            </Link>

                            <button
                              type="button"
                              onClick={() => handleCambiarEstado(hija)}
                              className={`rounded-lg border px-4 py-2 text-sm font-semibold transition ${
                                hija.activo
                                  ? "border-red-200 text-red-600 hover:bg-red-50"
                                  : "border-green-200 text-green-700 hover:bg-green-50"
                              }`}
                            >
                              {hija.activo ? "Desactivar" : "Activar"}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}

export default AdminCategoriasPage;
