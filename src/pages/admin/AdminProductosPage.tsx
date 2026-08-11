import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { getProductos } from "../../services/producto_services";
import type { Producto } from "../../types/products_type";

function AdminProductosPage() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function cargarProductos() {
      try {
        setLoading(true);
        setError(null);

        const response = await getProductos({
          page: 1,
          limit: 50,
          orden: "nombre_asc",
        });

        setProductos(response.items);
      } catch (error) {
        console.error("❌ ERROR PRODUCTOS ADMIN:", error);
        setError("No se pudieron cargar los productos.");
      } finally {
        setLoading(false);
      }
    }

    cargarProductos();
  }, []);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-slate-500">
            Catálogo
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
            Productos
          </h1>

          <p className="mt-2 text-slate-500">
            Administrá los productos del catálogo.
          </p>
        </div>

        <Link
          to="/admin/productos/nuevo"
          className="rounded-lg bg-slate-900 px-5 py-3 text-center text-sm font-semibold text-white transition hover:bg-slate-700"
        >
          + Nuevo producto
        </Link>
      </div>

      {loading && (
        <p className="mt-10 text-sm text-slate-500">Cargando productos...</p>
      )}

      {error && <p className="mt-10 text-sm text-red-600">{error}</p>}

      {!loading && !error && (
        <div className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px]">
              <thead className="border-b border-slate-200 bg-slate-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Producto
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Código
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Marca
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Categoría
                  </th>

                  <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Acción
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-200">
                {productos.map((producto) => (
                  <tr key={producto.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4">
                      <p className="font-semibold text-slate-900">
                        {producto.nombre}
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        ID: {producto.id}
                      </p>
                    </td>

                    <td className="px-6 py-4 text-sm text-slate-600">
                      {producto.codigo}
                    </td>

                    <td className="px-6 py-4 text-sm text-slate-600">
                      {producto.marca?.nombre ?? "—"}
                    </td>

                    <td className="px-6 py-4 text-sm text-slate-600">
                      {producto.categoria?.nombre ?? "—"}
                    </td>

                    <td className="px-6 py-4 text-right">
                      <Link
                        to={`/producto/${producto.slug}`}
                        target="_blank"
                        className="text-sm font-semibold text-slate-900 hover:underline"
                      >
                        Ver →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {productos.length === 0 && (
            <div className="p-10 text-center">
              <p className="text-slate-500">Todavía no hay productos.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default AdminProductosPage;
