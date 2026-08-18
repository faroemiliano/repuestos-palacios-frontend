import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { crearMarca } from "../../services/marca_services";

function AdminCrearMarcaPage() {
  const navigate = useNavigate();

  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [logo, setLogo] = useState("");
  const [activo, setActivo] = useState(true);

  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      setGuardando(true);
      setError(null);

      await crearMarca({
        nombre,
        descripcion: descripcion || null,
        logo: logo || null,
        activo,
      });

      navigate("/admin/marcas");
    } catch (error) {
      console.error("❌ ERROR CREANDO MARCA:", error);

      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("No se pudo crear la marca.");
      }
    } finally {
      setGuardando(false);
    }
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
          Nueva marca
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          Agregá una nueva marca al catálogo.
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
              placeholder="Ej: Bosch"
              className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-slate-900"
            />
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
              placeholder="Descripción de la marca..."
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

            <p className="mt-2 text-xs text-slate-400">
              Por ahora utilizamos una URL para el logo.
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
                Marca activa
              </span>
            </label>
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
            {guardando ? "Guardando..." : "Crear marca"}
          </button>
        </div>
      </form>
    </main>
  );
}

export default AdminCrearMarcaPage;
