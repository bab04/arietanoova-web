import type { Metadata } from "next";

import { BeforeAfter } from "@/components/BeforeAfter";
import { BookingCTA } from "@/components/BookingCTA";
import { Contenedor, EstadoVacio, Seccion, TituloSeccion } from "@/components/Seccion";
import { esquemaMigas, StructuredData } from "@/components/StructuredData";
import { construirMetadatos } from "@/lib/metadatos";
import { RUTAS } from "@/lib/rutas";
import { consultar } from "@/sanity/client";
import { CASOS_INDICE } from "@/sanity/queries";
import type { Caso } from "@/types/contenido";

/**
 * Casos antes y después — Fase 2.
 *
 * La consulta filtra por `consentimientoFirmado == true`. Es la segunda
 * barrera, después de la validación del esquema: aquí no puede llegar un
 * caso sin consentimiento aunque alguien lo creara saltándose el Studio.
 */

export const revalidate = 60;

export function generateMetadata(): Metadata {
  return construirMetadatos({
    ruta: RUTAS.casos,
    tituloRespaldo: "Casos",
    descripcionRespaldo:
      "Casos tratados en la clínica, publicados con consentimiento del paciente.",
    etiquetaOg: "Casos",
  });
}

export default async function PaginaCasos() {
  const casos = await consultar<Caso[]>(CASOS_INDICE, [], {}, { etiquetas: ["caso"] });

  return (
    <>
      <StructuredData
        datos={esquemaMigas([
          { nombre: "Inicio", ruta: RUTAS.inicio },
          { nombre: "Casos", ruta: RUTAS.casos },
        ])}
      />

      <Seccion>
        <Contenedor>
          <TituloSeccion
            nivel={1}
            descripcion="Publicados únicamente con consentimiento firmado del paciente."
          >
            Casos
          </TituloSeccion>

          {casos.length > 0 ? (
            <div className="space-y-16">
              {casos.map((caso) => (
                <article
                  key={caso._id}
                  className="grid gap-8 border-b border-linea pb-16 last:border-0 lg:grid-cols-2 lg:items-start"
                >
                  <BeforeAfter
                    antes={caso.imagenAntes}
                    despues={caso.imagenDespues}
                    altAntes={`${caso.titulo ?? "Caso"}: antes del tratamiento`}
                    altDespues={`${caso.titulo ?? "Caso"}: después del tratamiento`}
                  />

                  <div>
                    <h2 className="font-display text-2xl font-semibold">{caso.titulo}</h2>

                    {caso.especialidadesInvolucradas &&
                    caso.especialidadesInvolucradas.length > 0 ? (
                      <ul className="mt-3 flex flex-wrap gap-2">
                        {caso.especialidadesInvolucradas.map((especialidad) => (
                          <li
                            key={especialidad._id}
                            className="rounded-pastilla bg-fondo-alt px-3 py-1 font-cuerpo text-xs text-marca-700"
                          >
                            {especialidad.nombre}
                          </li>
                        ))}
                      </ul>
                    ) : null}

                    <dl className="mt-6 space-y-4">
                      {caso.problema ? (
                        <div>
                          <dt className="font-cuerpo text-xs font-semibold uppercase tracking-wide text-marca-700">
                            Con qué llegó
                          </dt>
                          <dd className="mt-1 font-cuerpo text-sm leading-relaxed text-suave">
                            {caso.problema}
                          </dd>
                        </div>
                      ) : null}

                      {caso.resultado ? (
                        <div>
                          <dt className="font-cuerpo text-xs font-semibold uppercase tracking-wide text-marca-700">
                            Resultado
                          </dt>
                          <dd className="mt-1 font-cuerpo text-sm leading-relaxed text-suave">
                            {caso.resultado}
                          </dd>
                        </div>
                      ) : null}
                    </dl>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <EstadoVacio
              titulo="Esta sección está en preparación"
              detalle="Los casos se publicarán en la segunda fase, únicamente con consentimiento firmado del paciente."
            />
          )}
        </Contenedor>
      </Seccion>

      <Seccion fondo="alt" aria="Consultar">
        <Contenedor ancho="estrecho" className="text-center">
          <h2 className="font-display text-2xl font-semibold">
            ¿Tu caso se parece a alguno?
          </h2>
          <div className="mt-6 flex justify-center">
            <BookingCTA variant="consultar" origen="casos_cierre" tamano="lg" />
          </div>
        </Contenedor>
      </Seccion>
    </>
  );
}
