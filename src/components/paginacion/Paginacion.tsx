interface PaginacionProps {
  paginaActual: number;
  totalPaginas: number;
  onCambiarPagina: (pagina: number) => void;
}

function Paginacion({
  paginaActual,
  totalPaginas,
  onCambiarPagina,
}: PaginacionProps) {
  const inicioBloque = Math.floor((paginaActual - 1) / 10) * 10 + 1;
  const finBloque = Math.min(inicioBloque + 9, totalPaginas);
  const paginas = Array.from(
    { length: finBloque - inicioBloque + 1 },
    (_, indice) => inicioBloque + indice,
  );

  if (totalPaginas <= 1) {
    return null;
  }

  return (
    <nav
      aria-label="Paginación"
      className="flex flex-wrap items-center justify-center gap-2"
    >
      <button
        type="button"
        disabled={paginaActual === 1}
        onClick={() => onCambiarPagina(paginaActual - 1)}
        className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
      >
        ← Anterior
      </button>

      <div className="flex flex-wrap justify-center gap-1" aria-label="Páginas">
        {paginas.map((pagina) => (
          <button
            key={pagina}
            type="button"
            onClick={() => onCambiarPagina(pagina)}
            aria-current={pagina === paginaActual ? "page" : undefined}
            className={`h-9 min-w-9 rounded-lg px-2 text-sm font-semibold transition ${
              pagina === paginaActual
                ? "bg-brand-red text-white shadow-sm"
                : "border border-slate-300 bg-white text-slate-700 hover:border-brand-red hover:text-brand-red"
            }`}
          >
            {pagina}
          </button>
        ))}
      </div>

      <button
        type="button"
        disabled={paginaActual === totalPaginas}
        onClick={() => onCambiarPagina(paginaActual + 1)}
        className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
      >
        Siguiente →
      </button>
    </nav>
  );
}

export default Paginacion;
