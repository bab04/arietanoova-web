import type { Metadata } from "next";

import { ProblemCard } from "@/components/ProblemCard";
import { Contenedor, EstadoVacio, Seccion, TituloSeccion } from "@/components/Seccion";
import { esquemaMigas, StructuredData } from "@/components/StructuredData";
import { construirMetadatos } from "@/lib/metadatos";
import { RUTAS } from "@/lib/rutas";
import { consultar } from "@/sanity/client";
import { PROBLEMAS_INDICE } from "@/sanity/queries";
import type { ProblemaResumen } from "@/types/contenido";

/**
 * Índice de problemas — Fase 2.
 *
 * La ruta y la plantilla se construyen en el Sprint 1; es normal que quede
 * vacía. Existe separada de las especialidades porque captura la búsqueda
 * en el idioma del paciente ("me sangran las encías") en vez del clínico.
 */

export const revalidate = 60;

export function generateMetadata(): Metadata {
  return construirMetadatos({
    ruta: RUTAS.problemas,
    tituloRespaldo: "Problemas frecuentes",
    descripcionRespaldo:
      "Qué hacer ante las molestias dentales más frecuentes y con qué especialista atenderlas.",
    etiquetaOg: "Problemas frecuentes",
  });
}

export default async function IndiceProblemas() {
  const problemas = await consultar<ProblemaResumen[]>(
    PROBLEMAS_INDICE,
    [],
    {},
    { etiquetas: ["problema"] },
  );

  return (
    <>
      <StructuredData
        datos={esquemaMigas([
          { nombre: "Inicio", ruta: RUTAS.inicio },
          { nombre: "Problemas", ruta: RUTAS.problemas },
        ])}
      />

      <Seccion>
        <Contenedor>
          <TituloSeccion
            nivel={1}
            descripcion="Descrito como lo dice el paciente, no como lo dice el odontólogo."
          >
            Problemas frecuentes
          </TituloSeccion>

          {problemas.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {problemas.map((problema) => (
                <ProblemCard key={problema._id} problema={problema} />
              ))}
            </div>
          ) : (
            <EstadoVacio
              titulo="Esta sección está en preparación"
              detalle="Se publicará en la segunda fase del proyecto. Mientras tanto, puedes revisar las especialidades."
            />
          )}
        </Contenedor>
      </Seccion>
    </>
  );
}
