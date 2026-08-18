import { Link } from "react-router-dom";

function ContactCTA() {
  return (
    <section className="bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <div className="relative overflow-hidden rounded-3xl bg-slate-950 px-6 py-10 shadow-xl sm:px-10 sm:py-12 lg:px-14 lg:py-14">
          {/* DECORACIÓN */}

          <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-slate-800/50 blur-3xl" />

          <div className="pointer-events-none absolute -bottom-32 left-1/3 h-64 w-64 rounded-full bg-slate-800/30 blur-3xl" />

          <div className="pointer-events-none absolute right-10 top-10 hidden h-32 w-32 rounded-full border border-slate-800 lg:block" />

          <div className="relative flex flex-col gap-10 lg:flex-row lg:items-center lg:justify-between">
            {/* TEXTO */}

            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-red" />
                Atención personalizada
              </div>

              <h2 className="mt-4 text-2xl font-bold tracking-tight text-white sm:text-3xl lg:text-4xl">
                ¿No encontrás el repuesto que buscás?
              </h2>

              <p className="mt-4 max-w-xl text-sm leading-6 text-slate-300 sm:text-base sm:leading-7">
                Consultanos por el producto que necesitás. Nuestro equipo puede
                ayudarte a encontrar el repuesto adecuado.
              </p>
            </div>

            {/* CTA */}

            <div className="relative shrink-0">
              <Link
                to="/contacto"
                className="group inline-flex w-full items-center justify-center gap-3 rounded-xl bg-brand-red px-6 py-3.5 text-sm font-semibold text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-brand-red-dark sm:w-auto"
              >
                Hacer una consulta
                <span
                  aria-hidden="true"
                  className="transition-transform duration-200 group-hover:translate-x-1"
                >
                  →
                </span>
              </Link>

              <p className="mt-3 text-center text-xs text-slate-500 sm:text-right">
                Estamos para ayudarte
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ContactCTA;
