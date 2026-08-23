const WHATSAPP_NUMERO = "5491144942492";
const MENSAJE = "Hola, quiero realizar una consulta sobre un repuesto.";

function WhatsAppFloat() {
  const enlace = `https://wa.me/${WHATSAPP_NUMERO}?text=${encodeURIComponent(MENSAJE)}`;

  return (
    <a
      href={enlace}
      target="_blank"
      rel="noreferrer"
      aria-label="Enviar mensaje por WhatsApp"
      className="fixed bottom-5 right-4 z-50 flex items-center gap-2 rounded-full bg-[#25D366] px-5 py-3.5 text-sm font-bold text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-[#1fb957] sm:bottom-6 sm:right-6"
    >
      <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 fill-current">
        <path d="M20.52 3.48A11.78 11.78 0 0 0 12.04 0C5.48 0 .14 5.34.14 11.9c0 2.1.55 4.15 1.6 5.95L0 24l6.31-1.66a11.87 11.87 0 0 0 5.73 1.46h.01c6.55 0 11.89-5.34 11.89-11.9 0-3.18-1.24-6.16-3.42-8.42Zm-8.47 18.31h-.01a9.87 9.87 0 0 1-5.04-1.38l-.36-.21-3.75.99 1-3.65-.24-.38A9.83 9.83 0 0 1 2.14 11.9c0-5.46 4.45-9.9 9.91-9.9 2.64 0 5.12 1.03 6.99 2.91a9.83 9.83 0 0 1 2.9 7c0 5.46-4.44 9.89-9.89 9.89Zm5.42-7.42c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.95 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.47a9.02 9.02 0 0 1-1.66-2.06c-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.05 1.02-1.05 2.48 0 1.46 1.08 2.88 1.22 3.08.15.2 2.12 3.23 5.13 4.53.72.31 1.28.5 1.72.64.72.23 1.38.2 1.9.12.58-.09 1.76-.72 2.01-1.42.25-.7.25-1.3.18-1.42-.08-.12-.27-.2-.57-.35Z" />
      </svg>
      WhatsApp
    </a>
  );
}

export default WhatsAppFloat;
