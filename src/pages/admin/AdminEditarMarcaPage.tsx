import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import { getMarca, actualizarMarca } from "../../services/marca_services";

import type { Marca } from "../../types/marca_type";

function AdminEditarMarcaPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [marca, setMarca] = useState<Marca | null>(null);

  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [logo, setLogo] = useState("");
  const [activo, setActivo] = useState(true);

  const [loading, setLoading] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function cargarMarca() {
      if (!id) {
        setError("ID de marca inválido.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const response = await getMarca(Number(id));

        setMarca(response);

        setNombre(response.nombre);
        setDescripcion(response.descripcion ?? "");
        setLogo(response.logo ?? "");
        setActivo(response.activo);
      } catch (error) {
        console.error("❌ ERROR CARGANDO MARCA:", error);

        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError("No se pudo cargar la marca.");
        }
      } finally {
        setLoading(false);
      }
    }

    cargarMarca();
  }, [id]);

  async function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!id) {
      return;
    }

    try {
      setGuardando(true);
      setError(null);

      const marcaActualizada = await actualizarMarca(Number(id), {
        nombre,
        descripcion: descripcion || null,
        logo: logo || null,
        activo,
      });

      setMarca(marcaActualizada);

      navigate("/admin/marcas");
    } catch (error) {
      console.error("❌ ERROR ACTUALIZANDO MARCA:", error);

      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("No se pudo actualizar la marca.");
      }
    } finally {
      setGuardando(false);
    }
  }

  if (loading) {
    return (
      <main className="mx-auto max-w-4xl px-6 py-10">
        <p className="text-sm text-slate-500">Cargando marca...</p>
      </main>
    );
  }

  if (error && !marca) {
    return (
      <main className="mx-auto max-w-4xl px-6 py-10">
        <div className="rounded-xl bg-red-50 p-4 text-sm text-red-600">
          {error}
        </div>

        <Link
          to="/admin/marcas"
          className="mt-6 inline-block text-sm font-semibold text-slate-900 hover:underline"
        >
          ← Volver a marcas
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-4xl px-6 py-10">
      {/* VOLVER */}

      <Link
        to="/admin/marcas"
        className="text-sm font-semibold text-slate-600 hover:text-slate-900"
      >
        ← Volver a marcas
      </Link>

      {/* HEADER */}

      <div className="mt-6">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          Editar marca
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          Modificá la información de la marca.
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
              className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-slate-900"
            />
          </div>

          {/* SLUG */}

          <div>
            <label className="text-sm font-medium text-slate-700">Slug</label>

            <input
              type="text"
              value={marca?.slug ?? ""}
              disabled
              className="mt-2 w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-slate-500"
            />

            <p className="mt-2 text-xs text-slate-400">
              El slug se utiliza para identificar la marca en las URLs.
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
              className="mt-2 w-full resize-none rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-slate-900"
            />
          </div>

          {/* LOGO */}

          <div>
            <label className="text-sm font-medium text-slate-700">
              URL del logo
            </label>

            <input
              type="url"
              value={logo}
              onChange={(event) => setLogo(event.target.value)}
              placeholder="https://..."
              className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-slate-900"
            />
          </div>

          {/* PREVISUALIZACIÓN */}

          {logo && (
            <div className="border-t border-slate-200 pt-6">
              <p className="text-sm font-medium text-slate-700">Vista previa</p>

              <div className="mt-3 flex h-32 items-center justify-center rounded-xl bg-slate-50">
                <img
                  src={logo}
                  alt={nombre}
                  className="max-h-20 max-w-[180px] object-contain"
                  onError={(event) => {
                    event.currentTarget.style.display = "none";
                  }}
                />
              </div>
            </div>
          )}

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
                Marca activa
              </span>
            </label>

            <p className="mt-2 text-xs text-slate-400">
              Las marcas inactivas no se muestran en el sitio público.
            </p>
          </div>
        </div>

        {/* BOTONES */}

        <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Link
            to="/admin/marcas"
            className="rounded-lg border border-slate-300 px-5 py-3 text-center text-sm font-semibold text-slate-700 hover:bg-slate-50"
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

export default AdminEditarMarcaPage;
