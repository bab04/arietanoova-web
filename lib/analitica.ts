/**
 * Analítica: nombres de evento, etiquetado UTM y envío.
 *
 * Todo lo medible del sitio pasa por aquí. Ningún componente llama a
 * `gtag` directamente, para que añadir un segundo destino (Meta, un
 * webhook propio) sea editar este archivo y `app/api/track/route.ts`.
 */

export const EVENTOS = {
  clicReservar: "clic_reservar",
  clicWhatsapp: "clic_whatsapp",
  clicLlamar: "clic_llamar",
  envioContacto: "envio_contacto",
  envioDerivacion: "envio_derivacion",
} as const;

export type NombreEvento = (typeof EVENTOS)[keyof typeof EVENTOS];

export interface PropiedadesEvento {
  /** De dónde salió el clic. Ej.: "portada_hero", "especialidad_endodoncia". */
  origen: string;
  /** Variante del CTA cuando aplica. */
  variante?: string;
  [clave: string]: string | number | boolean | undefined;
}

declare global {
  interface Window {
    gtag?: (
      comando: "event" | "config" | "js",
      objetivo: string,
      parametros?: Record<string, unknown>,
    ) => void;
  }
}

/**
 * Registra un evento. Va a GA4 si está configurado y, en paralelo, al
 * punto único `/api/track`, que hoy solo escribe en el registro del
 * servidor pero es donde se enchufará cualquier otro destino.
 */
export function registrarEvento(nombre: NombreEvento, propiedades: PropiedadesEvento): void {
  if (typeof window === "undefined") return;

  if (typeof window.gtag === "function") {
    window.gtag("event", nombre, propiedades);
  } else if (process.env.NODE_ENV === "development") {
    console.info(`[analitica] ${nombre}`, propiedades);
  }

  // `keepalive` permite que el envío sobreviva a la navegación que provoca
  // el propio clic. Sin esto se pierden justamente los eventos de reserva.
  try {
    void fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nombre, propiedades, ruta: window.location.pathname }),
      keepalive: true,
    }).catch(() => {
      // La analítica nunca debe interrumpir al usuario.
    });
  } catch {
    // Ídem.
  }
}

/**
 * Añade las etiquetas de campaña a un enlace de Doctocliq.
 *
 * Regla del sprint: todos los enlaces de Doctocliq salen con
 * utm_source=web, utm_medium=cta y utm_campaign=<origen>.
 *
 * Respeta las UTM que ya vengan en el enlace pegado desde Doctocliq: si la
 * clínica ya etiquetó una campaña a mano, no se le pisa.
 */
export function conUtm(url: string | undefined | null, origen: string): string | null {
  if (!url) return null;

  try {
    const destino = new URL(url);
    if (!destino.searchParams.has("utm_source")) {
      destino.searchParams.set("utm_source", "web");
    }
    if (!destino.searchParams.has("utm_medium")) {
      destino.searchParams.set("utm_medium", "cta");
    }
    if (!destino.searchParams.has("utm_campaign")) {
      destino.searchParams.set("utm_campaign", origen);
    }
    return destino.toString();
  } catch {
    // No es una URL absoluta válida: se devuelve tal cual para no romper el enlace.
    return url;
  }
}

/**
 * Normaliza un origen para que sirva de etiqueta de campaña:
 * minúsculas, sin tildes, con guiones bajos.
 */
export function normalizarOrigen(origen: string): string {
  return origen
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "") // marcas diacríticas
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}
