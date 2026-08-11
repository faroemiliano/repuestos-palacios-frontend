function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-7xl px-6 py-10">
        <div className="flex flex-col gap-4 text-center sm:flex-row sm:items-center sm:justify-between sm:text-left">
          {/* Información */}

          <div>
            <p className="text-lg font-bold tracking-tight text-slate-900">
              Repuestos Palacios
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Repuestos y accesorios para vehículos.
            </p>
          </div>

          {/* Copyright */}

          <div className="text-sm text-slate-500">
            © {new Date().getFullYear()} Repuestos Palacios
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
