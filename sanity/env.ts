/**
 * Configuración de Sanity con valores de respaldo.
 *
 * Criterio de verificación del sprint: "El proyecto arranca en local sin
 * credenciales reales." Por eso nada de esto lanza una excepción: si falta
 * el identificador de proyecto, `SANITY_CONFIGURADO` queda en falso y el
 * cliente devuelve contenido vacío en vez de romperse.
 */

export const PROJECT_ID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "";
export const DATASET = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
export const API_VERSION = process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? "2024-10-01";
export const READ_TOKEN = process.env.SANITY_API_READ_TOKEN ?? "";

/**
 * Un identificador de proyecto válido es minúsculas, dígitos y guiones.
 * Se comprueba el formato y no solo la presencia porque un valor vacío en
 * .env.local o un "placeholder" olvidado producen errores muy poco claros
 * en tiempo de ejecución.
 */
export const SANITY_CONFIGURADO =
  PROJECT_ID.length > 0 &&
  /^[a-z0-9-]+$/.test(PROJECT_ID) &&
  PROJECT_ID !== "placeholder";
