import { Link } from "react-router-dom";

import logoRepuestosPalacios from "../../assets/logo-repuestos-palacios.png";

function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-950 text-white">
      <div className="mx-auto max-w-7xl px-6 py-14 sm:py-16 lg:px-8">
        {/* CONTENIDO PRINCIPAL */}

        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          {/* MARCA */}

          <div className="lg:col-span-2">
            <Link
              to="/"
              className="inline-flex rounded-xl bg-white p-2 shadow-sm transition hover:opacity-90"
            >
              <img
                src={logoRepuestosPalacios}
                alt="Repuestos Palacios"
                className="h-20 w-20 object-contain"
              />
            </Link>

            <p className="mt-4 max-w-md text-sm leading-7 text-slate-400">
              Repuestos y accesorios para vehículos. Consultá nuestro catálogo y
              encontrá el producto que necesitás.
            </p>

            <Link
              to="/catalogo"
              className="group mt-6 inline-flex items-center gap-2 text-sm font-semibold text-white transition hover:text-slate-300"
            >
              Explorar catálogo
              <span className="transition-transform duration-200 group-hover:translate-x-1">
                →
              </span>
            </Link>
          </div>

          {/* NAVEGACIÓN */}

          <div>
            <h2 className="text-sm font-semibold uppercase tracking-[0.15em] text-white">
              Navegación
            </h2>

            <nav className="mt-5 flex flex-col gap-3">
              <Link
                to="/"
                className="text-sm text-slate-400 transition hover:text-white"
              >
                Inicio
              </Link>

              <Link
                to="/catalogo"
                className="text-sm text-slate-400 transition hover:text-white"
              >
                Catálogo
              </Link>

              <Link
                to="/marcas"
                className="text-sm text-slate-400 transition hover:text-white"
              >
                Marcas
              </Link>

              <Link
                to="/contacto"
                className="text-sm text-slate-400 transition hover:text-white"
              >
                Contacto
              </Link>
            </nav>
          </div>

          {/* CONTACTO */}

          <div>
            <h2 className="text-sm font-semibold uppercase tracking-[0.15em] text-white">
              Contacto
            </h2>

            <div className="mt-5 space-y-4">
              <p className="text-sm leading-6 text-slate-400">
                ¿No encontrás el repuesto que buscás?
              </p>

              <Link
                to="/contacto"
                className="group inline-flex items-center gap-2 text-sm font-semibold text-white transition hover:text-slate-300"
              >
                Hacer una consulta
                <span className="transition-transform duration-200 group-hover:translate-x-1">
                  →
                </span>
              </Link>
            </div>
          </div>
        </div>

        {/* SEPARADOR */}

        <div className="my-10 h-px bg-slate-800" />

        {/* PARTE INFERIOR */}

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-slate-500 sm:text-sm">
            © {new Date().getFullYear()} Repuestos Palacios. Todos los derechos
            reservados.
          </p>

          <Link
            to="/"
            className="text-xs font-medium text-slate-500 transition hover:text-white sm:text-sm"
          >
            Volver al inicio ↑
          </Link>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
