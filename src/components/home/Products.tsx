import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { getMediaUrl } from "../../services/api";
import { getProductos } from "../../services/producto_services";
import type { Producto } from "../../types/products_type";
import Paginacion from "../paginacion/Paginacion";

function ProductosDestacados() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [pagina, setPagina] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function cargarProductos() {
      try {
        setLoading(true);
        setError(null);

        const response = await getProductos({
          destacado: true,
          solo_activos: true,
          page: pagina,
          limit: 6,
          orden: "nombre_asc",
        });

        setProductos(response.items);
        setTotalPaginas(response.total_paginas);
      } catch (error) {
        console.error("❌ ERROR CARGANDO PRODUCTOS DESTACADOS:", error);

        setError("No se pudieron cargar los productos.");
      } finally {
        setLoading(false);
      }
    }

    cargarProductos();
  }, [pagina]);

  function cambiarPagina(nuevaPagina: number) {
    if (nuevaPagina < 1 || nuevaPagina > totalPaginas) {
      return;
    }

    setPagina(nuevaPagina);
  }

  return (
    <section className="bg-white">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        {/* =========================
            HEADER
            ========================= */}

        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-red" />
              Nuestro catálogo
            </div>

            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
              Productos destacados
            </h2>

            <p className="mt-4 max-w-xl text-sm leading-6 text-slate-500 sm:text-base sm:leading-7">
              Una selección de nuestros principales repuestos y componentes
              eléctricos.
            </p>
          </div>

          <Link
            to="/catalogo"
            className="group inline-flex items-center gap-2 self-start text-sm font-semibold text-slate-950 transition hover:text-slate-600 sm:self-auto"
          >
            Ver catálogo
            <span className="transition-transform duration-200 group-hover:translate-x-1">
              →
            </span>
          </Link>
        </div>

        {/* =========================
            LOADING
            ========================= */}

        {loading && (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-white"
              >
                <div className="aspect-square animate-pulse bg-slate-100" />

                <div className="space-y-3 p-5 sm:p-6">
                  <div className="h-3 w-20 animate-pulse rounded bg-slate-100" />

                  <div className="h-6 w-3/4 animate-pulse rounded bg-slate-100" />

                  <div className="h-4 w-full animate-pulse rounded bg-slate-100" />

                  <div className="h-4 w-2/3 animate-pulse rounded bg-slate-100" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* =========================
            ERROR
            ========================= */}

        {error && (
          <div className="mt-10 rounded-2xl border border-red-100 bg-red-50 p-6">
            <p className="text-sm font-medium text-red-700">{error}</p>
          </div>
        )}

        {/* =========================
            PRODUCTOS
            ========================= */}

        {!loading && !error && (
          <>
            {productos.length === 0 ? (
              <div className="mt-10 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center">
                <p className="text-sm text-slate-500">
                  No hay productos destacados disponibles.
                </p>
              </div>
            ) : (
              <>
                <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {productos.map((producto) => {
                  const imagen =
                    producto.imagenes?.find((imagen) => imagen.principal) ??
                    producto.imagenes?.[0];

                  return (
                    <article
                      key={producto.id}
                      className="group overflow-hidden rounded-2xl border border-slate-200 bg-white transition duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-xl hover:shadow-slate-200/60"
                    >
                      {/* =====================
                          IMAGEN
                          ===================== */}

                      <Link
                        to={`/producto/${producto.slug}`}
                        className="block overflow-hidden bg-slate-50"
                      >
                        <div className="relative aspect-square">
                          {imagen ? (
                            <img
                              src={getMediaUrl(imagen.url)}
                              alt={producto.nombre}
                              loading="lazy"
                              className="h-full w-full object-contain p-8 transition duration-500 group-hover:scale-105 sm:p-10"
                            />
                          ) : (
                            <div className="flex h-full items-center justify-center">
                              <div className="text-center">
                                <div className="text-3xl">⚙️</div>

                                <p className="mt-2 text-xs font-medium text-slate-400">
                                  Sin imagen
                                </p>
                              </div>
                            </div>
                          )}

                          {/* ETIQUETA */}

                          <div className="absolute left-4 top-4 rounded-full border border-slate-200 bg-white/90 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-600 shadow-sm backdrop-blur">
                            Destacado
                          </div>
                        </div>
                      </Link>

                      {/* =====================
                          INFORMACIÓN
                          ===================== */}

                      <div className="p-5 sm:p-6">
                        <div className="flex items-center justify-between gap-4">
                          <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-slate-400">
                            Código {producto.codigo}
                          </p>

                          <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-slate-300" />
                        </div>

                        <h3 className="mt-3 text-lg font-bold tracking-tight text-slate-950 sm:text-xl">
                          {producto.nombre}
                        </h3>

                        {producto.descripcion && (
                          <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-500">
                            {producto.descripcion}
                          </p>
                        )}

                        <Link
                          to={`/producto/${producto.slug}`}
                          className="group/link mt-5 inline-flex items-center gap-2 text-sm font-semibold text-slate-950"
                        >
                          Ver producto
                          <span className="transition-transform duration-200 group-hover/link:translate-x-1">
                            →
                          </span>
                        </Link>
                      </div>
                    </article>
                  );
                  })}
                </div>

                {totalPaginas > 1 && (
                  <div className="mt-10">
                    <Paginacion
                      paginaActual={pagina}
                      totalPaginas={totalPaginas}
                      onCambiarPagina={cambiarPagina}
                    />
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>
    </section>
  );
}

export default ProductosDestacados;
