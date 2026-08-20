/**
 * El Studio vive fuera del grupo de rutas (sitio), así que no hereda el
 * encabezado, el pie, la barra de reserva ni el botón de WhatsApp.
 * Este layout existe solo para dejar esa decisión explícita.
 */
export default function LayoutEstudio({ children }: { children: React.ReactNode }) {
  return children;
}
