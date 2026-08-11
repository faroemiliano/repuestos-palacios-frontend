import { useState } from "react";
import { Link } from "react-router-dom";

function Header() {
  const [menuAbierto, setMenuAbierto] = useState(false);

  function cerrarMenu() {
    setMenuAbierto(false);
  }

  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
        {/* Logo */}

        <Link
          to="/"
          onClick={cerrarMenu}
          className="text-xl font-bold tracking-tight text-slate-900"
        >
          Repuestos Palacios
        </Link>

        {/* Navegación desktop */}

        <nav className="hidden items-center gap-8 md:flex">
          <Link
            to="/"
            className="text-sm font-medium text-slate-700 transition hover:text-slate-950"
          >
            Inicio
          </Link>

          <Link
            to="/catalogo"
            className="text-sm font-medium text-slate-700 transition hover:text-slate-950"
          >
            Catálogo
          </Link>

          <Link
            to="/marcas"
            className="text-sm font-medium text-slate-700 transition hover:text-slate-950"
          >
            Marcas
          </Link>

          <Link
            to="/contacto"
            className="text-sm font-medium text-slate-700 transition hover:text-slate-950"
          >
            Contacto
          </Link>
        </nav>

        {/* Botón mobile */}

        <button
          type="button"
          onClick={() => setMenuAbierto(!menuAbierto)}
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 text-slate-700 transition hover:bg-slate-50 md:hidden"
          aria-label={menuAbierto ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={menuAbierto}
        >
          {menuAbierto ? "✕" : "☰"}
        </button>
      </div>

      {/* Menú mobile */}

      {menuAbierto && (
        <nav className="border-t border-slate-200 bg-white px-6 py-4 md:hidden">
          <div className="flex flex-col">
            <Link
              to="/"
              onClick={cerrarMenu}
              className="border-b border-slate-100 py-4 text-sm font-medium text-slate-700"
            >
              Inicio
            </Link>

            <Link
              to="/catalogo"
              onClick={cerrarMenu}
              className="border-b border-slate-100 py-4 text-sm font-medium text-slate-700"
            >
              Catálogo
            </Link>

            <Link
              to="/marcas"
              onClick={cerrarMenu}
              className="border-b border-slate-100 py-4 text-sm font-medium text-slate-700"
            >
              Marcas
            </Link>

            <Link
              to="/contacto"
              onClick={cerrarMenu}
              className="py-4 text-sm font-medium text-slate-700"
            >
              Contacto
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}

export default Header;
