/**
 * ÚNICO ARCHIVO DE TIPOGRAFÍA DEL SITIO.
 *
 * Cambiar de fuente es editar aquí y nada más. Las familias se exponen como
 * variables CSS (--font-display-var, --font-cuerpo-var) que app/globals.css
 * consume dentro del bloque @theme.
 *
 * PROVISIONAL — ambas familias son marcadores de posición hasta el kit de marca.
 * Se eligieron por ser de licencia abierta, tener buen soporte de castellano
 * (tildes, ñ, ¿, ¡) y autoalojarse con next/font sin peticiones a Google.
 */

import { Fraunces, Inter } from "next/font/google";

/**
 * Titulares. Reemplazar por la display del kit de marca.
 * Se carga como fuente variable (sin `weight`) para que un solo archivo
 * cubra todos los grosores: menos peso descargado en móvil.
 */
export const fuenteDisplay = Fraunces({
  subsets: ["latin", "latin-ext"],
  display: "swap",
  variable: "--font-display-var",
});

/** Texto corrido e interfaz. Reemplazar por la de cuerpo del kit de marca. */
export const fuenteCuerpo = Inter({
  subsets: ["latin", "latin-ext"],
  display: "swap",
  variable: "--font-cuerpo-var",
  weight: ["400", "500", "600", "700"],
});

/** Se aplica en <html> del layout raíz. */
export const clasesDeFuentes = `${fuenteDisplay.variable} ${fuenteCuerpo.variable}`;
