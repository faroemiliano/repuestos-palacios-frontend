import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { getMediaUrl } from "../../services/api";
import { getProductosDestacados } from "../../services/producto_services";
import type { Producto } from "../../types/products_type";

function ProductosDestacados() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function cargarProductos() {
      try {
        const response = await getProductosDestacados();

        console.log("📦 RESPUESTA PRODUCTOS:", response);
        console.log(
          "📦 PRIMER PRODUCTO:",
          JSON.stringify(response.items[0], null, 2),
        );

        setProductos(response.items);
      } catch (error) {
        console.error("❌ ERROR:", error);
        setError("No se pudieron cargar los productos.");
      } finally {
        setLoading(false);
      }
    }

    cargarProductos();
  }, []);

  return (
    <section className="bg-white">
      <div className="mx-auto max-w-7xl px-6 py-16 sm:py-20 lg:py-24">
        {/* =========================
            HEADER
            ========================= */}

        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
              Productos
            </span>

            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Productos destacados
            </h2>

            <p className="mt-4 max-w-xl text-slate-600">
              Conocé algunos de nuestros repuestos.
            </p>
          </div>

          <Link
            to="/catalogo"
            className="text-sm font-semibold text-slate-900 transition hover:text-slate-600"
          >
            Ver catálogo →
          </Link>
        </div>

        {/* =========================
            ESTADOS
            ========================= */}

        {loading && (
          <p className="mt-10 text-slate-500">Cargando productos...</p>
        )}

        {error && <p className="mt-10 text-red-600">{error}</p>}

        {/* =========================
            PRODUCTOS
            ========================= */}

        {!loading && !error && (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {productos.map((producto) => (
              <article
                key={producto.id}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-white transition duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-lg"
              >
                {/* Imagen */}

                <div className="aspect-square bg-slate-100">
                  {(() => {
                    const imagen =
                      producto.imagenes?.find((imagen) => imagen.principal) ??
                      producto.imagenes?.[0];

                    if (!imagen) {
                      return (
                        <div className="flex h-full items-center justify-center text-sm text-slate-400">
                          Sin imagen
                        </div>
                      );
                    }

                    return (
                      <img
                        src={getMediaUrl(imagen.url)}
                        alt={producto.nombre}
                        className="h-full w-full object-contain p-6"
                      />
                    );
                  })()}
                </div>

                {/* Información */}

                <div className="p-5 sm:p-6">
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    {producto.codigo}
                  </p>

                  <h3 className="mt-2 text-lg font-semibold text-slate-900 sm:text-xl">
                    {producto.nombre}
                  </h3>

                  {producto.descripcion && (
                    <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-500">
                      {producto.descripcion}
                    </p>
                  )}

                  <Link
                    to={`/producto/${producto.slug}`}
                    className="mt-5 inline-block text-sm font-semibold text-slate-900 transition hover:text-slate-600"
                  >
                    Ver producto →
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default ProductosDestacados;
