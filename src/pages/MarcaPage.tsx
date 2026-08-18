import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { getMarcas } from "../services/marca_services";
import type { Marca } from "../types/marca_type";

function MarcasPage() {
  const [marcas, setMarcas] = useState<Marca[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function cargarMarcas() {
      try {
        setLoading(true);
        setError(null);

        const response = await getMarcas(true);

        setMarcas(response);
      } catch (error) {
        console.error("Error cargando marcas:", error);

        setError("No se pudieron cargar las marcas.");
      } finally {
        setLoading(false);
      }
    }

    cargarMarcas();
  }, []);

  return (
    <main className="min-h-screen bg-slate-50">
      {/* =========================
          HERO
      ========================= */}

      <section className="relative overflow-hidden border-b border-slate-200 bg-slate-950">
        {/* Decoración */}

        <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-slate-800/40 blur-3xl" />

        <div className="pointer-events-none absolute -bottom-40 left-1/4 h-96 w-96 rounded-full bg-slate-800/30 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
          <div className="max-w-3xl">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-sm font-medium text-slate-400 transition hover:text-white"
            >
              <span>←</span>
              Volver al inicio
            </Link>

            <div className="mt-10 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
              <span className="h-1.5 w-1.5 rounded-full bg-white" />
              Marcas
            </div>

            <h1 className="mt-4 text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Marcas con las que trabajamos
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg sm:leading-8">
              Trabajamos con marcas reconocidas del mercado para ofrecer
              repuestos y componentes de calidad.
            </p>

            {!loading && !error && marcas.length > 0 && (
              <div className="mt-8 flex items-center gap-3 text-sm text-slate-400">
                <span className="flex h-8 min-w-8 items-center justify-center rounded-full bg-white/10 px-2 font-semibold text-white">
                  {marcas.length}
                </span>

                <span>
                  {marcas.length === 1
                    ? "marca disponible"
                    : "marcas disponibles"}
                </span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* =========================
          CONTENIDO
      ========================= */}

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
        {/* =========================
            LOADING
        ========================= */}

        {loading && (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
              <div
                key={item}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-white"
              >
                <div className="h-36 animate-pulse bg-slate-100" />

                <div className="p-6">
                  <div className="h-5 w-32 animate-pulse rounded bg-slate-200" />

                  <div className="mt-3 h-4 w-full animate-pulse rounded bg-slate-100" />

                  <div className="mt-2 h-4 w-2/3 animate-pulse rounded bg-slate-100" />

                  <div className="mt-6 h-4 w-28 animate-pulse rounded bg-slate-200" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* =========================
            ERROR
        ========================= */}

        {!loading && error && (
          <div className="rounded-2xl border border-red-200 bg-white p-8 text-center sm:p-12">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-600">
              !
            </div>

            <h2 className="mt-4 text-xl font-semibold text-slate-900">
              No pudimos cargar las marcas
            </h2>

            <p className="mt-2 text-sm text-slate-500">{error}</p>
          </div>
        )}

        {/* =========================
            SIN MARCAS
        ========================= */}

        {!loading && !error && marcas.length === 0 && (
          <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center sm:p-14">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-xl">
              —
            </div>

            <h2 className="mt-5 text-xl font-semibold text-slate-900">
              No hay marcas disponibles
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
              Actualmente no tenemos marcas disponibles para mostrar.
            </p>

            <Link
              to="/catalogo"
              className="mt-6 inline-flex rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Ver catálogo
            </Link>
          </div>
        )}

        {/* =========================
            MARCAS
        ========================= */}

        {!loading && !error && marcas.length > 0 && (
          <>
            <div className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                  Nuestro catálogo
                </span>

                <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
                  Elegí una marca
                </h2>
              </div>

              <p className="text-sm text-slate-500">
                Seleccioná una marca para ver sus productos.
              </p>
            </div>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {marcas.map((marca) => (
                <Link
                  key={marca.id}
                  to={`/catalogo?marca=${marca.id}`}
                  className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-xl"
                >
                  {/* Indicador superior */}

                  <div className="absolute left-0 right-0 top-0 h-1 origin-left scale-x-0 bg-slate-950 transition-transform duration-300 group-hover:scale-x-100" />

                  {/* Logo */}

                  <div className="flex h-40 items-center justify-center bg-slate-50 px-8 transition-colors duration-300 group-hover:bg-slate-100">
                    {marca.logo ? (
                      <img
                        src={marca.logo}
                        alt={marca.nombre}
                        loading="lazy"
                        className="max-h-20 max-w-[190px] object-contain grayscale transition duration-300 group-hover:grayscale-0"
                      />
                    ) : (
                      <span className="text-center text-xl font-bold tracking-tight text-slate-400 transition-colors group-hover:text-slate-700">
                        {marca.nombre}
                      </span>
                    )}
                  </div>

                  {/* Información */}

                  <div className="p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-lg font-semibold text-slate-950">
                          {marca.nombre}
                        </h3>

                        {marca.descripcion && (
                          <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-500">
                            {marca.descripcion}
                          </p>
                        )}
                      </div>

                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition-all duration-300 group-hover:bg-slate-950 group-hover:text-white">
                        →
                      </span>
                    </div>

                    <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4">
                      <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                        Ver productos
                      </span>

                      <span className="text-xs font-medium text-slate-400 transition group-hover:text-slate-950">
                        Explorar
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
      </section>

      {/* =========================
          CTA
      ========================= */}

      {!loading && !error && marcas.length > 0 && (
        <section className="border-t border-slate-200 bg-white">
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
            <div className="relative overflow-hidden rounded-3xl bg-slate-950 px-6 py-10 sm:px-10 sm:py-12 lg:px-14 lg:py-14">
              <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-slate-800/50 blur-3xl" />

              <div className="relative flex flex-col gap-8 sm:flex-row sm:items-center sm:justify-between">
                <div className="max-w-2xl">
                  <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                    Encontrá tu repuesto
                  </span>

                  <h2 className="mt-3 text-2xl font-bold tracking-tight text-white sm:text-3xl">
                    ¿Buscás un producto específico?
                  </h2>

                  <p className="mt-3 text-sm leading-6 text-slate-300 sm:text-base">
                    Explorá nuestro catálogo y encontrá el repuesto que
                    necesitás.
                  </p>
                </div>

                <Link
                  to="/catalogo"
                  className="group inline-flex shrink-0 items-center justify-center gap-3 rounded-xl bg-white px-6 py-3.5 text-sm font-semibold text-slate-950 shadow-lg transition hover:-translate-y-0.5 hover:bg-slate-100"
                >
                  Ver catálogo
                  <span className="transition-transform duration-200 group-hover:translate-x-1">
                    →
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}
    </main>
  );
}

export default MarcasPage;
