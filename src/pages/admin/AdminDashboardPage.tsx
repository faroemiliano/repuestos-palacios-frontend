import { Link } from "react-router-dom";

function AdminDashboardPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
          Panel Administrativo
        </h1>
      </div>
      <Link
        to="/admin/productos"
        className="mt-4 inline-block text-sm font-semibold text-slate-900 hover:underline"
      >
        Administrar productos →
      </Link>

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <p className="text-sm text-slate-500">Productos</p>

          <p className="mt-2 text-3xl font-bold text-slate-900">—</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <p className="text-sm text-slate-500">Marcas</p>

          <p className="mt-2 text-3xl font-bold text-slate-900">—</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <p className="text-sm text-slate-500">Categorías</p>

          <p className="mt-2 text-3xl font-bold text-slate-900">—</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <p className="text-sm text-slate-500">Consultas</p>

          <p className="mt-2 text-3xl font-bold text-slate-900">—</p>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboardPage;
