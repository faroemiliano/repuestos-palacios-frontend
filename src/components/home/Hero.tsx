import { Link } from "react-router-dom";

import logoRepuestosPalacios from "../../assets/logo-repuestos-palacios.png";

function Hero() {
  return (
    <section className="relative overflow-hidden bg-slate-950">
      {/* FONDO DECORATIVO */}

      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -right-40 -top-40 h-96 w-96 rounded-full bg-slate-800/40 blur-3xl" />

        <div className="absolute -bottom-40 left-1/3 h-96 w-96 rounded-full bg-slate-800/30 blur-3xl" />

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.06),transparent_35%)]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-24 lg:px-8 lg:py-28">
        <div className="grid items-center gap-14 lg:grid-cols-[1.1fr_0.9fr] lg:gap-20">
          {/* CONTENIDO */}

          <div className="max-w-3xl">
            {/* ETIQUETA */}

            <div className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-900/70 px-3.5 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-300">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-red" />
              Especialistas en repuestos eléctricos
            </div>

            {/* TÍTULO */}

            <h1 className="mt-6 text-4xl font-bold leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-6xl xl:text-7xl">
              Confianza en cada
              <span className="block text-brand-red">repuesto.</span>
            </h1>

            {/* DESCRIPCIÓN */}

            <p className="mt-7 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg sm:leading-8">
              Alternadores, arranques, iluminación y componentes eléctricos
              para tu vehículo. Buscá por código, producto o marca y encontrá
              el repuesto indicado.
            </p>

            {/* BOTONES */}

            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:gap-4">
              <Link
                to="/catalogo"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-red px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-black/10 transition hover:-translate-y-0.5 hover:bg-brand-red-dark"
              >
                Ver catálogo
                <span aria-hidden="true">→</span>
              </Link>

              <Link
                to="/contacto"
                className="inline-flex items-center justify-center rounded-xl border border-slate-700 bg-slate-900/50 px-6 py-3.5 text-sm font-semibold text-white transition hover:border-slate-500 hover:bg-slate-800"
              >
                Hacer una consulta
              </Link>
            </div>

            {/* DATOS */}

            <div className="mt-10 flex flex-wrap gap-x-8 gap-y-4 border-t border-slate-800 pt-7">
              <div>
                <p className="text-sm font-semibold text-white">
                  Catálogo especializado
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  Alternadores · arranques · luces
                </p>
              </div>

              <div>
                <p className="text-sm font-semibold text-white">
                  Atención personalizada
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  Te ayudamos a encontrarlo
                </p>
              </div>
            </div>
          </div>

          {/* ELEMENTO VISUAL */}

          <div className="relative hidden lg:block">
            <div className="relative mx-auto max-w-md">
              <div className="absolute -inset-6 rounded-[2rem] bg-brand-red/10 blur-3xl" />

              <div className="relative overflow-hidden rounded-3xl border border-white/15 bg-white p-6 shadow-2xl shadow-black/35">
                <div className="absolute inset-x-12 top-0 h-1 bg-brand-red" />

                <img
                  src={logoRepuestosPalacios}
                  alt="Repuestos Palacios — Confianza en cada repuesto"
                  className="aspect-square w-full object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
