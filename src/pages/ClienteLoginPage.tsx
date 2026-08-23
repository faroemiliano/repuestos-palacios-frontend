import { GoogleLogin } from "@react-oauth/google";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

import { loginClienteWithGoogle } from "../services/cliente_auth_services";

function ClienteLoginPage() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [procesando, setProcesando] = useState(false);

  async function handleGoogleSuccess(response: { credential?: string }) {
    if (!response.credential) {
      setError("Google no devolvió una credencial. Cerrá la ventana de Google e intentá nuevamente.");
      return;
    }

    try {
      setError("");
      setProcesando(true);
      const login = await loginClienteWithGoogle(response.credential);
      localStorage.setItem("cliente_token", login.access_token);
      navigate(
        login.cliente.perfil_completo && login.cliente.estado === "aprobado"
          ? "/catalogo"
          : "/mi-cuenta",
      );
    } catch (error) {
      console.error(error);
      setError(error instanceof Error ? error.message : "No pudimos iniciar sesión. Intentá nuevamente.");
    } finally {
      setProcesando(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <p className="text-center text-sm font-semibold uppercase tracking-widest text-slate-500">Repuestos Palacios</p>
        <h1 className="mt-3 text-center text-2xl font-bold text-slate-900">Ver precios</h1>
        <p className="mt-2 text-center text-sm leading-6 text-slate-500">
          Ingresá con Google y completá tus datos para consultar los precios del catálogo.
        </p>
        <div className="mt-8 flex justify-center">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => setError("Google rechazó el inicio de sesión antes de enviar la credencial. Revisá la configuración del cliente OAuth y los orígenes autorizados.")}
            use_fedcm_for_button
          />
        </div>
        {error && <p className="mt-4 text-center text-sm text-red-600">{error}</p>}
        {procesando && <p className="mt-4 text-center text-sm text-slate-500">Validando tu cuenta…</p>}
        <Link to="/catalogo" className="mt-8 block text-center text-sm font-semibold text-slate-600 hover:text-slate-950">
          Seguir viendo productos sin precios
        </Link>
      </div>
    </main>
  );
}

export default ClienteLoginPage;
