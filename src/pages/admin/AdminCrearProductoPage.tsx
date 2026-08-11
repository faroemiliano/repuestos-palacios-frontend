import { useEffect, useState } from "react";
import type { FormEvent, ChangeEvent } from "react";
import { Link, useNavigate } from "react-router-dom";

import { apiFetch } from "../../services/api";

import type { Marca } from "../../types/marca_type";
import type { Categoria } from "../../types/categoria_types";
import type { Producto } from "../../types/products_type";

function AdminCrearProductoPage() {
  const navigate = useNavigate();

  const [marcas, setMarcas] = useState<Marca[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);

  const [nombre, setNombre] = useState("");
  const [codigo, setCodigo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [marcaId, setMarcaId] = useState("");
  const [categoriaId, setCategoriaId] = useState("");
  const [destacado, setDestacado] = useState(false);
  const [activo, setActivo] = useState(true);

  // ==========================================
  // IMÁGENES
  // ==========================================

  const [imagenes, setImagenes] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);

  const [loading, setLoading] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ==========================================
  // CARGAR MARCAS Y CATEGORÍAS
  // ==========================================

  useEffect(() => {
    async function cargarDatos() {
      try {
        setLoading(true);
        setError(null);

        const [marcasResponse, categoriasResponse] = await Promise.all([
          apiFetch<Marca[]>("/marcas/"),
          apiFetch<Categoria[]>("/categorias/"),
        ]);

        setMarcas(marcasResponse);
        setCategorias(categoriasResponse);
      } catch (error) {
        console.error("❌ ERROR CARGANDO DATOS:", error);

        setError("No se pudieron cargar marcas y categorías.");
      } finally {
        setLoading(false);
      }
    }

    cargarDatos();
  }, []);

  // ==========================================
  // SELECCIONAR IMÁGENES
  // ==========================================

  function handleImagenesChange(event: ChangeEvent<HTMLInputElement>) {
    const archivos = Array.from(event.target.files ?? []);

    if (archivos.length === 0) {
      setImagenes([]);
      setPreviews([]);
      return;
    }

    setImagenes(archivos);

    const nuevasPreviews = archivos.map((archivo) =>
      URL.createObjectURL(archivo),
    );

    setPreviews(nuevasPreviews);
  }

  // ==========================================
  // ELIMINAR IMAGEN
  // ==========================================

  function eliminarImagen(index: number) {
    setImagenes((actuales) => actuales.filter((_, i) => i !== index));

    setPreviews((actuales) => actuales.filter((_, i) => i !== index));
  }

  // ==========================================
  // CREAR PRODUCTO
  // ==========================================

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    try {
      setGuardando(true);
      setError(null);

      // ========================================
      // 1. CREAR PRODUCTO
      // ========================================

      const producto = await apiFetch<Producto>("/productos/", {
        method: "POST",

        body: JSON.stringify({
          nombre,
          codigo,
          descripcion: descripcion || null,
          marca_id: Number(marcaId),
          categoria_id: Number(categoriaId),
          destacado,
          activo,
        }),
      });

      console.log("✅ PRODUCTO CREADO:", producto);

      // ========================================
      // 2. SUBIR TODAS LAS IMÁGENES
      // ========================================

      for (let index = 0; index < imagenes.length; index++) {
        const imagen = imagenes[index];

        const formData = new FormData();

        formData.append("producto_id", String(producto.id));

        formData.append("orden", String(index));

        // La primera es principal
        formData.append("principal", index === 0 ? "true" : "false");

        formData.append("archivo", imagen);

        console.log(
          `📸 SUBIENDO IMAGEN ${index + 1}/${imagenes.length}:`,
          imagen.name,
        );

        const imagenCreada = await apiFetch("/imagenes-productos/upload", {
          method: "POST",
          body: formData,
        });

        console.log("✅ IMAGEN CREADA:", imagenCreada);
      }

      // ========================================
      // 3. FINALIZAR
      // ========================================

      navigate("/admin/productos");
    } catch (error) {
      console.error("❌ ERROR CREANDO PRODUCTO:", error);

      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("No se pudo crear el producto.");
      }
    } finally {
      setGuardando(false);
    }
  }

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <main className="mx-auto max-w-5xl px-6 py-12">
        <p className="text-slate-500">Cargando formulario...</p>
      </main>
    );
  }

  // ==========================================
  // PÁGINA
  // ==========================================

  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      {/* VOLVER */}

      <Link
        to="/admin/productos"
        className="text-sm font-medium text-slate-500 hover:text-slate-900"
      >
        ← Volver a productos
      </Link>

      {/* TÍTULO */}

      <h1 className="mt-6 text-3xl font-bold tracking-tight text-slate-900">
        Nuevo producto
      </h1>

      <p className="mt-2 text-slate-500">
        Agregá un nuevo producto al catálogo.
      </p>

      {/* FORMULARIO */}

      <form
        onSubmit={handleSubmit}
        className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 sm:p-8"
      >
        {/* ERROR */}

        {error && (
          <div className="mb-6 rounded-lg bg-red-50 p-4 text-sm text-red-600">
            {error}
          </div>
        )}

        <div className="grid gap-6 sm:grid-cols-2">
          {/* NOMBRE */}

          <div className="sm:col-span-2">
            <label className="text-sm font-medium text-slate-700">Nombre</label>

            <input
              type="text"
              value={nombre}
              onChange={(event) => setNombre(event.target.value)}
              required
              className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-slate-900"
              placeholder="Ej: Bobina"
            />
          </div>

          {/* CÓDIGO */}

          <div>
            <label className="text-sm font-medium text-slate-700">Código</label>

            <input
              type="text"
              value={codigo}
              onChange={(event) => setCodigo(event.target.value)}
              required
              className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-slate-900"
              placeholder="Ej: AC-421"
            />
          </div>

          {/* MARCA */}

          <div>
            <label className="text-sm font-medium text-slate-700">Marca</label>

            <select
              value={marcaId}
              onChange={(event) => setMarcaId(event.target.value)}
              required
              className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-3 outline-none focus:border-slate-900"
            >
              <option value="">Seleccionar marca</option>

              {marcas.map((marca) => (
                <option key={marca.id} value={marca.id}>
                  {marca.nombre}
                </option>
              ))}
            </select>
          </div>

          {/* CATEGORÍA */}

          <div className="sm:col-span-2">
            <label className="text-sm font-medium text-slate-700">
              Categoría
            </label>

            <select
              value={categoriaId}
              onChange={(event) => setCategoriaId(event.target.value)}
              required
              className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-3 outline-none focus:border-slate-900"
            >
              <option value="">Seleccionar categoría</option>

              {categorias.map((categoria) => (
                <option key={categoria.id} value={categoria.id}>
                  {categoria.nombre}
                </option>
              ))}
            </select>
          </div>

          {/* ==================================
              IMÁGENES
              ================================== */}

          <div className="sm:col-span-2">
            <label className="text-sm font-medium text-slate-700">
              Imágenes del producto
            </label>

            <div className="mt-2 rounded-xl border border-dashed border-slate-300 p-6">
              {/* PREVIEWS */}

              {previews.length > 0 && (
                <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                  {previews.map((preview, index) => (
                    <div
                      key={preview}
                      className="relative overflow-hidden rounded-xl border border-slate-200 bg-slate-50"
                    >
                      <img
                        src={preview}
                        alt={`Imagen ${index + 1}`}
                        className="aspect-square h-full w-full object-contain p-3"
                      />

                      {/* PRINCIPAL */}

                      {index === 0 && (
                        <span className="absolute left-2 top-2 rounded-md bg-slate-900 px-2 py-1 text-xs font-semibold text-white">
                          Principal
                        </span>
                      )}

                      {/* ELIMINAR */}

                      <button
                        type="button"
                        onClick={() => eliminarImagen(index)}
                        className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-white text-sm font-bold text-red-600 shadow hover:bg-red-50"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* INPUT */}

              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                multiple
                onChange={handleImagenesChange}
                className="block w-full text-sm text-slate-600"
              />

              <p className="mt-3 text-xs text-slate-400">
                Podés seleccionar varias imágenes. La primera será utilizada
                como imagen principal.
                <br />
                Formatos permitidos: JPG, PNG o WEBP.
              </p>
            </div>
          </div>

          {/* DESCRIPCIÓN */}

          <div className="sm:col-span-2">
            <label className="text-sm font-medium text-slate-700">
              Descripción
            </label>

            <textarea
              value={descripcion}
              onChange={(event) => setDescripcion(event.target.value)}
              rows={5}
              className="mt-2 w-full resize-none rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-slate-900"
              placeholder="Descripción del producto..."
            />
          </div>
        </div>

        {/* ESTADOS */}

        <div className="mt-8 space-y-4 border-t border-slate-200 pt-6">
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={activo}
              onChange={(event) => setActivo(event.target.checked)}
              className="h-4 w-4"
            />

            <span className="text-sm font-medium text-slate-700">
              Producto activo
            </span>
          </label>

          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={destacado}
              onChange={(event) => setDestacado(event.target.checked)}
              className="h-4 w-4"
            />

            <span className="text-sm font-medium text-slate-700">
              Producto destacado
            </span>
          </label>
        </div>

        {/* BOTONES */}

        <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Link
            to="/admin/productos"
            className="rounded-lg border border-slate-300 px-5 py-3 text-center text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            Cancelar
          </Link>

          <button
            type="submit"
            disabled={guardando}
            className="rounded-lg bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {guardando
              ? `Guardando${imagenes.length > 0 ? ` (${imagenes.length} imágenes)` : ""}...`
              : "Crear producto"}
          </button>
        </div>
      </form>
    </main>
  );
}

export default AdminCrearProductoPage;
