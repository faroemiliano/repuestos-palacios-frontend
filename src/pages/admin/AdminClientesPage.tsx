import { useEffect, useState } from "react";

import {
  getClientesRegistrados,
  responderSolicitud,
  type ClienteSolicitud,
} from "../../services/cliente_auth_services";

function AdminClientesPage() {
  const [solicitudes, setSolicitudes] = useState<ClienteSolicitud[]>([]);
  const [cargando, setCargando] = useState(true);
  const [procesando, setProcesando] = useState<number | null>(null);
  const [error, setError] = useState("");

  async function cargar() {
    try {
      setCargando(true);
      setError("");
      setSolicitudes(await getClientesRegistrados());
    } catch (error) {
      setError(error instanceof Error ? error.message : "No se pudieron cargar las solicitudes.");
    } finally {
      setCargando(false);
    }
  }

  useEffect(() => { cargar(); }, []);

  async function responder(clienteId: number, aprobar: boolean) {
    try {
      setProcesando(clienteId);
      setError("");
      const clienteActualizado = await responderSolicitud(clienteId, aprobar);
      setSolicitudes((actuales) =>
        actuales.map((cliente) =>
          cliente.id === clienteId ? clienteActualizado : cliente,
        ),
      );
    } catch (error) {
      setError(error instanceof Error ? error.message : "No se pudo procesar la solicitud.");
    } finally {
      setProcesando(null);
    }
  }

  return (
    <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <p className="text-sm font-semibold uppercase tracking-wider text-slate-500">Clientes</p>
      <h1 className="mt-2 text-3xl font-bold text-slate-900">Registro de clientes</h1>
      <p className="mt-2 text-slate-500">Aprobá o rechazá las solicitudes y conservá el historial de clientes registrados.</p>
      {error && <p className="mt-6 rounded-xl bg-red-50 p-4 text-sm text-red-600">{error}</p>}
      {cargando ? <p className="mt-8 text-slate-500">Cargando clientes…</p> : solicitudes.length === 0 ? <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-8 text-slate-500">Todavía no hay clientes registrados.</div> : <div className="mt-8 space-y-4">{solicitudes.map((cliente) => <article key={cliente.id} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"><div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between"><div><div className="flex items-center gap-3"><h2 className="text-lg font-bold text-slate-900">{cliente.nombre || "Datos incompletos"}</h2><span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${cliente.estado === "aprobado" ? "bg-green-100 text-green-800" : cliente.estado === "rechazado" ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-800"}`}>{cliente.estado}</span></div><p className="mt-1 text-sm text-slate-500">{cliente.empresa || "Empresa pendiente"}</p><dl className="mt-4 grid gap-1 text-sm text-slate-600"><div><dt className="inline font-semibold">Email: </dt><dd className="inline">{cliente.email}</dd></div><div><dt className="inline font-semibold">Teléfono: </dt><dd className="inline">{cliente.telefono || "Pendiente"}</dd></div></dl></div>{cliente.estado === "pendiente" && <div className="flex gap-3"><button disabled={procesando === cliente.id || !cliente.perfil_completo} onClick={() => responder(cliente.id, true)} className="rounded-lg bg-green-700 px-4 py-2 text-sm font-semibold text-white hover:bg-green-800 disabled:opacity-50">Aprobar</button><button disabled={procesando === cliente.id} onClick={() => responder(cliente.id, false)} className="rounded-lg border border-red-200 px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-50 disabled:opacity-50">Rechazar</button></div>}</div>{!cliente.perfil_completo && <p className="mt-4 text-sm text-amber-700">Aún no completó todos sus datos.</p>}</article>)}</div>}
    </main>
  );
}

export default AdminClientesPage;
