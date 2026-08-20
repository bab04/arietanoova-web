import Link from "next/link";

import { BookingCTA } from "@/components/BookingCTA";
import { Contenedor, Seccion } from "@/components/Seccion";
import { RUTAS } from "@/lib/rutas";

/** Página no encontrada. Ofrece salidas, no un callejón. */
export default function NoEncontrada() {
  return (
    <Seccion>
      <Contenedor ancho="estrecho" className="text-center">
        <p className="font-cuerpo text-sm font-semibold uppercase tracking-widest text-marca-500">
          Error 404
        </p>

        <h1 className="mt-4 font-display text-3xl font-semibold sm:text-4xl">
          No encontramos esta página
        </h1>

        <p className="mx-auto mt-4 max-w-md font-cuerpo text-base text-suave">
          Puede que el enlace haya cambiado. Prueba desde las especialidades o
          escríbenos y te orientamos.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <BookingCTA
            variant="consultar"
            origen="pagina_404"
            href={RUTAS.especialidades}
            etiqueta="Ver especialidades"
          />
          <BookingCTA
            variant="reservar"
            origen="pagina_404"
            estilo="contorno"
          />
        </div>

        <p className="mt-8">
          <Link
            href={RUTAS.inicio}
            className="font-cuerpo text-sm text-marca-700 underline underline-offset-4 hover:text-marca-900"
          >
            Volver al inicio
          </Link>
        </p>
      </Contenedor>
    </Seccion>
  );
}
