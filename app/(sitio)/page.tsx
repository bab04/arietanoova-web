import type { Metadata } from "next";
import Link from "next/link";

import { BookingCTA } from "@/components/BookingCTA";
import { IconoFlecha } from "@/components/Iconos";
import { Contenedor, EstadoVacio, Seccion, TituloSeccion } from "@/components/Seccion";
import { SpecialtyCard } from "@/components/SpecialtyCard";
import { StatsCounter, type Estadistica } from "@/components/StatsCounter";
import {
  esquemaClinica,
  esquemaSitio,
  StructuredData,
} from "@/components/StructuredData";
import { TeamMember } from "@/components/TeamMember";
import { construirMetadatos } from "@/lib/metadatos";
import { RUTAS } from "@/lib/rutas";
import { AJUSTES_RESPALDO } from "@/lib/sitio";
import { consultar } from "@/sanity/client";
import { AJUSTES_SITIO, PORTADA } from "@/sanity/queries";
import type {
  AjustesSitio,
  EspecialidadResumen,
  MiembroEquipo,
  PaginaEvaluacion,
  Tecnologia,
} from "@/types/contenido";

/**
 * Portada.
 *
 * No lleva copy clínico: los titulares grandes vienen de Sanity cuando
 * lleguen los textos. Lo que sí está construido es la arquitectura —
 * qué secciones hay, en qué orden y desde dónde se alimenta cada una.
 */

interface DatosPortada {
  especialidades: EspecialidadResumen[];
  equipo: MiembroEquipo[];
  tecnologias: Tecnologia[];
  evaluacion: Pick<
    PaginaEvaluacion,
    "titulo" | "precio" | "horarioDisponible" | "enlaceReserva"
  > | null;
}

const RESPALDO: DatosPortada = {
  especialidades: [],
  equipo: [],
  tecnologias: [],
  evaluacion: null,
};

export const revalidate = 60;

export function generateMetadata(): Metadata {
  return construirMetadatos({
    ruta: RUTAS.inicio,
    tituloRespaldo: "Arieta Noova",
    // PROVISIONAL: la descripción definitiva llega con los textos finales.
    descripcionRespaldo:
      "Clínica dental de especialistas en Pueblo Libre, Lima.",
    etiquetaOg: "Pueblo Libre, Lima",
  });
}

export default async function Portada() {
  const [datos, ajustes] = await Promise.all([
    consultar<DatosPortada>(PORTADA, RESPALDO, {}, { etiquetas: ["portada"] }),
    consultar<AjustesSitio>(AJUSTES_SITIO, AJUSTES_RESPALDO, {}, {
      etiquetas: ["ajustesSitio"],
    }),
  ]);

  const ajustesResueltos = { ...AJUSTES_RESPALDO, ...(ajustes ?? {}) };
  const especialidades = datos.especialidades ?? [];
  const equipo = datos.equipo ?? [];
  const directora = equipo.find((m) => m.esDirectora);

  return (
    <>
      <StructuredData
        datos={[esquemaClinica(ajustesResueltos), esquemaSitio(ajustesResueltos)]}
      />

      {/* ── Portada ───────────────────────────────────────────────────── */}
      <section className="border-b border-linea bg-fondo-alt py-seccion lg:py-seccion-lg">
        <Contenedor>
          <div className="max-w-3xl">
            <p className="font-cuerpo text-sm font-semibold uppercase tracking-widest text-marca-500">
              {[ajustesResueltos.distrito, ajustesResueltos.ciudad]
                .filter(Boolean)
                .join(", ")}
            </p>

            <h1 className="mt-4 font-display text-4xl font-semibold leading-tight sm:text-5xl lg:text-6xl">
              {ajustesResueltos.nombreClinica}
            </h1>

            {/* El titular y el subtítulo definitivos llegan con los textos.
                Hasta entonces se muestra el estado vacío, no texto inventado. */}
            <p className="mt-6 font-cuerpo text-lg text-suave">
              Contenido de portada pendiente de carga en el gestor.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <BookingCTA variant="reservar" origen="portada_hero" tamano="lg" />
              <BookingCTA
                variant="evaluacion"
                origen="portada_hero"
                tamano="lg"
                estilo="contorno"
              />
            </div>
          </div>
        </Contenedor>
      </section>

      {/* ── Especialidades ────────────────────────────────────────────── */}
      <Seccion aria="Especialidades">
        <Contenedor>
          <TituloSeccion descripcion="Cada especialidad la atiende un profesional dedicado a ella.">
            Especialidades
          </TituloSeccion>

          {especialidades.length > 0 ? (
            <>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {especialidades.slice(0, 6).map((especialidad) => (
                  <SpecialtyCard key={especialidad._id} especialidad={especialidad} />
                ))}
              </div>

              {especialidades.length > 6 ? (
                <p className="mt-8">
                  <Link
                    href={RUTAS.especialidades}
                    className="inline-flex items-center gap-2 font-cuerpo text-sm font-semibold text-marca-700 hover:text-marca-900"
                  >
                    Ver todas las especialidades
                    <IconoFlecha className="text-base" />
                  </Link>
                </p>
              ) : null}
            </>
          ) : (
            <EstadoVacio
              titulo="Aún no hay especialidades cargadas"
              detalle="Se muestran automáticamente en cuanto se creen en el gestor de contenido."
            />
          )}
        </Contenedor>
      </Seccion>

      {/* ── Evaluación matutina ───────────────────────────────────────── */}
      {datos.evaluacion ? (
        <Seccion fondo="alt" aria="Evaluación matutina">
          <Contenedor>
            <div className="rounded-card border border-linea bg-fondo p-8 sm:p-12">
              <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
                <div className="max-w-xl">
                  <h2 className="font-display text-2xl font-semibold sm:text-3xl">
                    {datos.evaluacion.titulo}
                  </h2>

                  <div className="mt-4 flex flex-wrap items-baseline gap-x-6 gap-y-2">
                    {datos.evaluacion.precio ? (
                      <p className="font-display text-3xl font-semibold text-marca-700">
                        {datos.evaluacion.precio}
                      </p>
                    ) : null}
                    {datos.evaluacion.horarioDisponible ? (
                      <p className="font-cuerpo text-sm text-suave">
                        {datos.evaluacion.horarioDisponible}
                      </p>
                    ) : null}
                  </div>
                </div>

                <BookingCTA
                  variant="evaluacion"
                  origen="portada_evaluacion"
                  href={datos.evaluacion.enlaceReserva ?? undefined}
                  tamano="lg"
                />
              </div>
            </div>
          </Contenedor>
        </Seccion>
      ) : null}

      {/* ── Cifras ────────────────────────────────────────────────────── */}
      {(() => {
        // Solo se muestran cifras que se puedan derivar del contenido real.
        // Nada de números redondos inventados.
        const cifras: Estadistica[] = [];

        if (equipo.length > 0) {
          cifras.push({ valor: equipo.length, etiqueta: "Profesionales" });
        }
        if (especialidades.length > 0) {
          cifras.push({ valor: especialidades.length, etiqueta: "Especialidades" });
        }
        if (directora?.aniosExperiencia) {
          cifras.push({
            valor: directora.aniosExperiencia,
            etiqueta: "Años de trayectoria de la directora",
          });
        }
        if (datos.tecnologias.length > 0) {
          cifras.push({
            valor: datos.tecnologias.length,
            etiqueta: "Equipos de diagnóstico digital",
          });
        }

        if (cifras.length === 0) return null;

        return (
          <Seccion aria="La clínica en cifras">
            <Contenedor>
              <StatsCounter estadisticas={cifras} />
            </Contenedor>
          </Seccion>
        );
      })()}

      {/* ── Equipo ────────────────────────────────────────────────────── */}
      <Seccion fondo="alt" aria="Equipo">
        <Contenedor>
          <TituloSeccion descripcion="Credenciales verificables, no adjetivos.">
            Equipo
          </TituloSeccion>

          {equipo.length > 0 ? (
            <>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {equipo.slice(0, 4).map((miembro) => (
                  <TeamMember key={miembro._id} miembro={miembro} />
                ))}
              </div>

              <p className="mt-8">
                <Link
                  href={RUTAS.equipo}
                  className="inline-flex items-center gap-2 font-cuerpo text-sm font-semibold text-marca-700 hover:text-marca-900"
                >
                  Conocer al equipo completo
                  <IconoFlecha className="text-base" />
                </Link>
              </p>
            </>
          ) : (
            <EstadoVacio
              titulo="Aún no hay perfiles cargados"
              detalle="Cada perfil necesita nombre, colegiatura y especialidad para publicarse."
            />
          )}
        </Contenedor>
      </Seccion>

      {/* ── Para odontólogos ──────────────────────────────────────────── */}
      <Seccion aria="Para odontólogos">
        <Contenedor>
          <div className="flex flex-col gap-6 rounded-card border border-linea p-8 sm:flex-row sm:items-center sm:justify-between sm:p-10">
            <div>
              <h2 className="font-display text-xl font-semibold sm:text-2xl">
                ¿Eres odontólogo?
              </h2>
              <p className="mt-2 font-cuerpo text-sm text-suave">
                Deriva un paciente y coordina el caso con el especialista.
              </p>
            </div>

            <BookingCTA
              variant="consultar"
              origen="portada_derivacion"
              href={RUTAS.paraOdontologos}
              etiqueta="Derivar un paciente"
              estilo="contorno"
            />
          </div>
        </Contenedor>
      </Seccion>
    </>
  );
}
