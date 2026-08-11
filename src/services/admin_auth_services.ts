import { apiFetch } from "./api";

interface AdminLoginResponse {
  access_token: string;
  token_type: string;
}

export async function loginWithGoogle(
  credential: string,
): Promise<AdminLoginResponse> {
  return apiFetch("/admin/auth/google", {
    method: "POST",
    body: JSON.stringify({
      credential,
    }),
  });
}
