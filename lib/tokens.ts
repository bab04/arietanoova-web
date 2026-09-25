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
  blanco: "#ffffff",
  crema: "#f4f1ea",
  bosque: "#1a4331",
  oliva: "#6b7a4f",
  terracota: "#c0664a",
  oro: "#b8933f",

  marca900: "#1a4331",
  marca700: "#1a4331",
  marca500: "#6b7a4f",
  acento: "#c0664a",
  tinta: "#1a4331",
  suave: "#4a5d52",
  linea: "#e2ded5",
  fondo: "#ffffff",
  fondoAlt: "#f4f1ea",
} as const;

export type NombreDeToken = keyof typeof tokens;
