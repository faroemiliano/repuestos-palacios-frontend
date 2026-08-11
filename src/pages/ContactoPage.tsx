import FormularioConsulta from "../components/consulta/FormularioConsulta";

function ContactoPage() {
  return (
    <main className="bg-white">
      {/* =========================
          HEADER
          ========================= */}

      <section className="border-b border-slate-200">
        <div className="mx-auto max-w-5xl px-6 py-20 text-center">
          <span className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
            Contacto
          </span>

          <h1 className="mt-4 text-5xl font-bold tracking-tight text-slate-900">
            Repuestos Palacios
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-600">
            ¿Necesitás consultar por un repuesto? Comunicate con nosotros y te
            ayudamos a encontrar lo que buscás.
          </p>
        </div>
      </section>

      {/* =========================
          CONTACTOS
          ========================= */}

      <section className="mx-auto max-w-5xl px-6 py-20">
        <div className="grid gap-6 md:grid-cols-2">
          {/* =========================
              TELÉFONO
              ========================= */}

          <a
            href="tel:+540000000000"
            className="group rounded-3xl border border-slate-200 bg-white p-8 transition duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-lg"
          >
            <div className="flex items-center gap-5">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-slate-100 text-2xl transition group-hover:bg-slate-900 group-hover:text-white">
                📞
              </div>

              <div>
                <p className="text-sm font-semibold uppercase tracking-wider text-slate-400">
                  Teléfono
                </p>

                <p className="mt-1 text-xl font-semibold text-slate-900">
                  +54 00 0000-0000
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  Hacé clic para llamar
                </p>
              </div>
            </div>
          </a>

          {/* =========================
              EMAIL
              ========================= */}

          <a
            href="mailto:contacto@repuestospalacios.com"
            className="group rounded-3xl border border-slate-200 bg-white p-8 transition duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-lg"
          >
            <div className="flex items-center gap-5">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-slate-100 text-2xl transition group-hover:bg-slate-900 group-hover:text-white">
                ✉️
              </div>

              <div className="min-w-0">
                <p className="text-sm font-semibold uppercase tracking-wider text-slate-400">
                  Email
                </p>

                <p className="mt-1 break-all text-xl font-semibold text-slate-900">
                  contacto@repuestospalacios.com
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  Escribinos por email
                </p>
              </div>
            </div>
          </a>
        </div>
      </section>

      {/* =========================
          CIERRE
          ========================= */}

      <section className="border-t border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-3xl px-6 py-16">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">
              ¿No encontrás el repuesto que buscás?
            </h2>

            <p className="mx-auto mt-3 max-w-xl text-slate-600">
              Consultanos. Podemos ayudarte a encontrar el repuesto que
              necesitás.
            </p>
          </div>

          <div className="mt-10 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <FormularioConsulta />
          </div>
        </div>
      </section>
    </main>
  );
}

export default ContactoPage;
