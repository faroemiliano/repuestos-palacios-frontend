import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import { apiFetch, getMediaUrl } from "../../services/api";

import {
  getProductoById,
  getLineasPorCategoriaYTipo,
  getTiposPorCategoria,
  updateProducto,
} from "../../services/producto_services";

import {
  eliminarImagenProducto,
  getImagenesProducto,
  subirImagenProducto,
  actualizarImagenProducto,
} from "../../services/imagen_producto_services";

import type { Marca } from "../../types/marca_type";
import type {
  Producto,
  ProductoCategoria,
  ProductoImagen,
  ProductoMarca,
  ProductoTipo,
} from "../../types/products_type";

function AdminEditarProductoPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [producto, setProducto] = useState<Producto | null>(null);

  const [marcas, setMarcas] = useState<Marca[]>([]);
  const [categorias, setCategorias] = useState<ProductoCategoria[]>([]);

  const [nombre, setNombre] = useState("");
  const [codigo, setCodigo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [equivalencias, setEquivalencias] = useState("");
  const [precio, setPrecio] = useState("");
  const [marcaId, setMarcaId] = useState("");
  const [categoriaId, setCategoriaId] = useState("");
  const [tipoId, setTipoId] = useState("");
  const [lineaId, setLineaId] = useState("");
  const [tipos, setTipos] = useState<ProductoTipo[]>([]);
  const [lineas, setLineas] = useState<ProductoMarca[]>([]);
  const [activo, setActivo] = useState(true);
  const [destacado, setDestacado] = useState(false);

  const [loading, setLoading] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [imagenes, setImagenes] = useState<ProductoImagen[]>([]);

  const [nuevasImagenes, setNuevasImagenes] = useState<File[]>([]);

  const [subiendoImagenes, setSubiendoImagenes] = useState(false);

  useEffect(() => {
    async function cargarDatos() {
      if (!id) {
        setError("ID de producto inválido.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const [
          productoResponse,
          marcasResponse,
          categoriasResponse,
          imagenesResponse,
        ] = await Promise.all([
          getProductoById(Number(id)),
          apiFetch<Marca[]>("/marcas/?solo_activas=true"),
          apiFetch<ProductoCategoria[]>("/categorias/?solo_activas=true"),
          getImagenesProducto(Number(id)),
        ]);

        setProducto(productoResponse);
        setImagenes(imagenesResponse);
        setMarcas(marcasResponse);
        setCategorias(categoriasResponse);

        setNombre(productoResponse.nombre);
        setCodigo(productoResponse.codigo);
        setDescripcion(productoResponse.descripcion ?? "");
        setEquivalencias(productoResponse.equivalencias ?? "");
        setPrecio(productoResponse.precio?.toString() ?? "");
        setMarcaId(String(productoResponse.marca_id));
        setCategoriaId(String(productoResponse.categoria_id));
        setTipoId(String(productoResponse.tipo_id));
        setLineaId(productoResponse.linea_id ? String(productoResponse.linea_id) : "");
        setActivo(productoResponse.activo);
        setDestacado(productoResponse.destacado);
      } catch (error) {
        console.error("❌ ERROR CARGANDO PRODUCTO:", error);

        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError("No se pudo cargar el producto.");
        }
      } finally {
        setLoading(false);
      }
    }

    cargarDatos();
  }, [id]);

  useEffect(() => {
    if (!categoriaId) { setTipos([]); return; }
    getTiposPorCategoria(Number(categoriaId))
      .then((respuesta) => {
        setTipos(respuesta);
        if (respuesta.length === 0) setTipoId(categoriaId);
      })
      .catch(() => setTipos([]));
  }, [categoriaId]);

  useEffect(() => {
    if (!categoriaId || !tipoId) { setLineas([]); return; }
    getLineasPorCategoriaYTipo(Number(categoriaId), Number(tipoId))
      .then(setLineas).catch(() => setLineas([]));
  }, [categoriaId, tipoId]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!id) {
      return;
    }

    try {
      setGuardando(true);
      setError(null);

      await updateProducto(Number(id), {
        nombre,
        codigo,
        descripcion: descripcion || null,
        equivalencias: equivalencias || null,
        precio: precio ? Number(precio) : null,
        marca_id: Number(marcaId),
        categoria_id: Number(categoriaId),
        tipo_id: Number(tipoId),
        linea_id: lineaId ? Number(lineaId) : null,
        activo,
        destacado,
      });

      navigate("/admin/productos");
    } catch (error) {
      console.error("❌ ERROR ACTUALIZANDO PRODUCTO:", error);

      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("No se pudo actualizar el producto.");
      }
    } finally {
      setGuardando(false);
    }
  }

  function handleNuevasImagenesChange(
    event: React.ChangeEvent<HTMLInputElement>,
  ) {
    const archivos = event.target.files;

    if (!archivos) {
      return;
    }

    setNuevasImagenes(Array.from(archivos));
  }

  async function handleMarcarPrincipal(imagenId: number) {
    try {
      const imagenActualizada = await actualizarImagenProducto(imagenId, {
        principal: true,
      });

      setImagenes((imagenesActuales) =>
        imagenesActuales.map((imagen) => ({
          ...imagen,
          principal: imagen.id === imagenActualizada.id,
        })),
      );
    } catch (error) {
      console.error("❌ ERROR CAMBIANDO IMAGEN PRINCIPAL:", error);

      setError("No se pudo cambiar la imagen principal.");
    }
  }

  async function handleSubirImagenes() {
    if (!producto) {
      return;
    }

    if (nuevasImagenes.length === 0) {
      return;
    }

    try {
      setSubiendoImagenes(true);
      setError(null);

      let ordenActual = imagenes.length;

      const imagenesSubidas: ProductoImagen[] = [];

      for (const archivo of nuevasImagenes) {
        const imagenCreada = await subirImagenProducto(
          producto.id,
          archivo,
          ordenActual,
          false,
        );

        imagenesSubidas.push(imagenCreada);

        ordenActual++;
      }

      setImagenes((imagenesActuales) => [
        ...imagenesActuales,
        ...imagenesSubidas,
      ]);

      setNuevasImagenes([]);
    } catch (error) {
      console.error("❌ ERROR SUBIENDO IMÁGENES:", error);

      setError("No se pudieron subir todas las imágenes.");
    } finally {
      setSubiendoImagenes(false);
    }
  }

  async function handleEliminarImagen(imagenId: number) {
    try {
      await eliminarImagenProducto(imagenId);

      setImagenes((imagenesActuales) =>
        imagenesActuales.filter((imagen) => imagen.id !== imagenId),
      );
    } catch (error) {
      console.error("❌ ERROR ELIMINANDO IMAGEN:", error);

      setError("No se pudo eliminar la imagen.");
    }
  }
  if (loading) {
    return (
      <main className="mx-auto max-w-6xl px-6 py-10">
        <p className="text-sm text-slate-500">Cargando producto...</p>
      </main>
    );
  }

  if (error && !producto) {
    return (
      <main className="mx-auto max-w-6xl px-6 py-10">
        <div className="rounded-xl bg-red-50 p-4 text-sm text-red-600">
          {error}
        </div>

        <Link
          to="/admin/productos"
          className="mt-6 inline-block text-sm font-semibold text-slate-900 hover:underline"
        >
          ← Volver a productos
        </Link>
      </main>
    );
  }
  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <Link
        to="/admin/productos"
        className="text-sm font-semibold text-slate-600 hover:text-slate-900"
      >
        ← Volver a productos
      </Link>

      <div className="mt-6">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          Editar producto
        </h1>

        <p className="mt-2 text-slate-500">Modificá los datos del producto.</p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 sm:p-8"
      >
        {error && (
          <div className="mb-6 rounded-lg bg-red-50 p-4 text-sm text-red-600">
            {error}
          </div>
        )}

        <div className="grid gap-6 sm:grid-cols-2">
          {/* NOMBRE */}

          <div>
            <label className="text-sm font-medium text-slate-700">Nombre</label>

            <input
              type="text"
              value={nombre}
              onChange={(event) => setNombre(event.target.value)}
              required
              className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-slate-900"
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
            />
          </div>

          {/* MARCA */}

          <div>
            <label className="text-sm font-medium text-slate-700">Precio</label>
            <input type="number" min="0" step="0.01" value={precio} onChange={(event) => setPrecio(event.target.value)} className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-slate-900" placeholder="0.00" />
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
              onChange={(event) => { setCategoriaId(event.target.value); setTipoId(""); setLineaId(""); }}
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

          <div>
            <label className="text-sm font-medium text-slate-700">Tipo</label>
            <select value={tipoId} onChange={(event) => { setTipoId(event.target.value); setLineaId(""); }} required disabled={Boolean(categoriaId) && tipos.length === 0} className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-3 outline-none focus:border-slate-900 disabled:opacity-60">
              <option value="">{tipos.length === 0 && categoriaId ? "Sin tipo" : "Seleccionar tipo"}</option>
              {tipos.map((tipo) => <option key={tipo.id} value={tipo.id}>{tipo.nombre}</option>)}
            </select>
          </div>

          <div className="sm:col-span-2">
            <label className="text-sm font-medium text-slate-700">Línea técnica</label>
            <select value={lineaId} onChange={(event) => setLineaId(event.target.value)} disabled={lineas.length === 0} className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-3 outline-none focus:border-slate-900 disabled:opacity-60">
              <option value="">Sin línea técnica</option>
              {lineas.map((linea) => <option key={linea.id} value={linea.id}>{linea.nombre}</option>)}
            </select>
          </div>

          {/* =========================
    IMÁGENES DEL PRODUCTO
    ========================= */}

          <div className="sm:col-span-2 border-t border-slate-200 pt-8">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                Imágenes del producto
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Administrá las imágenes del producto.
              </p>
            </div>

            {/* IMÁGENES EXISTENTES */}

            {imagenes.length > 0 && (
              <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {imagenes.map((imagen) => (
                  <div
                    key={imagen.id}
                    className="overflow-hidden rounded-xl border border-slate-200 bg-white"
                  >
                    <div className="relative aspect-square bg-slate-50">
                      <img
                        src={getMediaUrl(imagen.url)}
                        alt="Imagen del producto"
                        className="h-full w-full object-contain p-4"
                      />

                      {imagen.principal && (
                        <div className="absolute left-3 top-3 rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold text-white">
                          Principal
                        </div>
                      )}
                    </div>

                    <div className="space-y-3 p-4">
                      {!imagen.principal && (
                        <button
                          type="button"
                          onClick={() => handleMarcarPrincipal(imagen.id)}
                          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                        >
                          Usar como principal
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => handleEliminarImagen(imagen.id)}
                        className="w-full rounded-lg border border-red-200 px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-50"
                      >
                        Eliminar imagen
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {imagenes.length === 0 && (
              <div className="mt-6 rounded-xl border border-dashed border-slate-300 p-8 text-center">
                <p className="text-sm text-slate-500">
                  Este producto todavía no tiene imágenes.
                </p>
              </div>
            )}

            {/* NUEVAS IMÁGENES */}

            <div className="mt-8 rounded-xl border border-dashed border-slate-300 p-6">
              <label className="text-sm font-medium text-slate-700">
                Agregar imágenes
              </label>

              <input
                type="file"
                multiple
                accept="image/jpeg,image/png,image/webp"
                onChange={handleNuevasImagenesChange}
                className="mt-3 block w-full text-sm text-slate-600"
              />

              <p className="mt-2 text-xs text-slate-400">
                Podés seleccionar varias imágenes al mismo tiempo.
              </p>

              {nuevasImagenes.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm font-medium text-slate-700">
                    {nuevasImagenes.length} imagen
                    {nuevasImagenes.length !== 1 ? "es" : ""} seleccionada
                    {nuevasImagenes.length !== 1 ? "s" : ""}
                  </p>

                  <button
                    type="button"
                    onClick={handleSubirImagenes}
                    disabled={subiendoImagenes}
                    className="mt-4 rounded-lg bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {subiendoImagenes
                      ? "Subiendo imágenes..."
                      : "Subir imágenes"}
                  </button>
                </div>
              )}
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
            />
          </div>

          <div className="sm:col-span-2">
            <label className="text-sm font-medium text-slate-700">
              Equivalencias
            </label>

            <textarea
              value={equivalencias}
              onChange={(event) => setEquivalencias(event.target.value)}
              rows={4}
              className="mt-2 w-full resize-none rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-slate-900"
              placeholder="Códigos, nombres o productos similares equivalentes..."
            />
            <p className="mt-2 text-xs text-slate-500">
              Podés separar cada equivalencia con una coma o escribir una por línea.
            </p>
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
            {guardando ? "Guardando..." : "Guardar cambios"}
          </button>
        </div>
      </form>
    </main>
  );
}

export default AdminEditarProductoPage;
