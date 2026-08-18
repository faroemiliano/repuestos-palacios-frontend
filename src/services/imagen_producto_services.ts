import { apiFetch } from "./api";

import type { ProductoImagen } from "../types/products_type";

export async function getImagenesProducto(
  productoId: number,
): Promise<ProductoImagen[]> {
  return apiFetch<ProductoImagen[]>(
    `/imagenes-productos/producto/${productoId}`,
  );
}

export async function subirImagenProducto(
  productoId: number,
  archivo: File,
  orden: number,
  principal: boolean,
): Promise<ProductoImagen> {
  const formData = new FormData();

  formData.append("producto_id", String(productoId));
  formData.append("orden", String(orden));
  formData.append("principal", String(principal));
  formData.append("archivo", archivo);

  return apiFetch<ProductoImagen>("/imagenes-productos/upload", {
    method: "POST",
    body: formData,
  });
}

export async function actualizarImagenProducto(
  imagenId: number,
  data: {
    orden?: number;
    principal?: boolean;
  },
): Promise<ProductoImagen> {
  return apiFetch<ProductoImagen>(`/imagenes-productos/${imagenId}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function eliminarImagenProducto(imagenId: number): Promise<void> {
  await apiFetch<void>(`/imagenes-productos/${imagenId}`, {
    method: "DELETE",
  });
}
