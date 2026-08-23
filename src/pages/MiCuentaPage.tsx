import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { actualizarClientePerfil, getClientePerfil } from "../services/cliente_auth_services";

function MiCuentaPage() {
  const navigate = useNavigate();
  const [nombre, setNombre] = useState("");
  const [empresa, setEmpresa] = useState("");
  const [email, setEmail] = useState("");
  const [telefono, setTelefono] = useState("");
  const [estado, setEstado] = useState<"pendiente" | "aprobado" | "rechazado">("pendiente");
  const [perfilCompleto, setPerfilCompleto] = useState(false);
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
        setEstado(cliente.estado);
        setPerfilCompleto(cliente.perfil_completo);
      })
      .catch(() => {
        localStorage.removeItem("cliente_token");
        navigate("/ingresar", { replace: true });
      })
      .finally(() => setCargando(false));
  }, [navigate]);

  async function guardar(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    setGuardando(true);
    try {
      const cliente = await actualizarClientePerfil({ nombre, empresa, telefono });
      setEstado(cliente.estado);
      setPerfilCompleto(cliente.perfil_completo);
    } catch {
      setError("No se pudieron guardar tus datos. Revisá la información e intentá nuevamente.");
    } finally {
      setGuardando(false);
    }
  }

  function cerrarSesion() {
    localStorage.removeItem("cliente_token");
    navigate("/ingresar", { replace: true });
  }

  if (cargando) return <main className="mx-auto max-w-lg px-4 py-20 text-slate-500">Cargando tu cuenta…</main>;

  if (estado === "rechazado") {
    return <main className="mx-auto max-w-lg px-4 py-16"><div className="rounded-3xl border border-red-200 bg-red-50 p-8"><h1 className="text-2xl font-bold text-slate-900">Solicitud no aprobada</h1><p className="mt-3 text-slate-600">Tu solicitud de acceso fue rechazada. Si creés que es un error, comunicate con Repuestos Palacios.</p></div></main>;
  }

  if (perfilCompleto && estado === "pendiente") {
    return <main className="mx-auto max-w-lg px-4 py-16"><div className="rounded-3xl border border-amber-200 bg-amber-50 p-8"><p className="text-sm font-semibold uppercase tracking-wider text-amber-700">Solicitud pendiente</p><h1 className="mt-2 text-2xl font-bold text-slate-900">Tu cuenta está esperando aprobación</h1><p className="mt-3 leading-6 text-slate-600">Ya recibimos tus datos. Un administrador debe aprobar el registro antes de que puedas ver los precios.</p><p className="mt-3 text-sm text-slate-500">Cuenta: {email}</p><div className="mt-7 flex flex-col gap-3 sm:flex-row"><button type="button" onClick={() => navigate("/catalogo")} className="rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800">Ver catálogo sin precios</button><button type="button" onClick={cerrarSesion} className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 hover:border-slate-900">Cerrar sesión</button></div></div></main>;
  }

  return (
    <main className="mx-auto max-w-lg px-4 py-16">
      <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm sm:p-9">
        <h1 className="text-2xl font-bold text-slate-900">Completá tus datos</h1>
        <p className="mt-2 text-sm leading-6 text-slate-500">Completá tus datos para enviar la solicitud de acceso. Un administrador deberá aprobarla antes de habilitar los precios.</p>
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
            {guardando ? "Enviando…" : "Enviar solicitud"}
          </button>
        </form>
      </div>
    </main>
  );
}

export default MiCuentaPage;
