import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";

import logoRepuestosPalacios from "../../assets/logo-repuestos-palacios.png";

function AdminLayout() {
  const navigate = useNavigate();

  function handleLogout() {
    localStorage.removeItem("admin_token");
    navigate("/admin/login", { replace: true });
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* =========================
          HEADER
          ========================= */}

      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 shadow-sm backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
          {/* LOGO */}

          <Link to="/admin" className="group flex items-center gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-white p-1 shadow-sm transition group-hover:shadow-md">
              <img
                src={logoRepuestosPalacios}
                alt="Repuestos Palacios"
                className="h-full w-full object-contain"
              />
            </div>

            <div>
              <p className="text-base font-bold tracking-tight text-slate-900">
                Repuestos Palacios
              </p>
              <p className="mt-0.5 text-xs font-medium text-slate-500">
                Panel administrativo
              </p>
            </div>
          </Link>

          {/* LOGOUT */}

          <div className="flex items-center gap-3">
            <span className="hidden rounded-full bg-brand-red-soft px-3 py-1.5 text-xs font-semibold text-brand-red-dark sm:block">
              Administrador
            </span>
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:border-brand-red hover:bg-brand-red-soft hover:text-brand-red-dark sm:px-4"
            >
              Cerrar sesión
            </button>
          </div>
        </div>

        {/* =========================
            NAVEGACIÓN ADMIN
            ========================= */}

        <nav className="border-t border-slate-200 bg-slate-50/80">
          <div className="mx-auto flex max-w-7xl gap-1 overflow-x-auto px-4 sm:px-6">
            <NavLink
              to="/admin"
              end
              className={({ isActive }) =>
                `border-b-2 px-4 py-4 text-sm font-medium transition ${
                  isActive
                    ? "border-brand-red text-brand-red-dark"
                    : "border-transparent text-slate-500 hover:text-slate-900"
                }`
              }
            >
              Dashboard
            </NavLink>

            <NavLink
              to="/admin/productos"
              className={({ isActive }) =>
                `border-b-2 px-4 py-4 text-sm font-medium transition ${
                  isActive
                    ? "border-brand-red text-brand-red-dark"
                    : "border-transparent text-slate-500 hover:text-slate-900"
                }`
              }
            >
              Productos
            </NavLink>
            <NavLink
              to="/admin/categorias"
              className={({ isActive }) =>
                `border-b-2 px-4 py-4 text-sm font-medium transition ${
                  isActive
                    ? "border-brand-red text-brand-red-dark"
                    : "border-transparent text-slate-500 hover:text-slate-900"
                }`
              }
            >
              Categorías
            </NavLink>
            <NavLink
              to="/admin/marcas"
              className={({ isActive }) =>
                `border-b-2 px-4 py-4 text-sm font-medium transition ${
                  isActive
                    ? "border-brand-red text-brand-red-dark"
                    : "border-transparent text-slate-500 hover:text-slate-900"
                }`
              }
            >
              Marcas
            </NavLink>
            <NavLink
              to="/admin/precios"
              className={({ isActive }) =>
                `border-b-2 px-4 py-4 text-sm font-medium transition ${
                  isActive
                    ? "border-brand-red text-brand-red-dark"
                    : "border-transparent text-slate-500 hover:text-slate-900"
                }`
              }
            >
              Precios
            </NavLink>
            <NavLink
              to="/admin/clientes"
              className={({ isActive }) =>
                `border-b-2 px-4 py-4 text-sm font-medium transition ${
                  isActive
                    ? "border-brand-red text-brand-red-dark"
                    : "border-transparent text-slate-500 hover:text-slate-900"
                }`
              }
            >
              Solicitudes
            </NavLink>
            <NavLink
              to="/admin/consultas"
              className={({ isActive }) =>
                `border-b-2 px-4 py-4 text-sm font-medium transition ${
                  isActive
                    ? "border-brand-red text-brand-red-dark"
                    : "border-transparent text-slate-500 hover:text-slate-900"
                }`
              }
            >
              Consultas
            </NavLink>
          </div>
        </nav>
      </header>

      {/* =========================
          CONTENIDO
          ========================= */}

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:py-10">
        <Outlet />
      </main>
    </div>
  );
}

export default AdminLayout;
