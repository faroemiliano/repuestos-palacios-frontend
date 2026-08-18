import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { apiFetch } from "../../services/api";
import type { Categoria } from "../../types/categoria_types";

function AdminCrearCategoriaPage() {
  const navigate = useNavigate();

  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [imagen, setImagen] = useState("");
  const [activo, setActivo] = useState(true);
  const [categoriaPadreId, setCategoriaPadreId] = useState("");

  const [categorias, setCategorias] = useState<Categoria[]>([]);

  const [loadingCategorias, setLoadingCategorias] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function cargarCategorias() {
      try {
        setLoadingCategorias(true);

        const response = await apiFetch<Categoria[]>(
          "/categorias/?solo_activas=true",
        );

        setCategorias(response);
      } catch (error) {
        console.error("❌ ERROR CARGANDO CATEGORÍAS:", error);

        setError("No se pudieron cargar las categorías existentes.");
      } finally {
        setLoadingCategorias(false);
      }
    }

    cargarCategorias();
  }, []);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      setGuardando(true);
      setError(null);

      await apiFetch<Categoria>("/categorias/", {
        method: "POST",
        body: JSON.stringify({
          nombre,
          descripcion: descripcion || null,
          imagen: imagen || null,
          activo,
          categoria_padre_id: categoriaPadreId
            ? Number(categoriaPadreId)
            : null,
        }),
      });

      navigate("/admin/categorias");
    } catch (error) {
      console.error("❌ ERROR CREANDO CATEGORÍA:", error);

      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("No se pudo crear la categoría.");
      }
    } finally {
      setGuardando(false);
    }
  }

  return (
    <main className="mx-auto max-w-4xl px-6 py-10">
      {/* HEADER */}

      <div>
        <Link
          to="/admin/categorias"
          className="text-sm font-semibold text-slate-500 hover:text-slate-900"
        >
          ← Volver a categorías
        </Link>

        <h1 className="mt-6 text-3xl font-bold tracking-tight text-slate-900">
          Nueva categoría
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          Creá una categoría o una subcategoría para tus productos.
        </p>
      </div>

      {/* FORMULARIO */}

      <form
        onSubmit={handleSubmit}
        className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 sm:p-8"
      >
        {error && (
          <div className="mb-6 rounded-lg bg-red-50 p-4 text-sm text-red-600">
            {error}
          </div>
        )}

        <div className="space-y-6">
          {/* NOMBRE */}

          <div>
            <label className="text-sm font-medium text-slate-700">Nombre</label>

            <input
              type="text"
              value={nombre}
              onChange={(event) => setNombre(event.target.value)}
              required
              minLength={2}
              maxLength={100}
              placeholder="Ej: Alternadores"
              className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-900"
            />
          </div>

          {/* CATEGORÍA PADRE */}

          <div>
            <label className="text-sm font-medium text-slate-700">
              Categoría padre
            </label>

            <select
              value={categoriaPadreId}
              onChange={(event) => setCategoriaPadreId(event.target.value)}
              disabled={loadingCategorias}
              className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-slate-900 disabled:bg-slate-50"
            >
              <option value="">
                {loadingCategorias
                  ? "Cargando categorías..."
                  : "Sin categoría padre — categoría raíz"}
              </option>

              {categorias
                .filter((categoria) => categoria.categoria_padre_id === null)
                .map((categoria) => (
                  <option key={categoria.id} value={categoria.id}>
                    {categoria.nombre}
                  </option>
                ))}
            </select>

            <p className="mt-2 text-xs text-slate-400">
              Si no seleccionás ninguna, la categoría será una categoría
              principal.
            </p>
          </div>

          {/* DESCRIPCIÓN */}

          <div>
            <label className="text-sm font-medium text-slate-700">
              Descripción
            </label>

            <textarea
              value={descripcion}
              onChange={(event) => setDescripcion(event.target.value)}
              rows={4}
              placeholder="Descripción opcional de la categoría..."
              className="mt-2 w-full resize-none rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-900"
            />
          </div>

          {/* IMAGEN */}

          <div>
            <label className="text-sm font-medium text-slate-700">
              URL de imagen
            </label>

            <input
              type="text"
              value={imagen}
              onChange={(event) => setImagen(event.target.value)}
              maxLength={500}
              placeholder="https://..."
              className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-900"
            />

            <p className="mt-2 text-xs text-slate-400">
              Por ahora utilizamos una URL. Más adelante podemos agregar subida
              de imágenes.
            </p>
          </div>

          {/* ESTADO */}

          <div className="border-t border-slate-200 pt-6">
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={activo}
                onChange={(event) => setActivo(event.target.checked)}
                className="h-4 w-4"
              />

              <span className="text-sm font-medium text-slate-700">
                Categoría activa
              </span>
            </label>
          </div>
        </div>

        {/* BOTONES */}

        <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Link
            to="/admin/categorias"
            className="rounded-lg border border-slate-300 px-5 py-3 text-center text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Cancelar
          </Link>

          <button
            type="submit"
            disabled={guardando}
            className="rounded-lg bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {guardando ? "Guardando..." : "Crear categoría"}
          </button>
        </div>
      </form>
    </main>
  );
}

export default AdminCrearCategoriaPage;
