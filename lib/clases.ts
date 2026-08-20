/**
 * Une clases condicionales sin traer una dependencia para ello.
 * No resuelve conflictos entre utilidades de Tailwind (eso sería
 * tailwind-merge); en este proyecto no hace falta porque los componentes
 * exponen `className` como añadido, no como sustituto.
 */
export function cx(...partes: Array<string | false | null | undefined>): string {
  return partes.filter(Boolean).join(" ");
}
