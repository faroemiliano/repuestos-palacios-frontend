import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import { getMediaUrl } from "../services/api";
import { getProductoBySlug } from "../services/producto_services";
import type { Producto } from "../types/products_type";
import FormularioConsulta from "../components/consulta/FormularioConsulta";
import SEO from "../components/seo/SEO";

function ProductoPage() {
  const { slug } = useParams<{ slug: string }>();

  const [producto, setProducto] = useState<Producto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [mostrarFormulario, setMostrarFormulario] = useState(false);

  const [imagenSeleccionada, setImagenSeleccionada] = useState<string | null>(
    null,
  );

  useEffect(() => {
    async function cargarProducto() {
      if (!slug) {
        setError("Producto no encontrado.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const response = await getProductoBySlug(slug);

        setProducto(response);

        const imagenPrincipal =
          response.imagenes?.find((imagen) => imagen.principal) ??
          response.imagenes?.[0];

        if (imagenPrincipal) {
          setImagenSeleccionada(imagenPrincipal.url);
        }
      } catch (error) {
        console.error(error);
        setError("No se pudo cargar el producto.");
      } finally {
        setLoading(false);
      }
    }

    cargarProducto();
  }, [slug]);

  // =========================
  // LOADING
  // =========================

  if (loading) {
    return (
      <main className="mx-auto max-w-7xl px-6 py-20">
        <p className="text-slate-500">Cargando producto...</p>
      </main>
    );
  }

  // =========================
  // ERROR
  // =========================

  if (error || !producto) {
    return (
      <main className="mx-auto max-w-7xl px-6 py-20">
        <h1 className="text-2xl font-bold text-slate-900">
          Producto no encontrado
        </h1>

        <p className="mt-3 text-slate-500">
          El producto que estás buscando no existe o no está disponible.
        </p>

        <Link
          to="/catalogo"
          className="mt-6 inline-block font-semibold text-slate-900 hover:underline"
        >
          ← Volver al catálogo
        </Link>
      </main>
    );
  }

  // =========================
  // IMÁGENES
  // =========================

  const imagenes = producto.imagenes ?? [];

  const imagenPrincipal =
    producto.imagenes?.find((imagen) => imagen.principal) ??
    producto.imagenes?.[0];

  const imagenActual = imagenSeleccionada ?? imagenPrincipal?.url ?? null;

  const tituloSEO = producto.marca
    ? `${producto.nombre} ${producto.marca.nombre}`
    : producto.nombre;

  const descripcionSEO = producto.descripcion
    ? `${producto.nombre}${producto.marca ? ` ${producto.marca.nombre}` : ""}. ${producto.descripcion}`
    : `Consultá por ${producto.nombre}${producto.marca ? ` ${producto.marca.nombre}` : ""} en Repuestos Palacios. Consultá disponibilidad y precio.`;

  const canonicalSEO = `${window.location.origin}/producto/${producto.slug}`;

  const productoSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: producto.nombre,
    description: producto.descripcion ?? undefined,
    sku: producto.codigo,
    url: canonicalSEO,

    ...(imagenPrincipal?.url && {
      image: [getMediaUrl(imagenPrincipal.url)],
    }),

    ...(producto.marca && {
      brand: {
        "@type": "Brand",
        name: producto.marca.nombre,
      },
    }),

    ...(producto.categoria && {
      category: producto.categoria.nombre,
    }),
  };
  // =========================
  // PÁGINA
  // =========================

  return (
    <main className="mx-auto max-w-7xl px-6 py-12">
      {/* Volver */}
      <SEO
        title={tituloSEO}
        description={descripcionSEO}
        image={imagenPrincipal?.url}
        canonical={canonicalSEO}
        type="product"
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(productoSchema),
        }}
      />

      <Link
        to="/catalogo"
        className="text-sm font-medium text-slate-500 transition hover:text-slate-900"
      >
        ← Volver al catálogo
      </Link>

      {/* Producto */}

      <div className="mt-8 grid gap-12 lg:grid-cols-2">
        {/* =========================
            GALERÍA
            ========================= */}

        <div>
          {/* Imagen principal */}

          <div className="overflow-hidden rounded-3xl border border-slate-200 bg-slate-50">
            <div className="aspect-square">
              {imagenActual ? (
                <img
                  src={imagenActual ? getMediaUrl(imagenActual) : undefined}
                  alt={producto.nombre}
                  className="h-full w-full object-contain p-8"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-slate-400">
                  Sin imagen
                </div>
              )}
            </div>
          </div>

          {/* Miniaturas */}

          {imagenes.length > 1 && (
            <div className="mt-4 grid grid-cols-4 gap-3 sm:grid-cols-5">
              {imagenes.map((imagen) => {
                const seleccionada = imagen.url === imagenActual;

                return (
                  <button
                    key={imagen.id}
                    type="button"
                    onClick={() => setImagenSeleccionada(imagen.url)}
                    className={`aspect-square overflow-hidden rounded-xl border bg-slate-50 transition ${
                      seleccionada
                        ? "border-slate-900 ring-2 ring-slate-900"
                        : "border-slate-200 hover:border-slate-400"
                    }`}
                  >
                    <img
                      src={getMediaUrl(imagen.url)}
                      alt={producto.nombre}
                      className="h-full w-full object-contain p-2"
                    />
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* =========================
            INFORMACIÓN
            ========================= */}

        <div className="flex flex-col justify-center">
          {/* Marca */}

          {producto.marca && (
            <p className="text-sm font-semibold uppercase tracking-widest text-slate-500">
              {producto.marca.nombre}
            </p>
          )}

          {/* Nombre */}

          <h1 className="mt-3 text-4xl font-bold tracking-tight text-slate-900">
            {producto.nombre}
          </h1>

          {/* Código */}

          <p className="mt-4 text-sm text-slate-500">
            Código: {producto.codigo}
          </p>

          {/* Descripción */}

          {producto.descripcion && (
            <div className="mt-8">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Descripción
              </p>

              <p className="mt-2 leading-7 text-slate-600">
                {producto.descripcion}
              </p>
            </div>
          )}

          {/* Categoría */}

          {producto.categoria && (
            <div className="mt-8">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Categoría
              </p>

              <p className="mt-1 text-slate-700">{producto.categoria.nombre}</p>
            </div>
          )}

          {/* Botón */}

          <button
            type="button"
            onClick={() => setMostrarFormulario((actual) => !actual)}
            className="mt-10 w-full rounded-xl bg-slate-900 px-6 py-4 font-semibold text-white transition hover:bg-slate-700 sm:w-auto"
          >
            {mostrarFormulario
              ? "Cerrar consulta"
              : "Consultar por este producto"}
          </button>
        </div>
      </div>

      {/* =========================
          FORMULARIO
          ========================= */}

      {mostrarFormulario && (
        <div className="mt-16 border-t border-slate-200 pt-12">
          <div className="max-w-2xl">
            <h2 className="text-2xl font-bold text-slate-900">
              Consultar por este producto
            </h2>

            <p className="mt-2 text-slate-500">
              Completá tus datos y te contactaremos para informarte
              disponibilidad y precio.
            </p>

            <div className="mt-8">
              <FormularioConsulta
                productoId={producto.id}
                productoNombre={producto.nombre}
              />
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default ProductoPage;
