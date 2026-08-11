import { useState } from "react";

import { crearConsulta } from "../../services/consulta_services";

interface FormularioConsultaProps {
  productoId?: number;
  productoNombre?: string;
}

function FormularioConsulta({ productoId }: FormularioConsultaProps) {
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [email, setEmail] = useState("");
  const [mensaje, setMensaje] = useState("");

  const [enviando, setEnviando] = useState(false);
  const [enviado, setEnviado] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      setEnviando(true);
      setError(null);
      setEnviado(false);

      await crearConsulta({
        producto_id: productoId ?? null,
        nombre,
        telefono,
        email: email || null,
        mensaje,
      });

      setEnviado(true);

      setNombre("");
      setTelefono("");
      setEmail("");
      setMensaje("");
    } catch (error) {
      console.error(error);

      setError("No pudimos enviar la consulta. Intentá nuevamente.");
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div className="mt-10 rounded-2xl border border-slate-200 bg-slate-50 p-6">
      <h2 className="text-2xl font-bold text-slate-900">
        {productoId ? "Consultar por este producto" : "Contactanos"}
      </h2>

      <p className="mt-2 text-sm text-slate-500">
        Completá tus datos y nos pondremos en contacto con vos.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-5">
        {/* Nombre */}

        <div>
          <label className="text-sm font-medium text-slate-700">Nombre</label>

          <input
            type="text"
            value={nombre}
            onChange={(event) => setNombre(event.target.value)}
            required
            minLength={2}
            maxLength={150}
            className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-slate-900"
            placeholder="Tu nombre"
          />
        </div>

        {/* Teléfono */}

        <div>
          <label className="text-sm font-medium text-slate-700">Teléfono</label>

          <input
            type="tel"
            value={telefono}
            onChange={(event) => setTelefono(event.target.value)}
            required
            minLength={6}
            maxLength={50}
            className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-slate-900"
            placeholder="Tu teléfono"
          />
        </div>

        {/* Email */}

        <div>
          <label className="text-sm font-medium text-slate-700">Email</label>

          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-slate-900"
            placeholder="tu@email.com"
          />
        </div>

        {/* Mensaje */}

        <div>
          <label className="text-sm font-medium text-slate-700">Mensaje</label>

          <textarea
            value={mensaje}
            onChange={(event) => setMensaje(event.target.value)}
            required
            minLength={5}
            maxLength={2000}
            rows={5}
            className="mt-2 w-full resize-none rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-slate-900"
            placeholder="¿Qué necesitás consultar?"
          />
        </div>

        {/* Error */}

        {error && (
          <div className="rounded-xl bg-red-50 p-4 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* Éxito */}

        {enviado && (
          <div className="rounded-xl bg-green-50 p-4 text-sm text-green-700">
            ¡Consulta enviada correctamente! Nos pondremos en contacto con vos.
          </div>
        )}

        {/* Botón */}

        <button
          type="submit"
          disabled={enviando}
          className="w-full rounded-xl bg-slate-900 px-6 py-4 font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {enviando ? "Enviando..." : "Enviar consulta"}
        </button>
      </form>
    </div>
  );
}

export default FormularioConsulta;
