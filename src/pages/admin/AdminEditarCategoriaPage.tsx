import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import { apiFetch } from "../../services/api";
import type { Categoria } from "../../types/categoria_types";

function AdminEditarCategoriaPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [categoria, setCategoria] = useState<Categoria | null>(null);

  const [categorias, setCategorias] = useState<Categoria[]>([]);

  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [imagen, setImagen] = useState("");
  const [activo, setActivo] = useState(true);
  const [categoriaPadreId, setCategoriaPadreId] = useState("");

  const [loading, setLoading] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function cargarDatos() {
      if (!id) {
        setError("ID de categoría inválido.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const [categoriaResponse, categoriasResponse] = await Promise.all([
          apiFetch<Categoria>(`/categorias/${id}`),

          apiFetch<Categoria[]>("/categorias/?solo_activas=false"),
        ]);

        setCategoria(categoriaResponse);
        setCategorias(categoriasResponse);

        setNombre(categoriaResponse.nombre);
        setDescripcion(categoriaResponse.descripcion ?? "");
        setImagen(categoriaResponse.imagen ?? "");
        setActivo(categoriaResponse.activo);

        setCategoriaPadreId(
          categoriaResponse.categoria_padre_id
            ? String(categoriaResponse.categoria_padre_id)
            : "",
        );
      } catch (error) {
        console.error("❌ ERROR CARGANDO CATEGORÍA:", error);

        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError("No se pudo cargar la categoría.");
        }
      } finally {
        setLoading(false);
      }
    }

    cargarDatos();
  }, [id]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!id) {
      return;
    }

    try {
      setGuardando(true);
      setError(null);

      await apiFetch<Categoria>(`/categorias/${id}`, {
        method: "PUT",
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
      console.error("❌ ERROR ACTUALIZANDO CATEGORÍA:", error);

      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("No se pudo actualizar la categoría.");
      }
    } finally {
      setGuardando(false);
    }
  }

  if (loading) {
    return (
      <main className="mx-auto max-w-4xl px-6 py-10">
        <p className="text-sm text-slate-500">Cargando categoría...</p>
      </main>
    );
  }

  if (error && !categoria) {
    return (
      <main className="mx-auto max-w-4xl px-6 py-10">
        <div className="rounded-lg bg-red-50 p-4 text-sm text-red-600">
          {error}
        </div>

        <Link
          to="/admin/categorias"
          className="mt-6 inline-block text-sm font-semibold text-slate-900 hover:underline"
        >
          ← Volver a categorías
        </Link>
      </main>
    );
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
          Editar categoría
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          Modificá los datos de la categoría.
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
              className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-900"
            />
          </div>

          {/* PADRE */}

          <div>
            <label className="text-sm font-medium text-slate-700">
              Categoría padre
            </label>

            <select
              value={categoriaPadreId}
              onChange={(event) => setCategoriaPadreId(event.target.value)}
              className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-slate-900"
            >
              <option value="">Sin categoría padre — categoría raíz</option>

              {categorias
                .filter(
                  (item) =>
                    item.id !== categoria?.id &&
                    item.categoria_padre_id === null,
                )
                .map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.nombre}
                  </option>
                ))}
            </select>

            <p className="mt-2 text-xs text-slate-400">
              Podés convertir esta categoría en una categoría principal o
              asignarle otra categoría como padre.
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
              rows={5}
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
            {guardando ? "Guardando..." : "Guardar cambios"}
          </button>
        </div>
      </form>
    </main>
  );
}

export default AdminEditarCategoriaPage;
