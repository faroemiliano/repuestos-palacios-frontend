import { GoogleLogin } from "@react-oauth/google";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import { loginClienteWithGoogle } from "../services/cliente_auth_services";
import logoRepuestosPalacios from "../assets/logo-repuestos-palacios.png";

function ClienteLoginPage() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [procesando, setProcesando] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("cliente_token")) {
      navigate("/mi-cuenta", { replace: true });
    }
  }, [navigate]);

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
    <main className="relative flex min-h-screen items-center overflow-hidden bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute -left-32 -top-32 h-80 w-80 rounded-full bg-brand-red/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-slate-300/40 blur-3xl" />

      <div className="relative mx-auto grid w-full max-w-6xl overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-2xl shadow-slate-300/30 lg:grid-cols-[1.05fr_0.95fr]">
        <section className="relative hidden overflow-hidden bg-slate-950 p-10 text-white lg:flex lg:flex-col lg:justify-between">
          <div className="pointer-events-none absolute -right-28 -top-24 h-72 w-72 rounded-full bg-brand-red/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -left-20 h-64 w-64 rounded-full bg-slate-700/50 blur-3xl" />

          <div className="relative">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-2 text-xs font-semibold uppercase tracking-[0.17em] text-slate-300">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-red" />
              Área de clientes
            </div>

            <h1 className="mt-7 max-w-md text-4xl font-bold leading-tight tracking-tight">
              Accedé a precios y consultá tu próximo repuesto.
            </h1>

            <p className="mt-5 max-w-md text-sm leading-7 text-slate-300">
              Ingresá con tu cuenta de Google, completá tus datos y solicitá el
              acceso al catálogo exclusivo para clientes.
            </p>
          </div>

          <div className="relative mt-10 rounded-3xl border border-white/10 bg-white p-5 shadow-2xl shadow-black/30">
            <img
              src={logoRepuestosPalacios}
              alt="Repuestos Palacios"
              className="mx-auto aspect-square w-full max-w-xs object-contain"
            />
          </div>

          <div className="relative mt-8 grid gap-3 text-sm text-slate-300">
            <p>✓ Catálogo de repuestos eléctricos</p>
            <p>✓ Consultas y atención personalizada</p>
            <p>✓ Precios disponibles para clientes aprobados</p>
          </div>
        </section>

        <section className="relative flex min-h-[36rem] flex-col justify-center p-7 sm:p-12">
          <Link
            to="/"
            className="absolute left-7 top-7 text-sm font-semibold text-slate-500 transition hover:text-brand-red sm:left-10 sm:top-10"
          >
            ← Volver al inicio
          </Link>

          <div className="mx-auto w-full max-w-sm">
            <div className="mx-auto mb-7 flex h-20 w-20 items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-white p-1 shadow-sm lg:hidden">
              <img
                src={logoRepuestosPalacios}
                alt="Repuestos Palacios"
                className="h-full w-full object-contain"
              />
            </div>

            <p className="text-center text-xs font-bold uppercase tracking-[0.2em] text-brand-red sm:text-left">
              Repuestos Palacios
            </p>
            <h2 className="mt-3 text-center text-3xl font-bold tracking-tight text-slate-950 sm:text-left">
              Consultá precios
            </h2>
            <p className="mt-3 text-center text-sm leading-6 text-slate-500 sm:text-left">
              Iniciá sesión con Google para acceder al área de clientes.
            </p>

            <div className="mt-8 flex justify-center rounded-2xl border border-slate-200 bg-slate-50 p-5 sm:justify-start">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() =>
                  setError(
                    "Google rechazó el inicio de sesión antes de enviar la credencial. Revisá la configuración del cliente OAuth y los orígenes autorizados.",
                  )
                }
                use_fedcm_for_button
              />
            </div>

            {error && (
              <p className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-center text-sm text-red-700">
                {error}
              </p>
            )}
            {procesando && (
              <p className="mt-4 text-center text-sm text-slate-500 sm:text-left">
                Validando tu cuenta…
              </p>
            )}

            <div className="mt-8 border-t border-slate-200 pt-6 text-center sm:text-left">
              <p className="text-sm leading-6 text-slate-500">
                ¿Todavía no tenés acceso? Ingresá con Google y completá el
                formulario; un administrador revisará tu solicitud.
              </p>
              <Link
                to="/catalogo"
                className="mt-5 inline-flex text-sm font-semibold text-slate-700 transition hover:text-brand-red"
              >
                Seguir viendo productos sin precios →
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

export default ClienteLoginPage;
