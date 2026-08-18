import { useEffect, useMemo, useState } from "react";

import { Link, useSearchParams } from "react-router-dom";

import {
  getCategoriasFiltro,
  getLineasPorCategoriaYTipo,
  getProductos,
  getTiposPorCategoria,
} from "../services/producto_services";

import type {
  Producto,
  ProductoCategoria,
  ProductoMarca,
  ProductoTipo,
} from "../types/products_type";

import ProductoCard from "../components/productos/ProductoCard";
import SEO from "../components/seo/SEO";

function CatalogoPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  // =========================================================
  // URL
  // =========================================================

  const buscarInicial = searchParams.get("buscar") ?? "";

  const marcaParam = searchParams.get("linea");

  const marcaId = marcaParam ? Number(marcaParam) : undefined;

  const categoriaParam = searchParams.get("categoria");

  const categoriaId = categoriaParam ? Number(categoriaParam) : undefined;

  const tipoParam = searchParams.get("tipo");

  const tipoId = tipoParam ? Number(tipoParam) : undefined;

  const pageParam = searchParams.get("page");

  const pageInicial =
    pageParam && Number(pageParam) > 0 ? Number(pageParam) : 1;

  // =========================================================
  // ESTADOS
  // =========================================================

  const [productos, setProductos] = useState<Producto[]>([]);

  const [marcas, setMarcas] = useState<ProductoMarca[]>([]);

  const [tipos, setTipos] = useState<ProductoTipo[]>([]);

  const [categorias, setCategorias] = useState<ProductoCategoria[]>([]);

  const [buscar, setBuscar] = useState(buscarInicial);

  const [page, setPage] = useState(pageInicial);

  const [total, setTotal] = useState(0);

  const [totalPaginas, setTotalPaginas] = useState(0);

  const [loading, setLoading] = useState(true);

  const [loadingFiltros, setLoadingFiltros] = useState(true);

  const [categoriasCargadas, setCategoriasCargadas] = useState(false);

  const [loadingMarcas, setLoadingMarcas] = useState(false);

  const [error, setError] = useState<string | null>(null);

  // =========================================================
  // CONSTANTES
  // =========================================================

  const LIMIT = 20;

  // =========================================================
  // OPCIONES DEL FILTRO
  // =========================================================

  useEffect(() => {
    async function cargarCategoriasFiltro() {
      try {
        setLoadingFiltros(true);

        const response = await getCategoriasFiltro();

        setCategorias(response);
      } catch (error) {
        console.error("ERROR CARGANDO CATEGORÍAS DEL FILTRO:", error);
      } finally {
        setLoadingFiltros(false);
        setCategoriasCargadas(true);
      }
    }

    cargarCategoriasFiltro();
  }, []);

  // Las URLs antiguas pueden conservar categorías que ya no participan del
  // catálogo. Evitamos consultar productos con esos IDs obsoletos.
  useEffect(() => {
    if (
      loadingFiltros ||
      categoriaId === undefined ||
      categorias.some((categoria) => categoria.id === categoriaId)
    ) {
      return;
    }

    const params = new URLSearchParams(searchParams);

    params.delete("categoria");
    params.delete("tipo");
    params.delete("linea");
    params.delete("page");

    setSearchParams(params, { replace: true });
  }, [
    categoriaId,
    categorias,
    loadingFiltros,
    searchParams,
    setSearchParams,
  ]);

  // =========================================================
  // TIPOS Y MARCAS
  //
  // El backend expone las opciones válidas para cada nivel.
  // =========================================================

  useEffect(() => {
    async function cargarTipos() {
      if (categoriaId === undefined) {
        setTipos([]);
        return;
      }

      try {
        setLoadingFiltros(true);

        const response = await getTiposPorCategoria(categoriaId);

        setTipos(response);
      } catch (error) {
        console.error("ERROR CARGANDO TIPOS:", error);
        setTipos([]);
      } finally {
        setLoadingFiltros(false);
      }
    }

    cargarTipos();
  }, [categoriaId]);

  useEffect(() => {
    async function cargarMarcas() {
      if (categoriaId === undefined || tipoId === undefined) {
        setMarcas([]);
        return;
      }

      try {
        setLoadingMarcas(true);

        const response = await getLineasPorCategoriaYTipo(categoriaId, tipoId);

        setMarcas(response);
      } catch (error) {
        console.error("ERROR CARGANDO MARCAS:", error);
        setMarcas([]);
      } finally {
        setLoadingMarcas(false);
      }
    }

    cargarMarcas();
  }, [categoriaId, tipoId]);

  // =========================================================
  // SINCRONIZAR BUSCADOR CON URL
  // =========================================================

  useEffect(() => {
    setBuscar(buscarInicial);
  }, [buscarInicial]);

  // =========================================================
  // SINCRONIZAR PÁGINA CON URL
  // =========================================================

  useEffect(() => {
    setPage(pageInicial);
  }, [pageInicial]);

  // =========================================================
  // CATEGORÍA PADRE SELECCIONADA
  // =========================================================

  const categoriaPadreSeleccionada = useMemo(() => {
    if (categoriaId === undefined) {
      return null;
    }

    return categorias.find((categoria) => categoria.id === categoriaId) ?? null;
  }, [categorias, categoriaId]);

  // =========================================================
  // TIPO SELECCIONADO
  // =========================================================

  const tipoSeleccionado = useMemo(() => {
    if (tipoId === undefined) {
      return null;
    }

    return tipos.find((tipo) => tipo.id === tipoId) ?? null;
  }, [tipos, tipoId]);

  // =========================================================
  // MARCA SELECCIONADA
  // =========================================================

  const marcaSeleccionada = useMemo(() => {
    if (marcaId === undefined) {
      return null;
    }

    return marcas.find((marca) => marca.id === marcaId) ?? null;
  }, [marcas, marcaId]);

  const categoriasActivasIds = useMemo(
    () => new Set(categorias.map((categoria) => categoria.id)),
    [categorias],
  );

  // =========================================================
  // PRODUCTOS
  // =========================================================

  useEffect(() => {
    const timeout = setTimeout(() => {
      async function cargarProductos() {
        if (!categoriasCargadas) {
          return;
        }

        try {
          setLoading(true);

          setError(null);

          const response = await getProductos({
            buscar: buscar.trim() || undefined,

            solo_activos: true,

            categoria_id: categoriaId,

            tipo_id: tipoId,

            linea_id: marcaId,

            page,

            limit: LIMIT,

            orden: "nombre_asc",
          });

          setProductos(
            response.items.filter((producto) =>
              categoriasActivasIds.has(producto.categoria_id),
            ),
          );

          setTotal(response.total);

          setTotalPaginas(response.total_paginas);
        } catch (error) {
          console.error("ERROR PRODUCTOS:", error);

          setError("No se pudieron cargar los productos.");

          setProductos([]);

          setTotal(0);

          setTotalPaginas(0);
        } finally {
          setLoading(false);
        }
      }

      cargarProductos();
    }, 400);

    return () => clearTimeout(timeout);
  }, [
    buscar,
    categoriaId,
    tipoId,
    marcaId,
    page,
    categoriasCargadas,
    categoriasActivasIds,
  ]);

  // =========================================================
  // BUSCAR
  // =========================================================

  function handleBuscar(value: string) {
    setBuscar(value);

    const params = new URLSearchParams(searchParams);

    if (value.trim()) {
      params.set("buscar", value);
    } else {
      params.delete("buscar");
    }

    // Al hacer una nueva búsqueda,
    // volvemos a la primera página.

    params.delete("page");

    setSearchParams(params);
  }

  // =========================================================
  // CATEGORÍA
  // =========================================================

  function handleCategoriaChange(value: string) {
    const params = new URLSearchParams(searchParams);

    // Resetear filtros dependientes.

    params.delete("tipo");

    params.delete("linea");

    params.delete("page");

    if (!value) {
      params.delete("categoria");

      setSearchParams(params);

      return;
    }

    params.set("categoria", value);

    setSearchParams(params);
  }

  // =========================================================
  // TIPO
  // =========================================================

  function handleTipoChange(value: string) {
    const params = new URLSearchParams(searchParams);

    // Cambiar tipo invalida la línea anterior.

    params.delete("linea");

    params.delete("page");

    if (!value) {
      params.delete("tipo");

      setSearchParams(params);

      return;
    }

    params.set("tipo", value);

    setSearchParams(params);
  }

  // =========================================================
  // MARCA
  // =========================================================

  function handleMarcaChange(value: string) {
    const params = new URLSearchParams(searchParams);

    params.delete("page");

    if (!value) {
      params.delete("linea");
    } else {
      params.set("linea", value);
    }

    setSearchParams(params);
  }

  // =========================================================
  // CAMBIAR PÁGINA
  // =========================================================

  function handlePageChange(nuevaPagina: number) {
    if (nuevaPagina < 1 || nuevaPagina > totalPaginas) {
      return;
    }

    const params = new URLSearchParams(searchParams);

    if (nuevaPagina === 1) {
      params.delete("page");
    } else {
      params.set("page", String(nuevaPagina));
    }

    setSearchParams(params);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  // =========================================================
  // LIMPIAR
  // =========================================================

  function limpiarFiltros() {
    setBuscar("");

    setMarcas([]);

    setPage(1);

    setSearchParams({});
  }

  // =========================================================
  // FILTROS ACTIVOS
  // =========================================================

  const hayFiltros = Boolean(
    buscar ||
    marcaId !== undefined ||
    categoriaId !== undefined ||
    tipoId !== undefined,
  );

  // =========================================================
  // SEO
  // =========================================================

  const tituloSEO = tipoSeleccionado
    ? tipoSeleccionado.nombre
    : categoriaPadreSeleccionada
      ? categoriaPadreSeleccionada.nombre
      : marcaSeleccionada
        ? `Repuestos ${marcaSeleccionada.nombre}`
        : "Catálogo de repuestos";

  const descripcionSEO = tipoSeleccionado
    ? `Consultá nuestros productos de ${tipoSeleccionado.nombre}.`
    : categoriaPadreSeleccionada
      ? `Consultá nuestros productos de ${categoriaPadreSeleccionada.nombre}.`
      : marcaSeleccionada
        ? `Consultá nuestro catálogo de repuestos ${marcaSeleccionada.nombre}.`
        : "Consultá nuestro catálogo de repuestos para vehículos.";

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <>
      <SEO title={tituloSEO} description={descripcionSEO} />

      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="relative overflow-hidden bg-slate-950">
        <div className="pointer-events-none absolute -right-40 -top-40 h-96 w-96 rounded-full bg-slate-800/40 blur-3xl" />

        <div className="pointer-events-none absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-slate-800/30 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-400 transition hover:text-white"
          >
            <span>←</span>
            Volver al inicio
          </Link>

          <div className="mt-10 max-w-3xl">
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
              <span className="h-1.5 w-1.5 rounded-full bg-white" />
              Catálogo
            </div>

            <h1 className="mt-4 text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
              {tipoSeleccionado
                ? tipoSeleccionado.nombre
                : categoriaPadreSeleccionada
                  ? categoriaPadreSeleccionada.nombre
                  : marcaSeleccionada
                    ? `Productos ${marcaSeleccionada.nombre}`
                    : "Todos nuestros productos"}
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg sm:leading-8">
              Encontrá rápidamente el repuesto que necesitás. Explorá por
              categoría, tipo o marca.
            </p>
          </div>

          {/* BUSCADOR */}

          <div className="mt-10 max-w-3xl">
            <label htmlFor="buscar" className="sr-only">
              Buscar producto
            </label>

            <div className="relative">
              <input
                id="buscar"
                type="search"
                value={buscar}
                onChange={(event) => handleBuscar(event.target.value)}
                placeholder="Buscar por nombre, código o repuesto..."
                className="w-full rounded-2xl border border-white/10 bg-white px-5 py-4 pr-14 text-sm text-slate-900 shadow-2xl outline-none placeholder:text-slate-400 transition focus:border-white focus:ring-4 focus:ring-white/10 sm:px-6 sm:py-5 sm:text-base"
              />

              <div className="pointer-events-none absolute right-5 top-1/2 -translate-y-1/2 text-xl text-slate-400">
                ⌕
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          FILTROS
      ===================================================== */}

      <section className="border-b border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
            <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-sm font-semibold text-slate-900">
                  Filtrar productos
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  Refiná tu búsqueda para encontrar el repuesto más rápido.
                </p>
              </div>

              {hayFiltros && (
                <button
                  type="button"
                  onClick={limpiarFiltros}
                  className="self-start text-xs font-semibold text-slate-700 transition hover:text-slate-950 hover:underline sm:self-auto"
                >
                  Limpiar filtros
                </button>
              )}
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {/* CATEGORÍA */}

              <div>
                <label
                  htmlFor="categoria"
                  className="text-xs font-semibold uppercase tracking-wide text-slate-500"
                >
                  Categoría
                </label>

                <select
                  id="categoria"
                  value={categoriaId !== undefined ? String(categoriaId) : ""}
                  onChange={(event) =>
                    handleCategoriaChange(event.target.value)
                  }
                  disabled={loadingFiltros}
                  className="mt-2 w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-800 outline-none transition hover:border-slate-300 focus:border-slate-900 focus:bg-white focus:ring-4 focus:ring-slate-900/5 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <option value="">Todas las categorías</option>

                  {categorias.map((categoria) => (
                    <option key={categoria.id} value={categoria.id}>
                      {categoria.nombre}
                    </option>
                  ))}
                </select>
              </div>

              {/* TIPO */}

              <div>
                <label
                  htmlFor="tipo"
                  className="text-xs font-semibold uppercase tracking-wide text-slate-500"
                >
                  Tipo
                </label>

                <select
                  id="tipo"
                  value={tipoId !== undefined ? String(tipoId) : ""}
                  onChange={(event) => handleTipoChange(event.target.value)}
                  disabled={
                    loadingFiltros ||
                    categoriaId === undefined || tipos.length === 0
                  }
                  className="mt-2 w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-800 outline-none transition hover:border-slate-300 focus:border-slate-900 focus:bg-white focus:ring-4 focus:ring-slate-900/5 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <option value="">
                    {categoriaId === undefined
                      ? "Seleccioná una categoría"
                      : tipos.length === 0
                        ? "Sin tipos disponibles"
                        : "Todos los tipos"}
                  </option>

                  {tipos.map((tipo) => (
                    <option key={tipo.id} value={tipo.id}>
                      {tipo.nombre}
                    </option>
                  ))}
                </select>
              </div>

              {/* MARCA */}

              <div>
                <label
                  htmlFor="marca"
                  className="text-xs font-semibold uppercase tracking-wide text-slate-500"
                >
                  Marca
                </label>

                <select
                  id="marca"
                  value={marcaId !== undefined ? String(marcaId) : ""}
                  onChange={(event) => handleMarcaChange(event.target.value)}
                  disabled={
                    loadingFiltros || loadingMarcas || tipoId === undefined
                  }
                  className="mt-2 w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-800 outline-none transition hover:border-slate-300 focus:border-slate-900 focus:bg-white focus:ring-4 focus:ring-slate-900/5 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <option value="">
                    {tipoId === undefined
                      ? "Seleccioná un tipo"
                      : loadingMarcas
                        ? "Cargando marcas..."
                        : marcas.length === 0
                          ? "Sin marcas disponibles"
                          : "Todas las marcas"}
                  </option>

                  {marcas.map((marca) => (
                    <option key={marca.id} value={marca.id}>
                      {marca.nombre}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* FILTROS ACTIVOS */}

            {hayFiltros && (
              <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-slate-100 pt-5">
                <span className="mr-1 text-xs font-medium text-slate-500">
                  Activos:
                </span>

                {categoriaPadreSeleccionada && (
                  <span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-700">
                    {categoriaPadreSeleccionada.nombre}
                  </span>
                )}

                {tipoSeleccionado && (
                  <span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-700">
                    {tipoSeleccionado.nombre}
                  </span>
                )}

                {marcaSeleccionada && (
                  <span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-700">
                    {marcaSeleccionada.nombre}
                  </span>
                )}

                {buscar && (
                  <span className="max-w-full truncate rounded-full bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-700">
                    “{buscar}”
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* =====================================================
          PRODUCTOS
      ===================================================== */}

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        {/* CABECERA */}

        {!loading && !error && (
          <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-900">
                {total}{" "}
                {total === 1 ? "producto encontrado" : "productos encontrados"}
              </p>

              <p className="mt-1 text-xs text-slate-500">
                Página {page}
                {totalPaginas > 0 && ` de ${totalPaginas}`}
              </p>
            </div>

            {hayFiltros && (
              <button
                type="button"
                onClick={limpiarFiltros}
                className="text-sm font-semibold text-slate-700 transition hover:text-slate-950"
              >
                Ver todos →
              </button>
            )}
          </div>
        )}

        {/* LOADING */}

        {loading && (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({
              length: 8,
            }).map((_, index) => (
              <div
                key={index}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-white"
              >
                <div className="aspect-square animate-pulse bg-slate-100" />

                <div className="space-y-3 p-5">
                  <div className="h-3 w-20 animate-pulse rounded bg-slate-100" />

                  <div className="h-5 w-3/4 animate-pulse rounded bg-slate-100" />

                  <div className="h-4 w-full animate-pulse rounded bg-slate-100" />

                  <div className="h-4 w-2/3 animate-pulse rounded bg-slate-100" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ERROR */}

        {error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
            <p className="text-sm font-semibold text-red-800">
              No pudimos cargar el catálogo.
            </p>

            <p className="mt-1 text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* RESULTADOS */}

        {!loading && !error && (
          <>
            {productos.length === 0 ? (
              <div className="rounded-3xl border border-slate-200 bg-slate-50 px-6 py-16 text-center sm:px-12">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-2xl shadow-sm">
                  ⌕
                </div>

                <h2 className="mt-5 text-xl font-semibold text-slate-900">
                  No encontramos productos
                </h2>

                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                  Probá con otro nombre, código, marca o categoría.
                </p>

                <button
                  type="button"
                  onClick={limpiarFiltros}
                className="mt-6 rounded-xl bg-brand-red px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-brand-red-dark"
                >
                  Limpiar búsqueda
                </button>
              </div>
            ) : (
              <>
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
                  {productos.map((producto) => (
                    <ProductoCard key={producto.id} producto={producto} />
                  ))}
                </div>

                {/* =================================================
                    PAGINACIÓN
                ================================================= */}

                {totalPaginas > 1 && (
                  <div className="mt-10 flex items-center justify-center gap-2">
                    <button
                      type="button"
                      disabled={page <= 1}
                      onClick={() => handlePageChange(page - 1)}
                      className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      ← Anterior
                    </button>

                    <span className="px-3 text-sm font-medium text-slate-600">
                      Página {page} de {totalPaginas}
                    </span>

                    <button
                      type="button"
                      disabled={page >= totalPaginas}
                      onClick={() => handlePageChange(page + 1)}
                      className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      Siguiente →
                    </button>
                  </div>
                )}
              </>
            )}
          </>
        )}
      </section>
    </>
  );
}

export default CatalogoPage;
