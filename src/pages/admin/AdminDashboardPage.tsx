import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { getProductos } from "../../services/producto_services";
import { getMarcas } from "../../services/marca_services";
import { apiFetch } from "../../services/api";
import { getSolicitudesPendientes } from "../../services/cliente_auth_services";

function AdminDashboardPage() {
  const [productos, setProductos] = useState(0);
  const [marcas, setMarcas] = useState(0);
  const [categorias, setCategorias] = useState(0);
  const [consultas, setConsultas] = useState(0);
  const [solicitudes, setSolicitudes] = useState(0);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function cargarDashboard() {
      try {
        setLoading(true);
        setError(null);

        const [
          productosResponse,
          marcasResponse,
          categoriasResponse,
          consultasResponse,
          solicitudesResponse,
        ] = await Promise.all([
          getProductos({
            solo_activos: false,
            page: 1,
            limit: 1,
            orden: "nombre_asc",
          }),

          getMarcas(false),

          apiFetch<any[]>("/categorias/"),

          apiFetch<any[]>("/consultas/"),

          getSolicitudesPendientes(),
        ]);

        setProductos(productosResponse.total);
        setMarcas(marcasResponse.length);
        setCategorias(categoriasResponse.length);
        setConsultas(consultasResponse.length);
        setSolicitudes(solicitudesResponse.length);
      } catch (error) {
        console.error("❌ ERROR CARGANDO DASHBOARD:", error);

        setError("No se pudieron cargar los datos del dashboard.");
      } finally {
        setLoading(false);
      }
    }

    cargarDashboard();
  }, []);

  return (
    <main className="mx-auto max-w-7xl px-6 py-10">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
          Administración
        </p>

        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
          Panel Administrativo
        </h1>

        <p className="mt-3 text-slate-500">
          Gestioná los productos, marcas, categorías y consultas de Repuestos
          Palacios.
        </p>
      </div>

      {error && (
        <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* ESTADÍSTICAS */}

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {/* PRODUCTOS */}

        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <p className="text-sm font-medium text-slate-500">Productos</p>

          <p className="mt-2 text-3xl font-bold text-slate-900">
            {loading ? "—" : productos}
          </p>

          <Link
            to="/admin/productos"
            className="mt-4 inline-block text-sm font-semibold text-slate-900 hover:underline"
          >
            Administrar →
          </Link>
        </div>

        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6">
          <p className="text-sm font-medium text-amber-800">Solicitudes pendientes</p>

          <p className="mt-2 text-3xl font-bold text-slate-900">
            {loading ? "—" : solicitudes}
          </p>

          <Link
            to="/admin/clientes"
            className="mt-4 inline-block text-sm font-semibold text-amber-900 hover:underline"
          >
            Revisar solicitudes →
          </Link>
        </div>

        {/* MARCAS */}

        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <p className="text-sm font-medium text-slate-500">Marcas</p>

          <p className="mt-2 text-3xl font-bold text-slate-900">
            {loading ? "—" : marcas}
          </p>

          <Link
            to="/admin/marcas"
            className="mt-4 inline-block text-sm font-semibold text-slate-900 hover:underline"
          >
            Administrar →
          </Link>
        </div>

        {/* CATEGORÍAS */}

        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <p className="text-sm font-medium text-slate-500">Categorías</p>

          <p className="mt-2 text-3xl font-bold text-slate-900">
            {loading ? "—" : categorias}
          </p>

          <Link
            to="/admin/categorias"
            className="mt-4 inline-block text-sm font-semibold text-slate-900 hover:underline"
          >
            Administrar →
          </Link>
        </div>

        {/* CONSULTAS */}

        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <p className="text-sm font-medium text-slate-500">Consultas</p>

          <p className="mt-2 text-3xl font-bold text-slate-900">
            {loading ? "—" : consultas}
          </p>

          <Link
            to="/admin/consultas"
            className="mt-4 inline-block text-sm font-semibold text-slate-900 hover:underline"
          >
            Ver consultas →
          </Link>
        </div>
      </div>

      {/* ACCIONES RÁPIDAS */}

      <div className="mt-10">
        <h2 className="text-lg font-semibold text-slate-900">
          Acciones rápidas
        </h2>

        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Link
            to="/admin/productos/nuevo"
            className="rounded-xl border border-slate-200 bg-white p-5 transition hover:border-slate-300 hover:shadow-sm"
          >
            <p className="font-semibold text-slate-900">Nuevo producto</p>

            <p className="mt-1 text-sm text-slate-500">
              Agregá un nuevo repuesto al catálogo.
            </p>
          </Link>

          <Link
            to="/admin/productos"
            className="rounded-xl border border-slate-200 bg-white p-5 transition hover:border-slate-300 hover:shadow-sm"
          >
            <p className="font-semibold text-slate-900">Gestionar productos</p>

            <p className="mt-1 text-sm text-slate-500">
              Editá productos, imágenes y disponibilidad.
            </p>
          </Link>

          <Link
            to="/admin/precios"
            className="rounded-xl border border-slate-200 bg-white p-5 transition hover:border-slate-300 hover:shadow-sm"
          >
            <p className="font-semibold text-slate-900">Actualizar precios</p>

            <p className="mt-1 text-sm text-slate-500">
              Aplicá un porcentaje general al catálogo.
            </p>
          </Link>

          <Link
            to="/admin/consultas"
            className="rounded-xl border border-slate-200 bg-white p-5 transition hover:border-slate-300 hover:shadow-sm"
          >
            <p className="font-semibold text-slate-900">Ver consultas</p>

            <p className="mt-1 text-sm text-slate-500">
              Revisá las consultas recibidas de clientes.
            </p>
          </Link>
        </div>
      </div>
    </main>
  );
}

export default AdminDashboardPage;
