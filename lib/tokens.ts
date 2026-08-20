/**
 * Espejo en TypeScript de los tokens de app/globals.css.
 *
 * Existe por una sola razón: `next/og` genera las imágenes de Open Graph en
 * un renderizador aislado que no lee la hoja de estilos del sitio, así que
 * necesita los valores literales. Es el ÚNICO archivo, junto a globals.css,
 * donde puede aparecer un valor hexadecimal.
 *
 * Al reemplazar el kit de marca hay que actualizar los dos archivos. El
 * verificador (npm run verificar:tokens) comprueba que sigan sincronizados.
 */

export const tokens = {
  marca900: "#1a2e35",
  marca700: "#2d4f5a",
  marca500: "#3f7d8c",
  acento: "#c9a227",
  tinta: "#16151a",
  suave: "#6b6f76",
  linea: "#e2e5ea",
  fondo: "#ffffff",
  fondoAlt: "#f6f7f9",
} as const;

export type NombreDeToken = keyof typeof tokens;
