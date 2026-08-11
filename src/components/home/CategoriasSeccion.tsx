import { Link } from "react-router-dom";

function ContactCTA() {
  return (
    <section className="bg-slate-950">
      <div className="mx-auto max-w-7xl px-6 py-16 sm:py-20 lg:py-24">
        <div className="flex flex-col gap-8 rounded-3xl border border-slate-800 bg-slate-900 p-8 sm:p-10 lg:flex-row lg:items-center lg:justify-between lg:p-12">
          {/* Texto */}

          <div className="max-w-2xl">
            <span className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">
              ¿Necesitás ayuda?
            </span>

            <h2 className="mt-3 text-2xl font-bold tracking-tight text-white sm:text-3xl">
              ¿No encontrás el repuesto que buscás?
            </h2>

            <p className="mt-4 text-base leading-7 text-slate-300 sm:text-lg">
              Contactanos y consultanos por el repuesto que necesitás. Te
              ayudamos a encontrarlo.
            </p>
          </div>

          {/* Botón */}

          <Link
            to="/contacto"
            className="w-full shrink-0 rounded-lg bg-white px-6 py-3 text-center text-sm font-semibold text-slate-900 transition hover:bg-slate-100 sm:w-auto"
          >
            Hacer una consulta
          </Link>
        </div>
      </div>
    </section>
  );
}

export default ContactCTA;
