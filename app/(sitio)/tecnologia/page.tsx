import type { Metadata } from "next";

import { BookingCTA } from "@/components/BookingCTA";
import { ImagenSanity } from "@/components/ImagenSanity";
import { Contenedor, EstadoVacio, Seccion, TituloSeccion } from "@/components/Seccion";
import { esquemaMigas, StructuredData } from "@/components/StructuredData";
import { construirMetadatos } from "@/lib/metadatos";
import { RUTAS } from "@/lib/rutas";
import { consultar } from "@/sanity/client";
import { TECNOLOGIAS } from "@/sanity/queries";
import type { Tecnologia } from "@/types/contenido";

/**
 * Tecnología: escáner intraoral 3D y flujo digital.
 *
 * Cada ficha da más peso visual a "qué le cambia al paciente" que a la
 * descripción técnica. Un escáner no vende por sus micras: vende porque
 * elimina la pasta de impresión y las arcadas.
 */

export const revalidate = 60;

export function generateMetadata(): Metadata {
  return construirMetadatos({
    ruta: RUTAS.tecnologia,
    tituloRespaldo: "Tecnología",
    descripcionRespaldo:
      "Escaneo intraoral 3D y flujo digital: qué significan para el paciente.",
    etiquetaOg: "Tecnología",
  });
}

export default async function PaginaTecnologia() {
  const tecnologias = await consultar<Tecnologia[]>(
    TECNOLOGIAS,
    [],
    {},
    { etiquetas: ["tecnologia"] },
  );

  return (
    <>
      <StructuredData
        datos={esquemaMigas([
          { nombre: "Inicio", ruta: RUTAS.inicio },
          { nombre: "Tecnología", ruta: RUTAS.tecnologia },
        ])}
      />

      <Seccion>
        <Contenedor>
          <TituloSeccion
            nivel={1}
            descripcion="Lo que cambia en la consulta, no la ficha técnica del equipo."
          >
            Tecnología
          </TituloSeccion>

          {tecnologias.length > 0 ? (
            <div className="space-y-12">
              {tecnologias.map((tec, i) => (
                <article
                  key={tec._id}
                  className="grid items-center gap-8 lg:grid-cols-2"
                >
                  <div className={i % 2 === 1 ? "lg:order-2" : undefined}>
                    <ImagenSanity
                      imagen={tec.imagen}
                      alt={tec.nombre ?? ""}
                      ancho={800}
                      className="rounded-card"
                      sizes="(max-width: 1024px) 100vw, 500px"
                    />
                  </div>

                  <div className={i % 2 === 1 ? "lg:order-1" : undefined}>
                    <h2 className="font-display text-2xl font-semibold">{tec.nombre}</h2>

                    {tec.descripcion ? (
                      <p className="mt-4 font-cuerpo text-base leading-relaxed text-suave">
                        {tec.descripcion}
                      </p>
                    ) : null}

                    {tec.queSignificaParaElPaciente ? (
                      <div className="mt-6 rounded-card border-l-4 border-marca-500 bg-fondo-alt p-5">
                        <h3 className="font-cuerpo text-xs font-semibold uppercase tracking-wide text-marca-700">
                          Qué significa para ti
                        </h3>
                        <p className="mt-2 font-cuerpo text-base leading-relaxed text-tinta">
                          {tec.queSignificaParaElPaciente}
                        </p>
                      </div>
                    ) : null}
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <EstadoVacio
              titulo="Aún no hay equipos cargados"
              detalle="Cada ficha necesita nombre y qué le cambia al paciente para publicarse."
            />
          )}
        </Contenedor>
      </Seccion>

      <Seccion fondo="alt" aria="Reservar">
        <Contenedor ancho="estrecho" className="text-center">
          <h2 className="font-display text-2xl font-semibold">
            Conoce el diagnóstico digital
          </h2>
          <div className="mt-6 flex justify-center">
            <BookingCTA variant="evaluacion" origen="tecnologia_cierre" tamano="lg" />
          </div>
        </Contenedor>
      </Seccion>
    </>
  );
}
