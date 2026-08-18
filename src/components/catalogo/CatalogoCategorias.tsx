import { Link } from "react-router-dom";

import type { Categoria } from "../../types/categoria_types";

interface CatalogoCategoriasProps {
  categorias: Categoria[];
  categoriaSeleccionadaId?: number;
}

function CatalogoCategorias({
  categorias,
  categoriaSeleccionadaId,
}: CatalogoCategoriasProps) {
  function obtenerHijas(padreId: number) {
    return categorias.filter(
      (categoria) => categoria.categoria_padre_id === padreId,
    );
  }

  function renderCategorias(
    categoriasActuales: Categoria[],
    nivel: number = 0,
  ) {
    return categoriasActuales.map((categoria) => {
      const hijas = obtenerHijas(categoria.id);

      const seleccionada = categoria.id === categoriaSeleccionadaId;

      return (
        <div key={categoria.id}>
          <Link
            to={`/catalogo?categoria=${categoria.id}`}
            className={`
              block rounded-lg px-3 py-2 text-sm font-medium transition
              ${
                seleccionada
                  ? "bg-slate-900 text-white"
                  : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
              }
            `}
            style={{
              marginLeft: `${nivel * 20}px`,
            }}
          >
            {categoria.nombre}
          </Link>

          {hijas.length > 0 && (
            <div className="mt-1">{renderCategorias(hijas, nivel + 1)}</div>
          )}
        </div>
      );
    });
  }

  const categoriasRaiz = categorias.filter(
    (categoria) => categoria.categoria_padre_id === null,
  );

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">
      <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-500">
        Categorías
      </h2>

      <div className="space-y-1">{renderCategorias(categoriasRaiz)}</div>
    </div>
  );
}

export default CatalogoCategorias;
