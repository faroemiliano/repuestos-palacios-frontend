import type { Marca } from "../../types/marca_type";
import type { Categoria } from "../../types/categoria_types";

interface CatalogoFiltrosProps {
  buscar: string;
  categoriaId?: number;
  marcaId?: number;

  marcas: Marca[];
  categorias: Categoria[];

  onBuscarChange: (valor: string) => void;
  onCategoriaChange: (valor?: number) => void;
  onMarcaChange: (valor?: number) => void;

  onLimpiar: () => void;
}

function CatalogoFiltros({
  buscar,
  categoriaId,
  marcaId,
  marcas,
  categorias,
  onBuscarChange,
  onCategoriaChange,
  onMarcaChange,
  onLimpiar,
}: CatalogoFiltrosProps) {
  /*
   * =========================
   * CATEGORÍAS PADRE
   * =========================
   */

  const categoriasPadre = categorias.filter(
    (categoria) => categoria.categoria_padre_id === null,
  );

  /*
   * =========================
   * OBTENER HIJAS
   * =========================
   */

  function obtenerHijas(categoriaPadreId: number) {
    return categorias.filter(
      (categoria) => categoria.categoria_padre_id === categoriaPadreId,
    );
  }

  /*
   * =========================
   * RENDER
   * =========================
   */

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="grid gap-5 lg:grid-cols-3">
        {/* =========================
            BUSCADOR
            ========================= */}

        <div className="lg:col-span-1">
          <label
            htmlFor="buscar-producto"
            className="text-sm font-semibold text-slate-700"
          >
            Buscar producto
          </label>

          <div className="relative mt-2">
            <input
              id="buscar-producto"
              type="search"
              value={buscar}
              onChange={(event) => onBuscarChange(event.target.value)}
              placeholder="Nombre o código..."
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 pr-10 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-900 focus:ring-1 focus:ring-slate-900"
            />

            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
              🔍
            </span>
          </div>
        </div>

        {/* =========================
            CATEGORÍA
            ========================= */}

        <div>
          <label
            htmlFor="filtro-categoria"
            className="text-sm font-semibold text-slate-700"
          >
            Categoría
          </label>

          <select
            id="filtro-categoria"
            value={categoriaId !== undefined ? String(categoriaId) : ""}
            onChange={(event) => {
              const value = event.target.value;

              onCategoriaChange(value ? Number(value) : undefined);
            }}
            className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-900 focus:ring-1 focus:ring-slate-900"
          >
            <option value="">Todas las categorías</option>

            {categoriasPadre.map((categoriaPadre) => {
              const hijas = obtenerHijas(categoriaPadre.id);

              return (
                <optgroup key={categoriaPadre.id} label={categoriaPadre.nombre}>
                  <option value={categoriaPadre.id}>
                    Todos los {categoriaPadre.nombre}
                  </option>

                  {hijas.map((hija) => (
                    <option key={hija.id} value={hija.id}>
                      {hija.nombre}
                    </option>
                  ))}
                </optgroup>
              );
            })}
          </select>
        </div>

        {/* =========================
            MARCA
            ========================= */}

        <div>
          <label
            htmlFor="filtro-marca"
            className="text-sm font-semibold text-slate-700"
          >
            Marca
          </label>

          <select
            id="filtro-marca"
            value={marcaId !== undefined ? String(marcaId) : ""}
            onChange={(event) => {
              const value = event.target.value;

              onMarcaChange(value ? Number(value) : undefined);
            }}
            className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-900 focus:ring-1 focus:ring-slate-900"
          >
            <option value="">Todas las marcas</option>

            {marcas.map((marca) => (
              <option key={marca.id} value={marca.id}>
                {marca.nombre}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* =========================
          FILTROS ACTIVOS
          ========================= */}

      {(buscar || categoriaId !== undefined || marcaId !== undefined) && (
        <div className="mt-5 flex flex-col gap-3 border-t border-slate-200 pt-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm text-slate-500">Filtros activos</span>

            {buscar && (
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                Búsqueda: {buscar}
              </span>
            )}

            {marcaId !== undefined && (
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                Marca seleccionada
              </span>
            )}

            {categoriaId !== undefined && (
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                Categoría seleccionada
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={onLimpiar}
            className="self-start text-sm font-semibold text-slate-900 hover:underline sm:self-auto"
          >
            Limpiar filtros
          </button>
        </div>
      )}
    </div>
  );
}

export default CatalogoFiltros;
