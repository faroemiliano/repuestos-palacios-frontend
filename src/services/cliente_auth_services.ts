import { apiFetch } from "./api";

export interface ClientePerfil {
  id: number;
  nombre: string | null;
  empresa: string | null;
  email: string;
  telefono: string | null;
  foto: string | null;
  perfil_completo: boolean;
}

interface ClienteLoginResponse {
  access_token: string;
  token_type: string;
  cliente: ClientePerfil;
}

export function loginClienteWithGoogle(credential: string) {
  return apiFetch<ClienteLoginResponse>("/clientes/auth/google", {
    method: "POST",
    body: JSON.stringify({ credential }),
  });
}

export function getClientePerfil() {
  return apiFetch<ClientePerfil>("/clientes/perfil");
}

export function actualizarClientePerfil(data: { nombre: string; empresa: string; telefono: string }) {
  return apiFetch<ClientePerfil>("/clientes/perfil", {
    method: "PUT",
    body: JSON.stringify(data),
  });
}
