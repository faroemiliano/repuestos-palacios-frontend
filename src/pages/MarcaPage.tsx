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

  if (loading) {
    return (
      <main className="mx-auto max-w-7xl px-6 py-20">
        <p className="text-slate-500">Cargando marcas...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="mx-auto max-w-7xl px-6 py-20">
        <h1 className="text-3xl font-bold text-slate-900">Marcas</h1>

        <p className="mt-4 text-red-600">{error}</p>
      </main>
    );
  }

  return (
    <main>
      {/* =========================
          HEADER
          ========================= */}

      <section className="border-b border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-7xl px-6 py-16">
          <span className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
            Marcas
          </span>

          <h1 className="mt-3 text-4xl font-bold tracking-tight text-slate-900">
            Nuestras marcas
          </h1>

          <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-600">
            Trabajamos con marcas reconocidas para ofrecerte repuestos de
            calidad.
          </p>
        </div>
      </section>

      {/* =========================
          MARCAS
          ========================= */}

      <section className="mx-auto max-w-7xl px-6 py-16">
        {marcas.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 p-10 text-center">
            <h2 className="text-xl font-semibold text-slate-900">
              No hay marcas disponibles
            </h2>

            <p className="mt-2 text-slate-500">
              Actualmente no tenemos marcas disponibles para mostrar.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {marcas.map((marca) => (
              <Link
                key={marca.id}
                to={`/catalogo?marca=${marca.id}`}
                className="group rounded-2xl border border-slate-200 bg-white p-8 transition duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-lg"
              >
                {/* Logo */}

                <div className="flex h-32 items-center justify-center rounded-xl bg-slate-50">
                  {marca.logo ? (
                    <img
                      src={marca.logo}
                      alt={marca.nombre}
                      className="max-h-20 max-w-[180px] object-contain"
                    />
                  ) : (
                    <span className="text-2xl font-bold text-slate-400">
                      {marca.nombre}
                    </span>
                  )}
                </div>

                {/* Información */}

                <div className="mt-6">
                  <h2 className="text-xl font-semibold text-slate-900">
                    {marca.nombre}
                  </h2>

                  {marca.descripcion && (
                    <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-500">
                      {marca.descripcion}
                    </p>
                  )}

                  <span className="mt-5 inline-block text-sm font-semibold text-slate-900 transition group-hover:translate-x-1">
                    Ver productos →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

export default MarcasPage;
