"use client";

import { NextStudio } from "next-sanity/studio";

import config from "@/sanity.config";

/**
 * El Studio es puramente de cliente. Se aísla en su propio componente para
 * que la página siga siendo un componente de servidor y pueda decidir si
 * mostrarlo o no según haya configuración.
 */
export function EstudioIncrustado() {
  return <NextStudio config={config} />;
}
