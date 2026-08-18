import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { getProductos } from "../../services/producto_services";
import type { Producto } from "../../types/products_type";
import { apiFetch } from "../../services/api";

function AdminProductosPage() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPaginas, setTotalPaginas] = useState(0);
  const [buscar, setBuscar] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function cargarProductos() {
      try {
        setLoading(true);
        setError(null);

        const response = await getProductos({
          buscar: buscar.trim() || undefined,
          page,
          limit: 50,
          orden: "nombre_asc",
        });

        setProductos(response.items);
        setTotal(response.total);
        setTotalPaginas(response.total_paginas);
      } catch (error) {
        console.error("❌ ERROR PRODUCTOS ADMIN:", error);
        setError("No se pudieron cargar los productos.");
      } finally {
        setLoading(false);
      }
    }

    cargarProductos();
  }, [buscar, page]);

  async function handleEliminarProducto(id: number) {
    const confirmar = window.confirm(
      "¿Estás seguro de que querés eliminar este producto?",
    );

    if (!confirmar) {
      return;
    }

    try {
      await apiFetch(`/productos/${id}`, {
        method: "DELETE",
      });

      const pageLuegoDeEliminar =
        productos.length === 1 && page > 1 ? page - 1 : page;

      setPage(pageLuegoDeEliminar);

      if (pageLuegoDeEliminar === page) {
        const response = await getProductos({
          buscar: buscar.trim() || undefined,
          page,
          limit: 50,
          orden: "nombre_asc",
        });

        setProductos(response.items);
        setTotal(response.total);
        setTotalPaginas(response.total_paginas);
      }
    } catch (error) {
      console.error("❌ ERROR ELIMINANDO PRODUCTO:", error);

      alert("No se pudo eliminar el producto.");
    }
  }

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

      <div className="mt-8 max-w-xl">
        <label
          htmlFor="buscar-producto-admin"
          className="text-sm font-semibold text-slate-700"
        >
          Buscar productos
        </label>

        <input
          id="buscar-producto-admin"
          type="search"
          value={buscar}
          onChange={(event) => {
            setBuscar(event.target.value);
            setPage(1);
          }}
          placeholder="Nombre, código o marca..."
          className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-900"
        />
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

                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-4">
                        <Link
                          to={`/producto/${producto.slug}`}
                          target="_blank"
                          className="text-sm font-semibold text-slate-600 hover:text-slate-900"
                        >
                          Ver
                        </Link>

                        <Link
                          to={`/admin/productos/${producto.id}/editar`}
                          className="text-sm font-semibold text-slate-900 hover:underline"
                        >
                          Editar
                        </Link>

                        <button
                          type="button"
                          onClick={() => handleEliminarProducto(producto.id)}
                          className="text-sm font-semibold text-red-600 hover:text-red-700"
                        >
                          Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {productos.length === 0 && (
            <div className="p-10 text-center">
              <p className="text-slate-500">
                {buscar ? "No encontramos productos con esa búsqueda." : "Todavía no hay productos."}
              </p>
            </div>
          )}

          {totalPaginas > 1 && (
            <div className="flex flex-col gap-3 border-t border-slate-200 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-slate-500">
                {total} productos · Página {page} de {totalPaginas}
              </p>

              <div className="flex gap-2">
                <button
                  type="button"
                  disabled={page === 1}
                  onClick={() => setPage((pagina) => pagina - 1)}
                  className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  ← Anterior
                </button>

                <button
                  type="button"
                  disabled={page === totalPaginas}
                  onClick={() => setPage((pagina) => pagina + 1)}
                  className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Siguiente →
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default AdminProductosPage;
