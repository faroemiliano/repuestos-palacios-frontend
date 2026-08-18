import FormularioConsulta from "../components/consulta/FormularioConsulta";

function ContactoPage() {
  return (
    <main className="bg-white">
      {/* =========================
          HERO
          ========================= */}

      <section className="relative overflow-hidden border-b border-slate-200 bg-slate-950">
        {/* Decoración */}

        <div className="pointer-events-none absolute -right-32 -top-32 h-80 w-80 rounded-full bg-slate-800/50 blur-3xl" />

        <div className="pointer-events-none absolute -bottom-40 left-1/4 h-96 w-96 rounded-full bg-slate-800/30 blur-3xl" />

        <div className="relative mx-auto max-w-5xl px-6 py-16 text-center sm:py-20 lg:py-24">
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
            <span className="h-1.5 w-1.5 rounded-full bg-white" />
            Contacto
          </div>

          <h1 className="mt-5 text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Estamos para ayudarte
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg sm:leading-8">
            ¿Necesitás consultar por un repuesto? Comunicate con nosotros y te
            ayudamos a encontrar lo que estás buscando.
          </p>
        </div>
      </section>

      {/* =========================
          DATOS DE CONTACTO
          ========================= */}

      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
        <div className="grid gap-5 md:grid-cols-2">
          {/* TELÉFONO */}

          <a
            href="tel:+540000000000"
            className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-xl sm:p-8"
          >
            <div className="flex items-start justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-700 transition-colors duration-300 group-hover:bg-slate-950 group-hover:text-white">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  className="h-5 w-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.093l-4.423-1.106a1.125 1.125 0 0 0-1.173.417l-.97 1.293a1.125 1.125 0 0 1-1.21.38 12.035 12.035 0 0 1-7.346-7.346 1.125 1.125 0 0 1 .38-1.21l1.293-.97c.35-.263.51-.708.417-1.173L6.742 2.397A1.125 1.125 0 0 0 5.649 1.545H4.5A2.25 2.25 0 0 0 2.25 3.795v2.955Z"
                  />
                </svg>
              </div>

              <span className="text-slate-300 transition-transform duration-300 group-hover:translate-x-1 group-hover:text-slate-900">
                →
              </span>
            </div>

            <div className="mt-7">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                Teléfono
              </p>

              <p className="mt-2 text-xl font-semibold tracking-tight text-slate-950 sm:text-2xl">
                +54 00 0000-0000
              </p>

              <p className="mt-2 text-sm text-slate-500">
                Hacé clic para comunicarte con nosotros.
              </p>
            </div>

            <div className="mt-7 h-px w-8 bg-slate-200 transition-all duration-300 group-hover:w-16 group-hover:bg-slate-950" />
          </a>

          {/* EMAIL */}

          <a
            href="mailto:contacto@repuestospalacios.com"
            className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-xl sm:p-8"
          >
            <div className="flex items-start justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-700 transition-colors duration-300 group-hover:bg-slate-950 group-hover:text-white">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  className="h-5 w-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25H4.5a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.006 1.874l-7.5 5a2.25 2.25 0 0 1-2.488 0l-7.5-5A2.25 2.25 0 0 1 2.25 6.993V6.75"
                  />
                </svg>
              </div>

              <span className="text-slate-300 transition-transform duration-300 group-hover:translate-x-1 group-hover:text-slate-900">
                →
              </span>
            </div>

            <div className="mt-7">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                Email
              </p>

              <p className="mt-2 break-all text-xl font-semibold tracking-tight text-slate-950 sm:text-2xl">
                contacto@repuestospalacios.com
              </p>

              <p className="mt-2 text-sm text-slate-500">
                Escribinos y respondemos tu consulta.
              </p>
            </div>

            <div className="mt-7 h-px w-8 bg-slate-200 transition-all duration-300 group-hover:w-16 group-hover:bg-slate-950" />
          </a>
        </div>
      </section>

      {/* =========================
          FORMULARIO
          ========================= */}

      <section className="border-t border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-start lg:gap-16">
            {/* TEXTO */}

            <div className="lg:sticky lg:top-8">
              <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                <span className="h-1.5 w-1.5 rounded-full bg-slate-950" />
                Consulta
              </div>

              <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                ¿Buscás un repuesto específico?
              </h2>

              <p className="mt-5 text-sm leading-7 text-slate-600 sm:text-base">
                Contanos qué repuesto necesitás y nuestro equipo se pondrá en
                contacto para ayudarte.
              </p>

              <div className="mt-8 space-y-4">
                <div className="flex items-start gap-3">
                  <span className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-950 text-xs text-white">
                    ✓
                  </span>

                  <p className="text-sm leading-6 text-slate-600">
                    Consultá por disponibilidad.
                  </p>
                </div>

                <div className="flex items-start gap-3">
                  <span className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-950 text-xs text-white">
                    ✓
                  </span>

                  <p className="text-sm leading-6 text-slate-600">
                    Indicá marca, modelo o código si lo conocés.
                  </p>
                </div>

                <div className="flex items-start gap-3">
                  <span className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-950 text-xs text-white">
                    ✓
                  </span>

                  <p className="text-sm leading-6 text-slate-600">
                    Te ayudamos a encontrar el producto adecuado.
                  </p>
                </div>
              </div>
            </div>

            {/* FORMULARIO */}

            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8 lg:p-10">
              <FormularioConsulta />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default ContactoPage;
