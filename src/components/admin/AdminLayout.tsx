import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";

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

      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          {/* LOGO */}

          <Link to="/admin" className="block">
            <p className="text-lg font-bold tracking-tight text-slate-900">
              Repuestos Palacios
            </p>

            <p className="text-xs text-slate-500">Panel administrativo</p>
          </Link>

          {/* LOGOUT */}

          <button
            type="button"
            onClick={handleLogout}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
          >
            Cerrar sesión
          </button>
        </div>

        {/* =========================
            NAVEGACIÓN ADMIN
            ========================= */}

        <nav className="border-t border-slate-200">
          <div className="mx-auto flex max-w-7xl gap-1 overflow-x-auto px-6">
            <NavLink
              to="/admin"
              end
              className={({ isActive }) =>
                `border-b-2 px-4 py-4 text-sm font-medium transition ${
                  isActive
                    ? "border-slate-900 text-slate-900"
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
                    ? "border-slate-900 text-slate-900"
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
                    ? "border-slate-900 text-slate-900"
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
                    ? "border-slate-900 text-slate-900"
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
                    ? "border-slate-900 text-slate-900"
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
                    ? "border-slate-900 text-slate-900"
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

      <main className="mx-auto max-w-7xl px-6 py-8">
        <Outlet />
      </main>
    </div>
  );
}

export default AdminLayout;
