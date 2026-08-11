import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

import { getProductos } from "../services/producto_services";
import { getMarca } from "../services/marca_services";

import type { Producto } from "../types/products_type";
import type { Marca } from "../types/marca_type";

import ProductoCard from "../components/productos/ProductoCard";
import SEO from "../components/seo/SEO";

function CatalogoPage() {
  const [searchParams] = useSearchParams();

  const marcaIdParam = searchParams.get("marca");
  const marcaId = marcaIdParam ? Number(marcaIdParam) : undefined;

  const categoriaIdParam = searchParams.get("categoria");
  const categoriaId = categoriaIdParam ? Number(categoriaIdParam) : undefined;

  const [productos, setProductos] = useState<Producto[]>([]);
  const [marca, setMarca] = useState<Marca | null>(null);

  const [loading, setLoading] = useState(true);
  const [loadingMarca, setLoadingMarca] = useState(false);

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function cargarProductos() {
      try {
        setLoading(true);
        setError(null);

        const response = await getProductos({
          solo_activos: true,
          marca_id: marcaId,
          categoria_id: categoriaId,
          page: 1,
          limit: 20,
          orden: "nombre_asc",
        });

        setProductos(response.items);
      } catch (error) {
        console.error("❌ ERROR PRODUCTOS:", error);

        setError("No se pudieron cargar los productos.");
      } finally {
        setLoading(false);
      }
    }

    cargarProductos();
  }, [marcaId, categoriaId]);

  useEffect(() => {
    async function cargarMarca() {
      if (marcaId === undefined) {
        setMarca(null);
        return;
      }

      try {
        setLoadingMarca(true);

        const response = await getMarca(marcaId);

        setMarca(response);
      } catch (error) {
        console.error("❌ ERROR MARCA:", error);

        setMarca(null);
      } finally {
        setLoadingMarca(false);
      }
    }

    cargarMarca();
  }, [marcaId]);

  const tituloSEO =
    marcaId !== undefined && marca
      ? `Repuestos ${marca.nombre}`
      : categoriaId !== undefined
        ? "Catálogo de repuestos"
        : "Catálogo de repuestos";

  const descripcionSEO =
    marcaId !== undefined && marca
      ? `Consultá nuestro catálogo de repuestos ${marca.nombre}. Encontrá el producto que necesitás y realizá tu consulta.`
      : "Consultá nuestro catálogo de repuestos para vehículos. Encontrá productos, marcas y categorías disponibles.";

  return (
    <>
      {/* =========================
          HEADER
          ========================= */}
      <SEO title={tituloSEO} description={descripcionSEO} />

      <section className="border-b border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
          <Link
            to="/marcas"
            className="text-sm font-medium text-slate-500 transition hover:text-slate-900"
          >
            ← Volver a marcas
          </Link>

          <span className="mt-6 block text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 sm:mt-8 sm:text-sm">
            Catálogo
          </span>

          <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            {marcaId !== undefined
              ? loadingMarca
                ? "Cargando marca..."
                : marca
                  ? `Productos ${marca.nombre}`
                  : "Productos de esta marca"
              : "Todos nuestros productos"}
          </h1>

          <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg sm:leading-8">
            Encontrá el repuesto que necesitás.
          </p>
        </div>
      </section>

      {/* =========================
          PRODUCTOS
          ========================= */}

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        {loading && (
          <p className="text-sm text-slate-500 sm:text-base">
            Cargando productos...
          </p>
        )}

        {error && <p className="text-red-600">{error}</p>}

        {!loading && !error && (
          <>
            <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-slate-500 sm:text-base">
                {productos.length}{" "}
                {productos.length === 1 ? "producto" : "productos"}
              </p>

              {marcaId !== undefined && (
                <Link
                  to="/catalogo"
                  className="self-start text-sm font-semibold text-slate-900 hover:underline sm:self-auto"
                >
                  Ver todos
                </Link>
              )}
            </div>

            {productos.length === 0 ? (
              <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center sm:p-10">
                <h2 className="text-xl font-semibold text-slate-900">
                  No encontramos productos
                </h2>

                <p className="mt-2 text-sm leading-6 text-slate-500 sm:text-base">
                  No hay productos disponibles para esta marca.
                </p>

                <Link
                  to="/catalogo"
                  className="mt-6 inline-block font-semibold text-slate-900 hover:underline"
                >
                  Ver todo el catálogo →
                </Link>
              </div>
            ) : (
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
                {productos.map((producto) => (
                  <ProductoCard key={producto.id} producto={producto} />
                ))}
              </div>
            )}
          </>
        )}
      </section>
    </>
  );
}

export default CatalogoPage;
