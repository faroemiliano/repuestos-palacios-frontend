import { Link } from "react-router-dom";

function Hero() {
  return (
    <section className="bg-slate-950">
      <div className="mx-auto max-w-7xl px-6 py-20 sm:py-24 lg:py-32">
        <div className="max-w-3xl">
          <span className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">
            Repuestos y accesorios
          </span>

          <h1 className="mt-4 text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
            Encontrá el repuesto que estás buscando
          </h1>

          <p className="mt-6 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg sm:leading-8">
            Consultá nuestro catálogo de repuestos para vehículos, encontrá el
            producto que necesitás y contactanos para realizar tu consulta.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:mt-10 sm:flex-row sm:gap-4">
            <Link
              to="/catalogo"
              className="rounded-lg bg-white px-6 py-3 text-center text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
            >
              Ver catálogo
            </Link>

            <Link
              to="/contacto"
              className="rounded-lg border border-slate-600 px-6 py-3 text-center text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Contactanos
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
