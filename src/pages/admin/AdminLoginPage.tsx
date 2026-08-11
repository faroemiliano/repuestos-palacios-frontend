import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";

import { loginWithGoogle } from "../../services/admin_auth_services";

function AdminLoginPage() {
  const navigate = useNavigate();

  async function handleGoogleSuccess(credentialResponse: {
    credential?: string;
  }) {
    if (!credentialResponse.credential) {
      console.error("Google no devolvió una credencial.");
      return;
    }

    try {
      const response = await loginWithGoogle(credentialResponse.credential);

      console.log("🔥 LOGIN ADMIN CORRECTO:", response);

      localStorage.setItem("admin_token", response.access_token);
      console.log("🔐 TOKEN GUARDADO:", localStorage.getItem("admin_token"));
      console.log("➡️ NAVEGANDO A /admin");

      navigate("/admin");
    } catch (error) {
      console.error("❌ ERROR LOGIN ADMIN:", error);
    }
  }

  function handleGoogleError() {
    console.error("❌ Error al iniciar sesión con Google");
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
          />
        </div>
      </div>
    </main>
  );
}

export default AdminLoginPage;
