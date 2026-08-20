import imageUrlBuilder from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";
import { createClient, type SanityClient } from "next-sanity";

import { API_VERSION, DATASET, PROJECT_ID, READ_TOKEN, SANITY_CONFIGURADO } from "./env";
import type { ImagenSanityRef } from "@/types/contenido";

/**
 * Cliente de Sanity que nunca hace caer la aplicación.
 *
 * Criterio de verificación del sprint: "El proyecto arranca en local sin
 * credenciales reales". Sin PROJECT_ID el cliente es null y `consultar`
 * devuelve el valor de respaldo que se le pase, de forma que cada página
 * renderiza su estado vacío controlado en vez de lanzar un error.
 *
 * Lo mismo vale para un fallo de red o de la API: se registra en el
 * servidor y se devuelve el respaldo. Una clínica prefiere una sección
 * vacía a una página de error.
 */

let clienteCache: SanityClient | null = null;

function obtenerCliente(): SanityClient | null {
  if (!SANITY_CONFIGURADO) return null;
  if (clienteCache) return clienteCache;

  clienteCache = createClient({
    projectId: PROJECT_ID,
    dataset: DATASET,
    apiVersion: API_VERSION,
    // El CDN sirve contenido publicado y es lo que se quiere en producción.
    useCdn: process.env.NODE_ENV === "production",
    perspective: "published",
    token: READ_TOKEN || undefined,
  });

  return clienteCache;
}

export interface OpcionesConsulta {
  /** Segundos de revalidación. Por defecto 60. */
  revalidar?: number;
  /** Etiquetas de caché para revalidación bajo demanda. */
  etiquetas?: string[];
}

/**
 * Ejecuta una consulta GROQ. Si Sanity no está configurado o falla,
 * devuelve `respaldo` sin lanzar.
 */
export async function consultar<T>(
  query: string,
  respaldo: T,
  parametros: Record<string, unknown> = {},
  opciones: OpcionesConsulta = {},
): Promise<T> {
  const cliente = obtenerCliente();

  if (!cliente) {
    if (process.env.NODE_ENV === "development") {
      console.info(
        "[sanity] Sin NEXT_PUBLIC_SANITY_PROJECT_ID: se sirve contenido vacío. " +
          "Es lo esperado hasta que se cree el proyecto de Sanity.",
      );
    }
    return respaldo;
  }

  try {
    return await cliente.fetch<T>(query, parametros, {
      next: {
        revalidate: opciones.revalidar ?? 60,
        tags: opciones.etiquetas,
      },
    });
  } catch (error) {
    console.error("[sanity] La consulta falló, se sirve el respaldo:", error);
    return respaldo;
  }
}

// ── Imágenes ─────────────────────────────────────────────────────────────

const constructor = SANITY_CONFIGURADO
  ? imageUrlBuilder({ projectId: PROJECT_ID, dataset: DATASET })
  : null;

/**
 * Construye la URL de una imagen del CDN de Sanity.
 * Devuelve null si no hay imagen o si Sanity no está configurado, para que
 * el componente que la usa decida qué mostrar en su lugar.
 */
export function urlImagen(
  fuente: ImagenSanityRef | SanityImageSource | undefined | null,
  opciones: { ancho?: number; alto?: number; calidad?: number } = {},
): string | null {
  if (!fuente || !constructor) return null;

  const referencia = (fuente as ImagenSanityRef)?.asset?._ref;
  if (!referencia && !(fuente as { _ref?: string })?._ref) return null;

  try {
    let img = constructor.image(fuente as SanityImageSource).auto("format").fit("max");
    if (opciones.ancho) img = img.width(opciones.ancho);
    if (opciones.alto) img = img.height(opciones.alto);
    img = img.quality(opciones.calidad ?? 80);
    return img.url();
  } catch {
    return null;
  }
}

export { SANITY_CONFIGURADO };
