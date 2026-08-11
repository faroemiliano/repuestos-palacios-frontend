import { Link, useNavigate } from "react-router-dom";

function AdminSidebar() {
  const navigate = useNavigate();

  function handleLogout() {
    localStorage.removeItem("admin_token");
    navigate("/admin/login");
  }

  return (
    <aside className="hidden w-64 shrink-0 border-r border-slate-200 bg-white md:block">
      <div className="flex h-full min-h-screen flex-col">
        <div className="border-b border-slate-200 p-6">
          <p className="text-lg font-bold text-slate-900">Repuestos Palacios</p>

          <p className="mt-1 text-xs text-slate-500">Panel administrativo</p>
        </div>

        <nav className="flex-1 p-4">
          <div className="space-y-1">
            <Link
              to="/admin"
              className="block rounded-lg px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-100"
            >
              Dashboard
            </Link>

            <Link
              to="/admin/productos"
              className="block rounded-lg px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-100"
            >
              Productos
            </Link>

            <Link
              to="/admin/marcas"
              className="block rounded-lg px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-100"
            >
              Marcas
            </Link>

            <Link
              to="/admin/categorias"
              className="block rounded-lg px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-100"
            >
              Categorías
            </Link>

            <Link
              to="/admin/consultas"
              className="block rounded-lg px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-100"
            >
              Consultas
            </Link>
          </div>
        </nav>

        <div className="border-t border-slate-200 p-4">
          <button
            type="button"
            onClick={handleLogout}
            className="w-full rounded-lg px-4 py-3 text-left text-sm font-medium text-red-600 hover:bg-red-50"
          >
            Cerrar sesión
          </button>
        </div>
      </div>
    </aside>
  );
}

export default AdminSidebar;
