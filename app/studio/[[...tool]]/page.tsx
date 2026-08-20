/**
 * Studio de Sanity embebido en /studio.
 *
 * Se sirve desde la propia web para que la doctora entre con una sola
 * dirección y no tenga que instalar nada.
 *
 * Si aún no hay proyecto de Sanity creado, muestra instrucciones en vez de
 * romperse: el sprint exige que el proyecto arranque sin credenciales.
 */

import { SANITY_CONFIGURADO } from "@/sanity/env";

import { EstudioIncrustado } from "./EstudioIncrustado";

export const dynamic = "force-static";

export { metadata, viewport } from "next-sanity/studio";

export default function PaginaEstudio() {
  if (!SANITY_CONFIGURADO) {
    return (
      <main className="mx-auto max-w-xl p-8 font-cuerpo text-tinta">
        <h1 className="font-display text-2xl text-marca-900">Studio no configurado</h1>
        <p className="mt-4 text-suave">
          Falta la variable <code className="text-marca-700">NEXT_PUBLIC_SANITY_PROJECT_ID</code>.
          Créala en <code className="text-marca-700">.env.local</code> con el identificador del
          proyecto de Sanity y vuelve a cargar esta página.
        </p>
        <p className="mt-4 text-suave">
          El resto del sitio funciona sin esta variable: las secciones se muestran vacías.
        </p>
      </main>
    );
  }

  return <EstudioIncrustado />;
}
