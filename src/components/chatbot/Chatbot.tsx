import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  getCategoriasFiltro,
  getProductos,
} from "../../services/producto_services";
import type { Producto } from "../../types/products_type";

interface Mensaje {
  id: number;
  autor: "asistente" | "usuario";
  texto: string;
  productos?: Producto[];
}

const MENSAJE_INICIAL: Mensaje = {
  id: 0,
  autor: "asistente",
  texto:
    "¡Hola! Puedo ayudarte a encontrar repuestos. Escribí el nombre, código o marca del producto que buscás.",
};

function normalizarTexto(texto: string): string {
  return texto
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("es")
    .trim();
}

function obtenerVariantesBusqueda(texto: string): string[] {
  const consultaNormalizada = normalizarTexto(texto);
  const palabras = consultaNormalizada.split(/\s+/).filter(Boolean);
  const variantes = new Set([texto.trim(), consultaNormalizada]);

  if (palabras.length === 1) {
    const [palabra] = palabras;

    if (palabra.endsWith("es") && palabra.length > 4) {
      variantes.add(palabra.slice(0, -2));
    } else if (palabra.endsWith("s") && palabra.length > 3) {
      variantes.add(palabra.slice(0, -1));
    }
  }

  if (consultaNormalizada.includes("lampara")) {
    variantes.add("lámpara");
    variantes.add("lampara");
  }

  return [...variantes].filter((variante) => variante.length >= 2);
}

function reducirPlural(palabra: string): string {
  if (palabra.endsWith("es") && palabra.length > 4) {
    return palabra.slice(0, -2);
  }

  if (palabra.endsWith("s") && palabra.length > 3) {
    return palabra.slice(0, -1);
  }

  return palabra;
}

function obtenerTerminos(texto: string): string[] {
  return normalizarTexto(texto)
    .split(/[^a-z0-9]+/)
    .filter((termino) => termino.length >= 3)
    .map(reducirPlural);
}

function encontrarCategoria(
  categorias: { id: number; nombre: string }[],
  consulta: string,
) {
  const consultaNormalizada = normalizarTexto(consulta);
  const terminosConsulta = obtenerTerminos(consulta);

  return categorias.find((categoria) => {
    const nombreCategoria = normalizarTexto(categoria.nombre);
    const terminosCategoria = obtenerTerminos(categoria.nombre);

    if (nombreCategoria === consultaNormalizada) {
      return true;
    }

    return terminosConsulta.some((terminoConsulta) =>
      terminosCategoria.some(
        (terminoCategoria) =>
          terminoConsulta.length >= 4 &&
          (terminoCategoria.startsWith(terminoConsulta) ||
            terminoConsulta.startsWith(terminoCategoria)),
      ),
    );
  });
}

function Chatbot() {
  const navigate = useNavigate();
  const [abierto, setAbierto] = useState(false);
  const [consulta, setConsulta] = useState("");
  const [buscando, setBuscando] = useState(false);
  const [mensajes, setMensajes] = useState<Mensaje[]>([MENSAJE_INICIAL]);

  async function buscarProducto(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    const texto = consulta.trim();

    if (!texto || buscando) {
      return;
    }

    setConsulta("");
    setMensajes((actuales) => [
      ...actuales,
      { id: Date.now(), autor: "usuario", texto },
    ]);
    setBuscando(true);

    try {
      const categoriasActivas = await getCategoriasFiltro();
      const categoriaEncontrada = encontrarCategoria(categoriasActivas, texto);

      if (categoriaEncontrada) {
        setMensajes((actuales) => [
          ...actuales,
          {
            id: Date.now() + 1,
            autor: "asistente",
            texto: `Te llevo a la sección ${categoriaEncontrada.nombre}.`,
          },
        ]);

        navigate(`/catalogo?categoria=${categoriaEncontrada.id}`);
        setAbierto(false);
        return;
      }

      const respuestas = await Promise.all(
        obtenerVariantesBusqueda(texto).map((buscar) =>
          getProductos({
            buscar,
            solo_activos: true,
            page: 1,
            limit: 5,
            orden: "nombre_asc",
          }),
        ),
      );

      const categoriasActivasIds = new Set(
        categoriasActivas.map((categoria) => categoria.id),
      );

      const productos = [
        ...new Map(
          respuestas
            .flatMap((respuesta) => respuesta.items)
            .filter((producto) =>
              categoriasActivasIds.has(producto.categoria_id),
            )
            .map((producto) => [producto.id, producto]),
        ).values(),
      ].slice(0, 5);

      setMensajes((actuales) => [
        ...actuales,
        {
          id: Date.now() + 1,
          autor: "asistente",
          texto:
            productos.length > 0
              ? `Encontré estos ${productos.length} ${productos.length === 1 ? "producto" : "productos"} relacionados:`
              : "No encontré productos con esa búsqueda. Probá con otro nombre, código o marca.",
          productos,
        },
      ]);
    } catch (error) {
      console.error("ERROR BUSCANDO DESDE EL CHATBOT:", error);

      setMensajes((actuales) => [
        ...actuales,
        {
          id: Date.now() + 1,
          autor: "asistente",
          texto:
            "No pude realizar la búsqueda en este momento. Intentá nuevamente en unos segundos.",
        },
      ]);
    } finally {
      setBuscando(false);
    }
  }

  return (
    <aside className="fixed bottom-5 right-4 z-50 sm:bottom-6 sm:right-6">
      {abierto && (
        <section
          aria-label="Asistente de búsqueda de productos"
          className="mb-3 flex h-[min(38rem,calc(100vh-7.5rem))] w-[calc(100vw-2rem)] max-w-sm flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl"
        >
          <header className="flex items-center justify-between bg-slate-950 px-5 py-4 text-white">
            <div>
              <h2 className="text-sm font-bold">Asistente de productos</h2>
              <p className="mt-0.5 text-xs text-slate-300">Buscá por nombre, código o marca</p>
            </div>

            <button
              type="button"
              onClick={() => setAbierto(false)}
              aria-label="Cerrar asistente"
              className="flex h-8 w-8 items-center justify-center rounded-lg text-lg transition hover:bg-white/10"
            >
              ×
            </button>
          </header>

          <div className="flex-1 space-y-4 overflow-y-auto bg-slate-50 p-4">
            {mensajes.map((mensaje) => (
              <div key={mensaje.id}>
                <div
                  className={`max-w-[90%] rounded-2xl px-4 py-3 text-sm leading-6 ${
                    mensaje.autor === "usuario"
                      ? "ml-auto bg-brand-red text-white"
                      : "bg-white text-slate-700 shadow-sm"
                  }`}
                >
                  {mensaje.texto}
                </div>

                {mensaje.productos && mensaje.productos.length > 0 && (
                  <div className="mt-2 space-y-2">
                    {mensaje.productos.map((producto) => (
                      <Link
                        key={producto.id}
                        to={`/producto/${producto.slug}`}
                        onClick={() => setAbierto(false)}
                        className="block rounded-xl border border-slate-200 bg-white p-3 transition hover:border-slate-400 hover:shadow-sm"
                      >
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                          {producto.marca?.nombre ?? "Sin marca"}
                        </p>
                        <p className="mt-1 text-sm font-semibold text-slate-900">
                          {producto.nombre}
                        </p>
                        <p className="mt-1 text-xs text-slate-500">
                          Código: {producto.codigo}
                        </p>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {buscando && (
              <div className="w-fit rounded-2xl bg-white px-4 py-3 text-sm text-slate-500 shadow-sm">
                Buscando productos...
              </div>
            )}
          </div>

          <form onSubmit={buscarProducto} className="border-t border-slate-200 bg-white p-3">
            <label htmlFor="chatbot-consulta" className="sr-only">
              Consultá por un producto
            </label>
            <div className="flex gap-2">
              <input
                id="chatbot-consulta"
                value={consulta}
                onChange={(event) => setConsulta(event.target.value)}
                placeholder="Ej.: alternador Bosch o 20-080184"
                className="min-w-0 flex-1 rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10"
              />
              <button
                type="submit"
                disabled={!consulta.trim() || buscando}
                className="rounded-xl bg-brand-red px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-red-dark disabled:cursor-not-allowed disabled:opacity-50"
              >
                Enviar
              </button>
            </div>
          </form>
        </section>
      )}

      <button
        type="button"
        onClick={() => setAbierto((actual) => !actual)}
        aria-expanded={abierto}
        aria-label={abierto ? "Cerrar asistente" : "Abrir asistente de productos"}
        className="ml-auto flex items-center gap-2 rounded-full bg-brand-red px-5 py-3.5 text-sm font-bold text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-brand-red-dark"
      >
        <span aria-hidden="true">💬</span>
        {abierto ? "Cerrar" : "¿Buscás un producto?"}
      </button>
    </aside>
  );
}

export default Chatbot;
