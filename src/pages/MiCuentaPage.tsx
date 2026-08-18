import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { actualizarClientePerfil, getClientePerfil } from "../services/cliente_auth_services";

function MiCuentaPage() {
  const navigate = useNavigate();
  const [nombre, setNombre] = useState("");
  const [empresa, setEmpresa] = useState("");
  const [email, setEmail] = useState("");
  const [telefono, setTelefono] = useState("");
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    getClientePerfil()
      .then((cliente) => {
        setNombre(cliente.nombre ?? "");
        setEmpresa(cliente.empresa ?? "");
        setEmail(cliente.email);
        setTelefono(cliente.telefono ?? "");
      })
      .catch(() => navigate("/ingresar"))
      .finally(() => setCargando(false));
  }, [navigate]);

  async function guardar(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    setGuardando(true);
    try {
      await actualizarClientePerfil({ nombre, empresa, telefono });
      navigate("/catalogo");
    } catch {
      setError("No se pudieron guardar tus datos. Revisá la información e intentá nuevamente.");
    } finally {
      setGuardando(false);
    }
  }

  if (cargando) return <main className="mx-auto max-w-lg px-4 py-20 text-slate-500">Cargando tu cuenta…</main>;

  return (
    <main className="mx-auto max-w-lg px-4 py-16">
      <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm sm:p-9">
        <h1 className="text-2xl font-bold text-slate-900">Completá tus datos</h1>
        <p className="mt-2 text-sm leading-6 text-slate-500">Necesitamos estos datos para habilitarte los precios del catálogo.</p>
        <form className="mt-7 space-y-5" onSubmit={guardar}>
          <label className="block text-sm font-semibold text-slate-700">Nombre y apellido
            <input required minLength={2} value={nombre} onChange={(event) => setNombre(event.target.value)} className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-slate-900" />
          </label>
          <label className="block text-sm font-semibold text-slate-700">Empresa
            <input required minLength={2} value={empresa} onChange={(event) => setEmpresa(event.target.value)} className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-slate-900" placeholder="Nombre de la empresa" />
          </label>
          <label className="block text-sm font-semibold text-slate-700">Email
            <input value={email} readOnly className="mt-2 w-full cursor-not-allowed rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-500" />
          </label>
          <label className="block text-sm font-semibold text-slate-700">Teléfono
            <input required minLength={6} value={telefono} onChange={(event) => setTelefono(event.target.value)} className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-slate-900" placeholder="Ej. 11 1234 5678" />
          </label>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button disabled={guardando} className="w-full rounded-xl bg-slate-950 px-5 py-3 font-semibold text-white transition hover:bg-slate-800 disabled:opacity-60">
            {guardando ? "Guardando…" : "Guardar y ver precios"}
          </button>
        </form>
      </div>
    </main>
  );
}

export default MiCuentaPage;
