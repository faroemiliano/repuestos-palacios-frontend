import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

import { loginWithGoogle } from "../../services/admin_auth_services";
import logoRepuestosPalacios from "../../assets/logo-repuestos-palacios.png";

function AdminLoginPage() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [procesando, setProcesando] = useState(false);

  async function handleGoogleSuccess(credentialResponse: {
    credential?: string;
  }) {
    if (!credentialResponse.credential) {
      console.error("Google no devolvió una credencial.");
      setError("Google no devolvió una credencial. Intentá nuevamente.");
      return;
    }

    try {
      setError("");
      setProcesando(true);
      const response = await loginWithGoogle(credentialResponse.credential);

      console.log("🔥 LOGIN ADMIN CORRECTO:", response);

      localStorage.setItem("admin_token", response.access_token);
      console.log("🔐 TOKEN GUARDADO:", localStorage.getItem("admin_token"));
      console.log("➡️ NAVEGANDO A /admin");

      navigate("/admin");
    } catch (error) {
      console.error("❌ ERROR LOGIN ADMIN:", error);
      setError(error instanceof Error ? error.message : "No se pudo iniciar sesión.");
    } finally {
      setProcesando(false);
    }
  }

  function handleGoogleError() {
    console.error("❌ Error al iniciar sesión con Google");
    setError("Google rechazó el inicio de sesión antes de enviar la credencial. Revisá la configuración del cliente OAuth y los orígenes autorizados.");
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-50 px-4">
      <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-brand-red/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -right-24 h-80 w-80 rounded-full bg-slate-300/40 blur-3xl" />

      <div className="relative w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-2xl shadow-slate-300/30">
        <div className="text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-white p-1 shadow-sm">
            <img
              src={logoRepuestosPalacios}
              alt="Repuestos Palacios"
              className="h-full w-full object-contain"
            />
          </div>
          <p className="mt-6 text-xs font-bold uppercase tracking-[0.2em] text-brand-red">
            Repuestos Palacios
          </p>

          <h1 className="mt-3 text-2xl font-bold text-slate-900">
            Panel administrativo
          </h1>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            Ingresá con la cuenta de Google autorizada.
          </p>
        </div>

        <div className="mt-8 flex justify-center">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleError}
            use_fedcm_for_button
          />
        </div>
        {error && <p className="mt-4 text-center text-sm text-red-600">{error}</p>}
        {procesando && <p className="mt-4 text-center text-sm text-slate-500">Validando cuenta…</p>}
      </div>
    </main>
  );
}

export default AdminLoginPage;
