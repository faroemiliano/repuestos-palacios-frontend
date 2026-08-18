import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

import logoRepuestosPalacios from "../../assets/logo-repuestos-palacios.png";

function Header() {
  const [menuAbierto, setMenuAbierto] = useState(false);
  const navigate = useNavigate();
  const clienteLogueado = Boolean(localStorage.getItem("cliente_token"));
  const adminLogueado = Boolean(localStorage.getItem("admin_token"));

  const links = [
    {
      to: "/",
      label: "Inicio",
      end: true,
    },
    {
      to: "/catalogo",
      label: "Catálogo",
    },
    {
      to: "/marcas",
      label: "Marcas",
    },
    {
      to: "/contacto",
      label: "Contacto",
    },
  ];

  function cerrarMenu() {
    setMenuAbierto(false);
  }

  function cerrarSesion() {
    localStorage.removeItem("cliente_token");
    cerrarMenu();
    navigate("/catalogo");
  }

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 shadow-sm backdrop-blur">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* LOGO */}

        <NavLink
          to="/"
          onClick={cerrarMenu}
          className="group flex items-center gap-3"
        >
          <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition group-hover:shadow-md">
            <img
              src={logoRepuestosPalacios}
              alt="Repuestos Palacios"
              className="h-full w-full object-contain"
            />
          </div>

          <div className="hidden sm:block">
            <span className="block text-base font-bold tracking-tight text-slate-950">
              Repuestos Palacios
            </span>

            <span className="block text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400">
              Repuestos eléctricos
            </span>
          </div>
        </NavLink>

        {/* NAVEGACIÓN DESKTOP */}

        <nav className="hidden items-center gap-1 md:flex">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                `relative px-4 py-3 text-sm font-semibold transition ${
                  isActive
                    ? "text-slate-950"
                    : "text-slate-500 hover:text-slate-950"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {link.label}

                  {isActive && (
                    <span className="absolute bottom-0 left-4 right-4 h-0.5 rounded-full bg-brand-red" />
                  )}
                </>
              )}
            </NavLink>
          ))}

          {/* CTA */}

          <NavLink
            to={adminLogueado ? "/admin" : clienteLogueado ? "/mi-cuenta" : "/ingresar"}
            className="ml-4 rounded-lg bg-brand-red px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-red-dark"
          >
            {adminLogueado ? "Panel admin" : clienteLogueado ? "Mi cuenta" : "Ver precios"}
          </NavLink>
          {clienteLogueado && (
            <button type="button" onClick={cerrarSesion} className="ml-2 px-3 py-2 text-sm font-semibold text-slate-600 transition hover:text-slate-950">
              Cerrar sesión
            </button>
          )}
        </nav>

        {/* BOTÓN MOBILE */}

        <button
          type="button"
          onClick={() => setMenuAbierto((actual) => !actual)}
          className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 md:hidden"
          aria-label={menuAbierto ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={menuAbierto}
        >
          <span className="text-lg">{menuAbierto ? "✕" : "☰"}</span>
        </button>
      </div>

      {/* MENÚ MOBILE */}

      {menuAbierto && (
        <nav className="border-t border-slate-200 bg-white md:hidden">
          <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                onClick={cerrarMenu}
                className={({ isActive }) =>
                  `block rounded-xl px-4 py-3.5 text-sm font-semibold transition ${
                    isActive
                      ? "bg-slate-100 text-slate-950"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-950"
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}

            <NavLink
              to={adminLogueado ? "/admin" : clienteLogueado ? "/mi-cuenta" : "/ingresar"}
              onClick={cerrarMenu}
              className="mt-2 block rounded-xl bg-brand-red px-4 py-3.5 text-center text-sm font-semibold text-white transition hover:bg-brand-red-dark"
            >
              {adminLogueado ? "Panel admin" : clienteLogueado ? "Mi cuenta" : "Ver precios"}
            </NavLink>
            {clienteLogueado && (
              <button type="button" onClick={cerrarSesion} className="mt-2 block w-full rounded-xl border border-slate-300 px-4 py-3.5 text-center text-sm font-semibold text-slate-700 transition hover:border-slate-900 hover:text-slate-950">
                Cerrar sesión
              </button>
            )}
          </div>
        </nav>
      )}
    </header>
  );
}

export default Header;
