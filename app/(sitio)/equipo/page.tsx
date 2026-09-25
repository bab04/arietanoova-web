import Image from "next/image";
import type { Metadata } from "next";

import { BookingCTA } from "@/components/BookingCTA";
import { Revelar, RevelarEnCascada } from "@/components/Revelar";
import { Contenedor, EstadoVacio, Seccion, TituloSeccion } from "@/components/Seccion";
import {
  esquemaMigas,
  esquemaPersona,
  StructuredData,
} from "@/components/StructuredData";
import { TeamMember } from "@/components/TeamMember";
import { EQUIPO_RESPALDO, FOTOS_CLINICA_DESTACADAS } from "@/lib/datos-respaldo";
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
    tituloRespaldo: "Equipo Médico y Especialistas",
    descripcionRespaldo:
      "Directora Médica y especialistas de Arieta Noova: colegiatura, RNE transparente y formación acreditada.",
    etiquetaOg: "Equipo",
  });
}

export default async function PaginaEquipo() {
  const datos = await consultar<MiembroEquipo[]>(
    EQUIPO_COMPLETO,
    EQUIPO_RESPALDO,
    {},
    { etiquetas: ["miembroEquipo"] },
  );

  const equipo = datos && datos.length > 0 ? datos : EQUIPO_RESPALDO;
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
            descripcion="Profesionales con formación de posgrado, colegiatura activa y años de trayectoria médica dedicados a tu salud bucodental."
          >
            Cuerpo Médico y Asistencial
          </TituloSeccion>

          {/* Banner Fotográfico del Equipo Completo */}
          <Revelar className="mb-14 overflow-hidden rounded-card border border-linea bg-fondo-alt shadow-card">
            <div className="relative aspect-[16/9] w-full sm:aspect-[21/9]">
              <Image
                src={FOTOS_CLINICA_DESTACADAS.equipoCompleto}
                alt="Equipo Clínico de Clínica Dental Arieta Noova"
                fill
                priority
                sizes="(max-width: 1200px) 100vw, 1200px"
                className="object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-marca-900/80 via-marca-900/20 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 text-blanco sm:bottom-8 sm:left-8">
                <span className="inline-block rounded-pastilla border border-blanco/30 bg-blanco/10 px-3 py-1 font-cuerpo text-xs font-semibold uppercase tracking-wider backdrop-blur-md">
                  Equipo Clínico Multidisciplinario
                </span>
                <p className="mt-2 font-display text-lg font-semibold sm:text-2xl">
                  Un solo equipo sincronizado para cuidar cada detalle de tu salud bucal
                </p>
                <p className="mt-1 max-w-2xl font-cuerpo text-xs sm:text-sm text-blanco/90">
                  Dra. Jessica Arieta junto a su equipo de cirujanos dentistas y asistentes clínicas en las instalaciones de Pueblo Libre.
                </p>
              </div>
            </div>
          </Revelar>

          {equipo.length === 0 ? (
            <EstadoVacio
              titulo="Aún no hay perfiles cargados"
              detalle="Cada perfil necesita nombre, colegiatura y especialidad para publicarse."
            />
          ) : null}

          {directora ? (
            <div className="mb-14">
              <div className="mb-6 flex items-center justify-between border-b border-linea pb-3">
                <h2 className="font-display text-2xl font-semibold text-marca-900">
                  Dirección Médica
                </h2>
                <span className="font-cuerpo text-xs font-semibold uppercase tracking-wider text-acento">
                  25 Años de Ejercicio Profesional
                </span>
              </div>
              <div className="max-w-xl">
                <TeamMember miembro={directora} />
              </div>
            </div>
          ) : null}

          {resto.length > 0 ? (
            <div className="mb-16">
              <div className="mb-6 flex items-center justify-between border-b border-linea pb-3">
                <h2 className="font-display text-2xl font-semibold text-marca-900">
                  Cuerpo de Especialistas y Cirujanos Dentistas
                </h2>
                <span className="font-cuerpo text-xs text-suave">
                  Transparencia colegial verificable
                </span>
              </div>
              <RevelarEnCascada className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {resto.map((miembro) => (
                  <TeamMember key={miembro._id} miembro={miembro} />
                ))}
              </RevelarEnCascada>
            </div>
          ) : null}

          {/* Junta Médica Multidisciplinaria */}
          <Revelar className="mt-12 overflow-hidden rounded-card border border-linea bg-fondo-alt p-6 sm:p-10">
            <div className="grid items-center gap-8 lg:grid-cols-12">
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-card border border-linea bg-fondo shadow-sm lg:col-span-6">
                <Image
                  src={FOTOS_CLINICA_DESTACADAS.juntaMedica}
                  alt="Junta Médica Multidisciplinaria en Clínica Dental Arieta Noova"
                  fill
                  sizes="(max-width: 1024px) 100vw, 500px"
                  className="object-cover"
                />
              </div>
              <div className="lg:col-span-6">
                <span className="font-cuerpo text-xs font-semibold uppercase tracking-widest text-marca-500">
                  Metodología Clínica Arieta Noova
                </span>
                <h3 className="mt-2 font-display text-2xl font-semibold text-marca-900 sm:text-3xl">
                  Junta Médica Multidisciplinaria
                </h3>
                <p className="mt-4 font-cuerpo text-base leading-relaxed text-suave">
                  En casos de rehabilitación compleja, mordidas alteradas o piezas en riesgo, ningún tratamiento se decide de forma aislada. Nuestro cuerpo médico analiza conjuntamente escaneos tridimensionales, modelos de estudio y radiografías digitales para determinar la secuencia clínica exacta que mejor protege tus dientes a largo plazo.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <div className="rounded-pastilla border border-linea bg-fondo px-3 py-1 font-cuerpo text-xs font-medium text-marca-700">
                    ✓ Diagnóstico cruzado entre especialidades
                  </div>
                  <div className="rounded-pastilla border border-linea bg-fondo px-3 py-1 font-cuerpo text-xs font-medium text-marca-700">
                    ✓ Preservación de piezas dentales
                  </div>
                  <div className="rounded-pastilla border border-linea bg-fondo px-3 py-1 font-cuerpo text-xs font-medium text-marca-700">
                    ✓ Planificación predecible en equipo
                  </div>
                </div>
              </div>
            </div>
          </Revelar>
        </Contenedor>
      </Seccion>

      <Seccion fondo="alt" aria="Reservar">
        <Contenedor ancho="estrecho" className="text-center">
          <h2 className="font-display text-2xl font-semibold text-marca-900 sm:text-3xl">
            Reserva con el especialista que necesitas
          </h2>
          <p className="mt-3 font-cuerpo text-base text-suave">
            Atención personalizada en Pueblo Libre con el respaldo y la supervisión de la Dra. Jessica Arieta.
          </p>
          <div className="mt-6 flex justify-center">
            <BookingCTA variant="reservar" origen="equipo_cierre" tamano="lg" />
          </div>
        </Contenedor>
      </Seccion>
    </>
  );
}
