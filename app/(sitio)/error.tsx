"use client";

import { useEffect } from "react";

import { Contenedor, Seccion } from "@/components/Seccion";

/**
 * Frontera de error del sitio.
 *
 * No muestra el mensaje técnico al paciente: le da una salida (reintentar)
 * y deja el detalle en la consola para diagnóstico.
 */
export default function ErrorDelSitio({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[sitio] Error no controlado:", error);
  }, [error]);

  return (
    <Seccion>
      <Contenedor ancho="estrecho" className="text-center">
        <h1 className="font-display text-2xl font-semibold sm:text-3xl">
          Algo salió mal
        </h1>

        <p className="mx-auto mt-4 max-w-md font-cuerpo text-base text-suave">
          No pudimos cargar esta página. Vuelve a intentarlo; si sigue pasando,
          escríbenos por WhatsApp o llámanos.
        </p>

        <button
          type="button"
          onClick={reset}
          className="mt-8 inline-flex items-center justify-center rounded-boton bg-marca-700 px-6 py-3 font-cuerpo font-semibold text-fondo transition-colors duration-200 ease-suave hover:bg-marca-900"
        >
          Reintentar
        </button>

        {error.digest ? (
          <p className="mt-6 font-cuerpo text-xs text-suave">
            Código de referencia: {error.digest}
          </p>
        ) : null}
      </Contenedor>
    </Seccion>
  );
}
