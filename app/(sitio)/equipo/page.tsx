import type { Metadata } from "next";

import { BookingCTA } from "@/components/BookingCTA";
import { Contenedor, EstadoVacio, Seccion, TituloSeccion } from "@/components/Seccion";
import {
  esquemaMigas,
  esquemaPersona,
  StructuredData,
} from "@/components/StructuredData";
import { TeamMember } from "@/components/TeamMember";
import { construirMetadatos } from "@/lib/metadatos";
import { RUTAS } from "@/lib/rutas";
import { consultar } from "@/sanity/client";
import { EQUIPO_COMPLETO } from "@/sanity/queries";
import type { MiembroEquipo } from "@/types/contenido";

/**
 * Equipo: directora y especialistas.
 *
 * Emite un `Person` de JSON-LD por profesional. El `jobTitle` sale de
 * `tituloProfesional()`, así que la regla del RNE en trámite se respeta
 * también en el marcado estructurado.
 */

export const revalidate = 60;

export function generateMetadata(): Metadata {
  return construirMetadatos({
    ruta: RUTAS.equipo,
    tituloRespaldo: "Equipo",
    descripcionRespaldo:
      "Directora y especialistas de la clínica, con su colegiatura y su formación.",
    etiquetaOg: "Equipo",
  });
}

export default async function PaginaEquipo() {
  const equipo = await consultar<MiembroEquipo[]>(
    EQUIPO_COMPLETO,
    [],
    {},
    { etiquetas: ["miembroEquipo"] },
  );

  const directora = equipo.find((m) => m.esDirectora);
  const resto = equipo.filter((m) => !m.esDirectora);

  return (
    <>
      <StructuredData
        datos={[
          esquemaMigas([
            { nombre: "Inicio", ruta: RUTAS.inicio },
            { nombre: "Equipo", ruta: RUTAS.equipo },
          ]),
          ...equipo.map(esquemaPersona),
        ]}
      />

      <Seccion>
        <Contenedor>
          <TituloSeccion
            nivel={1}
            descripcion="Colegiatura y formación de cada profesional, verificables."
          >
            Equipo
          </TituloSeccion>

          {equipo.length === 0 ? (
            <EstadoVacio
              titulo="Aún no hay perfiles cargados"
              detalle="Cada perfil necesita nombre, colegiatura y especialidad para publicarse."
            />
          ) : null}

          {directora ? (
            <div className="mb-12">
              <h2 className="mb-6 font-display text-xl font-semibold">Dirección</h2>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                <TeamMember miembro={directora} />
              </div>
            </div>
          ) : null}

          {resto.length > 0 ? (
            <div>
              {directora ? (
                <h2 className="mb-6 font-display text-xl font-semibold">Especialistas</h2>
              ) : null}
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {resto.map((miembro) => (
                  <TeamMember key={miembro._id} miembro={miembro} />
                ))}
              </div>
            </div>
          ) : null}
        </Contenedor>
      </Seccion>

      <Seccion fondo="alt" aria="Reservar">
        <Contenedor ancho="estrecho" className="text-center">
          <h2 className="font-display text-2xl font-semibold">
            Reserva con el especialista que necesitas
          </h2>
          <div className="mt-6 flex justify-center">
            <BookingCTA variant="reservar" origen="equipo_cierre" tamano="lg" />
          </div>
        </Contenedor>
      </Seccion>
    </>
  );
}
