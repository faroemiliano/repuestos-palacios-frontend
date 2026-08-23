import { useEffect, useState } from "react";

import {
  aplicarAumentoPrecios,
  deshacerAumentoPrecios,
  getHistorialPrecios,
  type ActualizacionPrecio,
} from "../../services/precio_services";

function AdminPreciosPage() {
  const [porcentaje, setPorcentaje] = useState("");
  const [soloActivos, setSoloActivos] = useState(true);
  const [historial, setHistorial] = useState<ActualizacionPrecio[]>([]);
  const [cargandoHistorial, setCargandoHistorial] = useState(true);
  const [actualizando, setActualizando] = useState(false);
  const [deshaciendoId, setDeshaciendoId] = useState<number | null>(null);
  const [resultado, setResultado] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function cargarHistorial() {
    try {
      setCargandoHistorial(true);
      setHistorial(await getHistorialPrecios());
    } catch (error) {
      setError(error instanceof Error ? error.message : "No se pudo cargar el historial.");
    } finally {
      setCargandoHistorial(false);
    }
  }

  useEffect(() => { cargarHistorial(); }, []);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    setResultado(null);

    const valor = Number(porcentaje.replace(",", "."));
    if (!Number.isFinite(valor) || valor <= 0 || valor > 1000) {
      setError("Ingresá un porcentaje mayor a 0 y hasta 1000.");
      return;
    }

    const alcance = soloActivos ? "todos los productos activos" : "todos los productos";
    if (!window.confirm(`Vas a aumentar un ${valor}% ${alcance}. Esta acción afectará los precios de forma inmediata. ¿Deseás continuar?`)) {
      return;
    }

    try {
      setActualizando(true);
      const respuesta = await aplicarAumentoPrecios({ porcentaje: valor, solo_activos: soloActivos });
      setResultado(`Se actualizaron ${respuesta.productos_actualizados.toLocaleString("es-AR")} productos con un aumento de ${respuesta.porcentaje_aplicado}%`);
      setPorcentaje("");
      await cargarHistorial();
    } catch (error) {
      setError(error instanceof Error ? error.message : "No se pudo aplicar el aumento.");
    } finally {
      setActualizando(false);
    }
  }

  async function handleDeshacer(item: ActualizacionPrecio) {
    setError(null);
    setResultado(null);
    const confirmar = window.confirm(
      `Se restaurarán exactamente los ${item.productos_actualizados.toLocaleString("es-AR")} precios anteriores a este aumento. Solo puede deshacerse la última actualización. ¿Deseás continuar?`,
    );
    if (!confirmar) return;

    try {
      setDeshaciendoId(item.id);
      const respuesta = await deshacerAumentoPrecios(item.id);
      setResultado(`Se restauraron ${respuesta.productos_restaurados.toLocaleString("es-AR")} precios al valor anterior.`);
      await cargarHistorial();
    } catch (error) {
      setError(error instanceof Error ? error.message : "No se pudo deshacer el aumento.");
    } finally {
      setDeshaciendoId(null);
    }
  }

  const ultimaDeshacibleId = historial.find(
    (item) => item.detalles_guardados && !item.deshecha_en,
  )?.id;

  return (
    <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <p className="text-sm font-semibold uppercase tracking-wider text-slate-500">Precios</p>
      <h1 className="mt-2 text-3xl font-bold text-slate-900">Actualización masiva de precios</h1>
      <p className="mt-2 max-w-2xl text-slate-500">Aplicá un aumento general de forma segura. Cada actualización nueva guarda los precios previos para poder deshacerla si hubo un error.</p>

      <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <form className="max-w-xl" onSubmit={handleSubmit}>
          <label className="block text-sm font-semibold text-slate-700" htmlFor="porcentaje-aumento">Porcentaje de aumento</label>
          <div className="relative mt-2">
            <input id="porcentaje-aumento" type="number" min="0.01" max="1000" step="0.01" value={porcentaje} onChange={(event) => setPorcentaje(event.target.value)} placeholder="Ej. 12,5" className="w-full rounded-xl border border-slate-300 px-4 py-3 pr-10 text-lg outline-none focus:border-slate-900" required />
            <span className="absolute right-4 top-3.5 text-lg font-semibold text-slate-500">%</span>
          </div>
          <label className="mt-5 flex cursor-pointer items-center gap-3 text-sm text-slate-700">
            <input type="checkbox" checked={soloActivos} onChange={(event) => setSoloActivos(event.target.checked)} className="h-4 w-4 rounded border-slate-300" />
            Actualizar solamente productos activos
          </label>
          <p className="mt-3 text-sm text-slate-500">Vista previa: los precios aumentarán un <strong>{porcentaje || "0"}%</strong>.</p>
          {error && <p className="mt-5 rounded-xl bg-red-50 p-4 text-sm text-red-600">{error}</p>}
          {resultado && <p className="mt-5 rounded-xl bg-green-50 p-4 text-sm font-medium text-green-800">{resultado}</p>}
          <button disabled={actualizando} className="mt-6 rounded-xl bg-slate-950 px-5 py-3 font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50">
            {actualizando ? "Actualizando precios…" : "Aplicar aumento"}
          </button>
        </form>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-bold text-slate-900">Historial de actualizaciones</h2>
        {cargandoHistorial ? <p className="mt-4 text-slate-500">Cargando historial…</p> : historial.length === 0 ? <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-6 text-slate-500">Todavía no se realizaron aumentos masivos.</div> : <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200 bg-white"><div className="overflow-x-auto"><table className="w-full min-w-[760px]"><thead className="bg-slate-50 text-left text-xs uppercase tracking-wider text-slate-500"><tr><th className="px-5 py-4">Fecha</th><th className="px-5 py-4">Aumento</th><th className="px-5 py-4">Alcance</th><th className="px-5 py-4">Productos</th><th className="px-5 py-4">Admin</th><th className="px-5 py-4">Acción</th></tr></thead><tbody className="divide-y divide-slate-200">{historial.map((item) => <tr key={item.id}><td className="px-5 py-4 text-sm text-slate-600">{new Intl.DateTimeFormat("es-AR", { dateStyle: "short", timeStyle: "short" }).format(new Date(item.creado_en))}</td><td className="px-5 py-4 font-semibold text-slate-900">+{item.porcentaje_aplicado}%</td><td className="px-5 py-4 text-sm text-slate-600">{item.solo_activos ? "Solo activos" : "Todos"}</td><td className="px-5 py-4 text-sm text-slate-600">{item.productos_actualizados.toLocaleString("es-AR")}</td><td className="px-5 py-4 text-sm text-slate-600">#{item.admin_id}</td><td className="px-5 py-4 text-sm">{item.deshecha_en ? <span className="font-medium text-slate-500">Deshecha</span> : item.id === ultimaDeshacibleId ? <button type="button" onClick={() => handleDeshacer(item)} disabled={deshaciendoId !== null} className="rounded-lg border border-amber-300 px-3 py-1.5 font-semibold text-amber-800 transition hover:bg-amber-50 disabled:cursor-not-allowed disabled:opacity-50">{deshaciendoId === item.id ? "Restaurando…" : "Deshacer"}</button> : !item.detalles_guardados ? <span className="text-slate-400">Sin respaldo</span> : <span className="text-slate-400">No disponible</span>}</td></tr>)}</tbody></table></div></div>}
      </section>
    </main>
  );
}

export default AdminPreciosPage;
