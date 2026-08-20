import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { StickyBookingBar } from "@/components/StickyBookingBar";
import { WhatsAppFloat } from "@/components/WhatsAppFloat";
import { consultar } from "@/sanity/client";
import { AJUSTES_SITIO } from "@/sanity/queries";
import { AJUSTES_RESPALDO } from "@/lib/sitio";
import type { AjustesSitio } from "@/types/contenido";

/**
 * Layout de las once rutas del sitio.
 *
 * Los ajustes se consultan una sola vez aquí y bajan por props al
 * encabezado, el pie, la barra móvil y el botón flotante. Los cuatro
 * necesitan el mismo teléfono y el mismo WhatsApp: pedirlo cuatro veces
 * sería cuatro viajes a Sanity en cada navegación.
 */
export default async function LayoutSitio({ children }: { children: React.ReactNode }) {
  const ajustes = await consultar<AjustesSitio>(
    AJUSTES_SITIO,
    AJUSTES_RESPALDO,
    {},
    { etiquetas: ["ajustesSitio"], revalidar: 300 },
  );

  const ajustesResueltos = { ...AJUSTES_RESPALDO, ...(ajustes ?? {}) };

  return (
    <>
      <SiteHeader ajustes={ajustesResueltos} />

      <main id="contenido" className="hueco-barra-movil min-h-[60vh]">
        {children}
      </main>

      <SiteFooter ajustes={ajustesResueltos} />
      <StickyBookingBar ajustes={ajustesResueltos} />
      <WhatsAppFloat ajustes={ajustesResueltos} />
    </>
  );
}
