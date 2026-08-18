import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getCategoriasRaiz } from "../../services/categoria_services";
import type { Categoria } from "../../types/categoria_types";

function CategoriesSection() {
  const [categories, setCategories] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function cargarCategorias() {
      try {
        const data = await getCategoriasRaiz();

        setCategories(data);
      } catch (error) {
        console.error(error);

        setError("No se pudieron cargar las categorías.");
      } finally {
        setLoading(false);
      }
    }

    cargarCategorias();
  }, []);

  return (
    <section className="bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        {/* HEADER */}

        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-red" />
              Categorías
            </div>

            <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
              Explorá nuestro catálogo
            </h2>

            <p className="mt-4 max-w-xl text-sm leading-6 text-slate-600 sm:text-base sm:leading-7">
              Encontrá rápidamente el tipo de repuesto que necesitás.
            </p>
          </div>

          <Link
            to="/catalogo"
            className="group inline-flex items-center gap-2 text-sm font-semibold text-slate-950 transition hover:text-slate-600"
          >
            Ver catálogo completo
            <span className="transition-transform duration-200 group-hover:translate-x-1">
              →
            </span>
          </Link>
        </div>

        {/* ESTADOS */}

        {loading && (
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="h-40 animate-pulse rounded-2xl border border-slate-200 bg-white"
              />
            ))}
          </div>
        )}

        {error && (
          <p className="mt-10 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
            {error}
          </p>
        )}

        {/* CATEGORÍAS */}

        {!loading && !error && (
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {categories.map((category) => (
              <Link
                key={category.id}
                to={`/catalogo?categoria=${category.id}`}
                className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-xl"
              >
                {/* Número */}

                <div className="flex items-start justify-between">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-sm font-bold text-slate-700 transition-colors group-hover:bg-brand-red group-hover:text-white">
                    {String(category.id).padStart(2, "0")}
                  </span>

                  <span className="text-slate-300 transition-transform duration-300 group-hover:translate-x-1 group-hover:text-slate-900">
                    →
                  </span>
                </div>

                {/* Contenido */}

                <div className="mt-8">
                  <h3 className="text-lg font-semibold text-slate-950">
                    {category.nombre}
                  </h3>

                  {category.descripcion && (
                    <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-500">
                      {category.descripcion}
                    </p>
                  )}
                </div>

                {/* Línea inferior */}

                <div className="mt-6 h-px w-8 bg-slate-200 transition-all duration-300 group-hover:w-16 group-hover:bg-brand-red" />
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default CategoriesSection;
