import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

import { loginWithGoogle } from "../../services/admin_auth_services";

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
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-slate-500">
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
