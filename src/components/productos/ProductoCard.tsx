import { Link } from "react-router-dom";

import { getMediaUrl } from "../../services/api";

import type { Producto } from "../../types/products_type";

interface ProductoCardProps {
  producto: Producto;
}

function ProductoCard({ producto }: ProductoCardProps) {
  const imagen =
    producto.imagenes?.find((imagen) => imagen.principal) ??
    producto.imagenes?.[0];

  return (
    <Link
      to={`/producto/${producto.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white transition duration-300 hover:-translate-y-1 hover:shadow-lg"
    >
      {/* Imagen */}

      <div className="aspect-square bg-slate-100">
        {imagen ? (
          <img
            src={getMediaUrl(imagen.url)}
            alt={producto.nombre}
            loading="lazy"
            className="h-full w-full object-contain p-4 transition duration-300 group-hover:scale-105 sm:p-5"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-slate-400">
            Sin imagen
          </div>
        )}
      </div>

      {/* Información */}

      <div className="flex flex-1 flex-col p-4 sm:p-5">
        {producto.marca && (
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">
            {producto.marca.nombre}
          </p>
        )}

        <h3 className="mt-2 line-clamp-2 text-base font-semibold text-slate-900 sm:text-lg">
          {producto.nombre}
        </h3>

        <p className="mt-2 text-sm text-slate-500">Código: {producto.codigo}</p>

        {producto.precio !== null && (
          <p className="mt-3 text-lg font-bold text-slate-900">
            {new Intl.NumberFormat("es-AR", {
              style: "currency",
              currency: "ARS",
              maximumFractionDigits: 2,
            }).format(producto.precio)}
          </p>
        )}

        {producto.precio === null && (
          <p className="mt-3 text-sm font-semibold text-slate-600">
            Ingresá para ver el precio
          </p>
        )}

        <span className="mt-auto pt-5 text-sm font-semibold text-slate-900 transition group-hover:translate-x-1">
          Ver producto →
        </span>
      </div>
    </Link>
  );
}

export default ProductoCard;
