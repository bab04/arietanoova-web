import type { Metadata } from "next";

import { URL_SITIO, urlAbsoluta } from "@/lib/sitio";

/**
 * Constructor de metadatos.
 *
 * Todas las rutas pasan por aquí para que la canónica sea siempre absoluta,
 * la imagen OG siempre exista y el idioma sea siempre es-PE. Repetir esa
 * lógica en once `generateMetadata` distintos garantiza que en alguno falte.
 */

export interface OpcionesMetadatos {
  titulo?: string;
  descripcion?: string;
  ruta: string;
  /** Respaldo cuando `titulo` viene vacío desde Sanity. */
  tituloRespaldo?: string;
  /** Respaldo cuando `descripcion` viene vacía desde Sanity. */
  descripcionRespaldo?: string;
  /** Se pasa a la imagen OG generada. */
  etiquetaOg?: string;
  noIndexar?: boolean;
}

export function construirMetadatos({
  titulo,
  descripcion,
  ruta,
  tituloRespaldo,
  descripcionRespaldo,
  etiquetaOg,
  noIndexar = false,
}: OpcionesMetadatos): Metadata {
  const tituloFinal = (titulo || tituloRespaldo || "").trim();
  const descripcionFinal = (descripcion || descripcionRespaldo || "").trim();
  const canonica = urlAbsoluta(ruta);

  const parametrosOg = new URLSearchParams({ titulo: tituloFinal });
  if (etiquetaOg) parametrosOg.set("etiqueta", etiquetaOg);
  const imagenOg = `${URL_SITIO}/api/og?${parametrosOg.toString()}`;

  return {
    title: tituloFinal || undefined,
    description: descripcionFinal || undefined,
    alternates: { canonical: canonica },
    robots: noIndexar ? { index: false, follow: false } : undefined,
    openGraph: {
      type: "website",
      locale: "es_PE",
      url: canonica,
      title: tituloFinal || undefined,
      description: descripcionFinal || undefined,
      images: [{ url: imagenOg, width: 1200, height: 630, alt: tituloFinal }],
    },
    twitter: {
      card: "summary_large_image",
      title: tituloFinal || undefined,
      description: descripcionFinal || undefined,
      images: [imagenOg],
    },
  };
}
