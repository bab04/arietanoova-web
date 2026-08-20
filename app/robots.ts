import type { MetadataRoute } from "next";

import { URL_SITIO } from "@/lib/sitio";

/**
 * robots.txt.
 *
 * Mientras el sitio viva en un dominio provisional (no https), se bloquea
 * la indexación completa. Publicar en Google una versión de pruebas de una
 * clínica —con textos de relleno y sin fotos— hace más daño que no estar,
 * y luego cuesta semanas limpiarlo.
 *
 * En cuanto NEXT_PUBLIC_SITE_URL apunte al dominio real con https, se abre
 * solo, sin tocar código.
 */
export default function robots(): MetadataRoute.Robots {
  const enProduccion = URL_SITIO.startsWith("https://");

  if (!enProduccion) {
    return {
      rules: [{ userAgent: "*", disallow: "/" }],
      sitemap: `${URL_SITIO}/sitemap.xml`,
    };
  }

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // El Studio y la API no aportan nada a un buscador.
        disallow: ["/studio", "/studio/", "/api/"],
      },
    ],
    sitemap: `${URL_SITIO}/sitemap.xml`,
    host: URL_SITIO,
  };
}
