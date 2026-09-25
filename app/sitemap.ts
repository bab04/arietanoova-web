import type { MetadataRoute } from "next";

import { RUTAS, rutaEspecialidad, rutaProblema } from "@/lib/rutas";
import { urlAbsoluta } from "@/lib/sitio";
import { consultar } from "@/sanity/client";
import { RUTAS_PARA_SITEMAP } from "@/sanity/queries";

/**
 * Sitemap generado desde Sanity, no estático.
 *
 * Criterio de verificación del sprint: crear una especialidad en el Studio
 * la hace aparecer en el sitemap sin tocar código.
 *
 * Las prioridades no son un ranking de importancia para Google (Google las
 * ignora casi siempre): sirven de documentación interna de qué páginas
 * mueven el negocio.
 */

interface RutasSanity {
  especialidades: Array<{ slug?: string; _updatedAt?: string }>;
  problemas: Array<{ slug?: string; _updatedAt?: string }>;
}

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const contenido = await consultar<RutasSanity>(
    RUTAS_PARA_SITEMAP,
    { especialidades: [], problemas: [] },
    {},
    { revalidar: 3600 },
  );

  const ahora = new Date();

  const estaticas: MetadataRoute.Sitemap = (
    [
      { url: urlAbsoluta(RUTAS.inicio), priority: 1, changeFrequency: "weekly" },
      { url: urlAbsoluta(RUTAS.especialidades), priority: 0.9, changeFrequency: "weekly" },
      { url: urlAbsoluta(RUTAS.evaluacionMatutina), priority: 0.9, changeFrequency: "weekly" },
      { url: urlAbsoluta(RUTAS.equipo), priority: 0.8, changeFrequency: "monthly" },
      { url: urlAbsoluta(RUTAS.paraOdontologos), priority: 0.8, changeFrequency: "monthly" },
      { url: urlAbsoluta(RUTAS.tecnologia), priority: 0.7, changeFrequency: "monthly" },
      { url: urlAbsoluta(RUTAS.formasDePago), priority: 0.8, changeFrequency: "monthly" },
      { url: urlAbsoluta(RUTAS.contacto), priority: 0.7, changeFrequency: "monthly" },
      { url: urlAbsoluta(RUTAS.problemas), priority: 0.6, changeFrequency: "weekly" },
      { url: urlAbsoluta(RUTAS.casos), priority: 0.6, changeFrequency: "weekly" },
    ] satisfies MetadataRoute.Sitemap
  ).map((entrada) => ({ ...entrada, lastModified: ahora }));

  const especialidades: MetadataRoute.Sitemap = (contenido.especialidades ?? [])
    .filter((e) => e.slug)
    .map((e) => ({
      url: urlAbsoluta(rutaEspecialidad(e.slug!)),
      lastModified: e._updatedAt ? new Date(e._updatedAt) : ahora,
      changeFrequency: "monthly",
      priority: 0.9,
    }));

  const problemas: MetadataRoute.Sitemap = (contenido.problemas ?? [])
    .filter((p) => p.slug)
    .map((p) => ({
      url: urlAbsoluta(rutaProblema(p.slug!)),
      lastModified: p._updatedAt ? new Date(p._updatedAt) : ahora,
      changeFrequency: "monthly",
      priority: 0.7,
    }));

  return [...estaticas, ...especialidades, ...problemas];
}
