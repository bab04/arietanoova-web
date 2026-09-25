import type { VarianteCta } from "@/types/contenido";

/**
 * Las once rutas del sitio, en un solo sitio.
 * El encabezado, el pie y el sitemap leen de aquí: añadir una sección es
 * editar este archivo, no tres.
 */

export const RUTAS = {
  inicio: "/",
  especialidades: "/especialidades",
  problemas: "/problemas",
  equipo: "/equipo",
  tecnologia: "/tecnologia",
  casos: "/casos",
  paraOdontologos: "/para-odontologos",
  evaluacionMatutina: "/evaluacion-matutina",
  formasDePago: "/formas-de-pago",
  contacto: "/contacto",
} as const;

export interface EntradaNavegacion {
  etiqueta: string;
  href: string;
  /** Fase 2: se construye la ruta pero no se enlaza aún desde el menú. */
  fase2?: boolean;
}

/** Navegación principal de primer nivel (escritorio y móvil). */
export const NAVEGACION_PRINCIPAL: EntradaNavegacion[] = [
  { etiqueta: "Especialidades", href: RUTAS.especialidades },
  { etiqueta: "Equipo", href: RUTAS.equipo },
  { etiqueta: "Tecnología", href: RUTAS.tecnologia },
  { etiqueta: "Para odontólogos", href: RUTAS.paraOdontologos },
  { etiqueta: "Contacto", href: RUTAS.contacto },
];

/** Enlaces que van en el pie y enlazados contextualmente. */
export const NAVEGACION_PIE: EntradaNavegacion[] = [
  { etiqueta: "Problemas frecuentes", href: RUTAS.problemas },
  { etiqueta: "Casos clínicos", href: RUTAS.casos },
  { etiqueta: "Evaluación matutina", href: RUTAS.evaluacionMatutina },
  { etiqueta: "Formas de pago", href: RUTAS.formasDePago },
];

export function rutaEspecialidad(slug: string): string {
  return `${RUTAS.especialidades}/${slug}`;
}

export function rutaProblema(slug: string): string {
  return `${RUTAS.problemas}/${slug}`;
}

/**
 * Destino por defecto de cada variante de CTA.
 *
 * La clienta pidió llamadas a la acción distintas por sección y con destinos
 * distintos: "consultar sobre mi caso" abre una conversación, "solicitar
 * evaluación" lleva a la landing de la matutina y "reservar" va a la agenda.
 *
 * Un `enlaceReserva` de Sanity, cuando existe, tiene prioridad sobre esto.
 */
export const DESTINO_POR_VARIANTE: Record<VarianteCta, string> = {
  reservar: RUTAS.contacto,
  consultar: RUTAS.contacto,
  evaluacion: RUTAS.evaluacionMatutina,
};
