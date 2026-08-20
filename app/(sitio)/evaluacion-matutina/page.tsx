import type { Metadata } from "next";

import { BookingCTA } from "@/components/BookingCTA";
import { IconoReloj } from "@/components/Iconos";
import { IncludesList } from "@/components/IncludesList";
import { ProcessSteps } from "@/components/ProcessSteps";
import { Contenedor, EstadoVacio, Seccion, TituloSeccion } from "@/components/Seccion";
import { esquemaMigas, StructuredData } from "@/components/StructuredData";
import { TeamMember } from "@/components/TeamMember";
import { construirMetadatos } from "@/lib/metadatos";
import { RUTAS } from "@/lib/rutas";
import { consultar } from "@/sanity/client";
import { PAGINA_EVALUACION } from "@/sanity/queries";
import type { PaginaEvaluacion } from "@/types/contenido";

/**
 * Landing de la evaluación matutina.
 *
 * Tiene un objetivo comercial concreto: llenar los turnos vacíos de la
 * mañana. Por eso es la página con el camino más corto entre llegar y
 * reservar — la acción está arriba del pliegue y se repite al final,
 * sin nada que la interrumpa en medio.
 *
 * Es la única página del sitio donde se publica un precio.
 */

export const revalidate = 300;

export function generateMetadata(): Metadata {
  return construirMetadatos({
    ruta: RUTAS.evaluacionMatutina,
    tituloRespaldo: "Evaluación matutina",
    descripcionRespaldo:
      "Evaluación odontológica en horario de mañana con un especialista de la clínica.",
    etiquetaOg: "Evaluación matutina",
  });
}

export default async function PaginaEvaluacionMatutina() {
  const pagina = await consultar<PaginaEvaluacion | null>(
    PAGINA_EVALUACION,
    null,
    {},
    { etiquetas: ["paginaEvaluacion"] },
  );

  const enlace = pagina?.enlaceReserva ?? undefined;

  return (
    <>
      <StructuredData
        datos={esquemaMigas([
          { nombre: "Inicio", ruta: RUTAS.inicio },
          { nombre: "Evaluación matutina", ruta: RUTAS.evaluacionMatutina },
        ])}
      />

      {/* ── Encabezado ────────────────────────────────────────────────── */}
      <section className="border-b border-linea bg-fondo-alt py-seccion lg:py-seccion-lg">
        <Contenedor ancho="estrecho">
          <h1 className="font-display text-3xl font-semibold leading-tight sm:text-4xl lg:text-5xl">
            {pagina?.titulo ?? "Evaluación matutina"}
          </h1>

          <div className="mt-6 flex flex-wrap items-center gap-x-8 gap-y-3">
            {pagina?.precio ? (
              <p className="font-display text-4xl font-semibold text-marca-700">
                {pagina.precio}
              </p>
            ) : null}

            {pagina?.horarioDisponible ? (
              <p className="inline-flex items-center gap-2 rounded-pastilla bg-fondo px-4 py-2 font-cuerpo text-sm text-marca-700">
                <IconoReloj className="text-base" />
                {pagina.horarioDisponible}
              </p>
            ) : null}
          </div>

          <div className="mt-8">
            <BookingCTA
              variant="reservar"
              origen="evaluacion_matutina_hero"
              href={enlace}
              etiqueta="Reservar mi evaluación"
              tamano="lg"
            />
          </div>

          {pagina?.vigenciaPromocion ? (
            <p className="mt-4 font-cuerpo text-xs text-suave">
              Vigencia: {pagina.vigenciaPromocion}
            </p>
          ) : null}
        </Contenedor>
      </section>

      {!pagina ? (
        <Seccion>
          <Contenedor ancho="estrecho">
            <EstadoVacio
              titulo="Esta página está en preparación"
              detalle="El precio, el horario y el detalle de la evaluación se cargan desde el gestor de contenido."
            />
          </Contenedor>
        </Seccion>
      ) : null}

      {/* ── Qué incluye ───────────────────────────────────────────────── */}
      {pagina?.queIncluye && pagina.queIncluye.length > 0 ? (
        <Seccion aria="Qué incluye">
          <Contenedor ancho="estrecho">
            <TituloSeccion nivel={2}>Qué incluye</TituloSeccion>
            <IncludesList elementos={pagina.queIncluye} />
          </Contenedor>
        </Seccion>
      ) : null}

      {/* ── Proceso ───────────────────────────────────────────────────── */}
      {pagina?.comoEsElProceso && pagina.comoEsElProceso.length > 0 ? (
        <Seccion fondo="alt" aria="Cómo es el proceso">
          <Contenedor ancho="estrecho">
            <TituloSeccion nivel={2}>Cómo es el proceso</TituloSeccion>
            <ProcessSteps pasos={pagina.comoEsElProceso} />
          </Contenedor>
        </Seccion>
      ) : null}

      {/* ── Después ───────────────────────────────────────────────────── */}
      {pagina?.queEsperarDespues ? (
        <Seccion aria="Qué pasa después">
          <Contenedor ancho="estrecho">
            <TituloSeccion nivel={2}>Qué pasa después</TituloSeccion>
            <p className="whitespace-pre-line font-cuerpo text-base leading-relaxed text-tinta">
              {pagina.queEsperarDespues}
            </p>
          </Contenedor>
        </Seccion>
      ) : null}

      {/* ── Quién la atiende ──────────────────────────────────────────── */}
      {pagina?.quienLaAtiende ? (
        <Seccion fondo="alt" aria="Quién la atiende">
          <Contenedor ancho="estrecho">
            <TituloSeccion nivel={2}>Quién la atiende</TituloSeccion>
            <div className="rounded-card border border-linea bg-fondo p-6">
              <TeamMember miembro={pagina.quienLaAtiende} compacto />
            </div>
          </Contenedor>
        </Seccion>
      ) : null}

      {/* ── Cierre ────────────────────────────────────────────────────── */}
      <Seccion aria="Reservar">
        <Contenedor ancho="estrecho" className="text-center">
          <h2 className="font-display text-2xl font-semibold sm:text-3xl">
            Reserva tu evaluación
          </h2>

          {pagina?.horarioDisponible ? (
            <p className="mt-3 font-cuerpo text-base text-suave">
              {pagina.horarioDisponible}
            </p>
          ) : null}

          <div className="mt-6 flex justify-center">
            <BookingCTA
              variant="reservar"
              origen="evaluacion_matutina_cierre"
              href={enlace}
              etiqueta="Reservar mi evaluación"
              tamano="lg"
            />
          </div>
        </Contenedor>
      </Seccion>
    </>
  );
}
