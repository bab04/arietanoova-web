import type { AjustesSitio, Horario } from "@/types/contenido";

/**
 * Constantes del sitio y utilidades de contacto.
 *
 * Los valores de respaldo NO son contenido clínico inventado: son datos
 * operativos mínimos para que la web arranque sin Sanity configurado.
 * Se marcan como provisionales y el sitemap los ignora.
 */

export const URL_SITIO = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
).replace(/\/$/, "");

export const IDIOMA = "es-PE";

export const WHATSAPP_ENV = process.env.NEXT_PUBLIC_WHATSAPP_NUMERO ?? "";

/** Respaldo mínimo. PROVISIONAL: los datos reales viven en Sanity. */
export const AJUSTES_RESPALDO: AjustesSitio = {
  nombreClinica: "Arieta Noova",
  distrito: "Pueblo Libre",
  ciudad: "Lima",
  horarios: [],
  enlacesDoctocliq: [],
  redes: [],
};

/** Dirección completa en una línea, con la oficina incluida. */
export function direccionCompleta(ajustes: AjustesSitio): string {
  return [ajustes.direccion, ajustes.oficina, ajustes.distrito, ajustes.ciudad]
    .filter(Boolean)
    .join(", ");
}

/** Número de teléfono en formato `tel:`, sin espacios ni signos. */
export function enlaceTelefono(telefono?: string): string | null {
  if (!telefono) return null;
  const limpio = telefono.replace(/[^\d+]/g, "");
  return limpio ? `tel:${limpio}` : null;
}

/**
 * Enlace de WhatsApp con mensaje prellenado.
 * El número sale de Sanity y, si falta, de la variable de entorno.
 */
export function enlaceWhatsApp(
  numero: string | undefined,
  mensaje: string,
): string | null {
  const crudo = (numero || WHATSAPP_ENV).replace(/[^\d]/g, "");
  if (!crudo) return null;
  return `https://wa.me/${crudo}?text=${encodeURIComponent(mensaje)}`;
}

const NOMBRES_DIA: Record<string, string> = {
  lunes: "Lunes",
  martes: "Martes",
  miercoles: "Miércoles",
  jueves: "Jueves",
  viernes: "Viernes",
  sabado: "Sábado",
  domingo: "Domingo",
};

export function nombreDia(dia?: string): string {
  if (!dia) return "";
  return NOMBRES_DIA[dia] ?? dia;
}

/** "08:00 – 19:00" o "Cerrado". */
export function rangoHorario(horario: Horario): string {
  if (horario.cerrado) return "Cerrado";
  if (!horario.apertura && !horario.cierre) return "Consultar";
  return `${horario.apertura ?? "?"} – ${horario.cierre ?? "?"}`;
}

/** Códigos de schema.org para el JSON-LD de horarios. */
const DIA_SCHEMA: Record<string, string> = {
  lunes: "Monday",
  martes: "Tuesday",
  miercoles: "Wednesday",
  jueves: "Thursday",
  viernes: "Friday",
  sabado: "Saturday",
  domingo: "Sunday",
};

export function diaSchema(dia?: string): string | null {
  if (!dia) return null;
  return DIA_SCHEMA[dia] ?? null;
}

/** URL absoluta a partir de una ruta interna. Para canónicas y sitemap. */
export function urlAbsoluta(ruta: string): string {
  if (ruta.startsWith("http")) return ruta;
  return `${URL_SITIO}${ruta.startsWith("/") ? ruta : `/${ruta}`}`;
}
