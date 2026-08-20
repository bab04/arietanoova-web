import type { Metadata } from "next";

import { Contenedor, EstadoVacio, Seccion, TituloSeccion } from "@/components/Seccion";
import { SpecialtyCard } from "@/components/SpecialtyCard";
import { esquemaMigas, StructuredData } from "@/components/StructuredData";
import { construirMetadatos } from "@/lib/metadatos";
import { RUTAS } from "@/lib/rutas";
import { consultar } from "@/sanity/client";
import { ESPECIALIDADES_INDICE } from "@/sanity/queries";
import type { EspecialidadResumen } from "@/types/contenido";

/**
 * Índice de especialidades.
 *
 * La lista NO está en el código: sale entera de Sanity. Crear una
 * especialidad nueva en el Studio la hace aparecer aquí, en su página y en
 * el sitemap sin tocar nada — es uno de los criterios de verificación
 * del sprint.
 */

export const revalidate = 60;

export function generateMetadata(): Metadata {
  return construirMetadatos({
    ruta: RUTAS.especialidades,
    tituloRespaldo: "Especialidades",
    descripcionRespaldo:
      "Especialidades odontológicas atendidas en la clínica, cada una por un profesional dedicado.",
    etiquetaOg: "Especialidades",
  });
}

export default async function IndiceEspecialidades() {
  const especialidades = await consultar<EspecialidadResumen[]>(
    ESPECIALIDADES_INDICE,
    [],
    {},
    { etiquetas: ["especialidad"] },
  );

  return (
    <>
      <StructuredData
        datos={esquemaMigas([
          { nombre: "Inicio", ruta: RUTAS.inicio },
          { nombre: "Especialidades", ruta: RUTAS.especialidades },
        ])}
      />

      <Seccion>
        <Contenedor>
          <TituloSeccion
            nivel={1}
            descripcion="Cada especialidad la atiende un profesional dedicado a ella."
          >
            Especialidades
          </TituloSeccion>

          {especialidades.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {especialidades.map((especialidad) => (
                <SpecialtyCard key={especialidad._id} especialidad={especialidad} />
              ))}
            </div>
          ) : (
            <EstadoVacio
              titulo="Aún no hay especialidades cargadas"
              detalle="Se listarán aquí automáticamente en cuanto se creen en el gestor de contenido."
            />
          )}
        </Contenedor>
      </Seccion>
    </>
  );
}
