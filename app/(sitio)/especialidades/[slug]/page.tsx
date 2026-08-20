import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { BookingCTA } from "@/components/BookingCTA";
import { FaqAccordion } from "@/components/FaqAccordion";
import { IconoReloj } from "@/components/Iconos";
import { ImagenSanity } from "@/components/ImagenSanity";
import { IncludesList } from "@/components/IncludesList";
import { ProcessSteps } from "@/components/ProcessSteps";
import { Contenedor, Seccion, TituloSeccion } from "@/components/Seccion";
import {
  esquemaEspecialidad,
  esquemaFaq,
  esquemaMigas,
  StructuredData,
} from "@/components/StructuredData";
import { TeamMember } from "@/components/TeamMember";
import { normalizarOrigen } from "@/lib/analitica";
import { construirMetadatos } from "@/lib/metadatos";
import { RUTAS, rutaEspecialidad } from "@/lib/rutas";
import { urlAbsoluta } from "@/lib/sitio";
import { consultar } from "@/sanity/client";
import { ESPECIALIDAD_POR_SLUG, SLUGS_ESPECIALIDAD } from "@/sanity/queries";
import type { Especialidad } from "@/types/contenido";

/**
 * Página de una especialidad.
 *
 * El orden de las secciones responde a las preguntas del paciente en el
 * orden en que se las hace: para quién es, qué incluye, cómo es el proceso,
 * qué pasa después, quién lo atiende, con qué tecnología, y las dudas
 * sueltas al final.
 *
 * El botón de acción usa la variante que la doctora eligió en Sanity: en
 * Ortodoncia "consultar sobre mi caso", en Rehabilitación "solicitar
 * evaluación".
 */

export const revalidate = 60;
export const dynamicParams = true;

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const slugs = await consultar<string[]>(SLUGS_ESPECIALIDAD, []);
  return slugs.filter(Boolean).map((slug) => ({ slug }));
}

async function obtener(slug: string) {
  return consultar<Especialidad | null>(
    ESPECIALIDAD_POR_SLUG,
    null,
    { slug },
    { etiquetas: ["especialidad", `especialidad:${slug}`] },
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const especialidad = await obtener(slug);

  if (!especialidad) {
    return construirMetadatos({
      ruta: rutaEspecialidad(slug),
      tituloRespaldo: "Especialidad no encontrada",
      noIndexar: true,
    });
  }

  return construirMetadatos({
    ruta: rutaEspecialidad(slug),
    titulo: especialidad.seoTitulo,
    descripcion: especialidad.seoDescripcion,
    tituloRespaldo: especialidad.nombre,
    descripcionRespaldo: especialidad.resumenCorto,
    etiquetaOg: "Especialidad",
  });
}

export default async function PaginaEspecialidad({ params }: Props) {
  const { slug } = await params;
  const especialidad = await obtener(slug);

  if (!especialidad) notFound();

  const url = urlAbsoluta(rutaEspecialidad(slug));
  const origen = normalizarOrigen(`especialidad_${slug}`);
  const variante = especialidad.ctaVariante ?? "reservar";
  const faqSchema = esquemaFaq(especialidad.faqs, url);

  const esquemas = [
    esquemaEspecialidad(especialidad),
    esquemaMigas([
      { nombre: "Inicio", ruta: RUTAS.inicio },
      { nombre: "Especialidades", ruta: RUTAS.especialidades },
      { nombre: especialidad.nombre ?? slug, ruta: rutaEspecialidad(slug) },
    ]),
    ...(faqSchema ? [faqSchema] : []),
  ];

  return (
    <>
      <StructuredData datos={esquemas} />

      {/* ── Encabezado ────────────────────────────────────────────────── */}
      <section className="border-b border-linea bg-fondo-alt py-seccion">
        <Contenedor>
          <nav aria-label="Migas de pan" className="mb-6">
            <ol className="flex flex-wrap items-center gap-2 font-cuerpo text-sm text-suave">
              <li>
                <Link href={RUTAS.inicio} className="hover:text-marca-700">
                  Inicio
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <Link href={RUTAS.especialidades} className="hover:text-marca-700">
                  Especialidades
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li className="text-marca-900">{especialidad.nombre}</li>
            </ol>
          </nav>

          <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
            <div>
              <h1 className="font-display text-3xl font-semibold leading-tight sm:text-4xl lg:text-5xl">
                {especialidad.nombre}
              </h1>

              {especialidad.resumenCorto ? (
                <p className="mt-5 font-cuerpo text-lg text-suave">
                  {especialidad.resumenCorto}
                </p>
              ) : null}

              {especialidad.duracionPrimeraCita ? (
                <p className="mt-5 inline-flex items-center gap-2 rounded-pastilla bg-fondo px-4 py-2 font-cuerpo text-sm text-marca-700">
                  <IconoReloj className="text-base" />
                  Primera cita: {especialidad.duracionPrimeraCita}
                </p>
              ) : null}

              <div className="mt-8">
                <BookingCTA variant={variante} origen={origen} tamano="lg" />
              </div>
            </div>

            <div className="relative overflow-hidden rounded-card">
              <ImagenSanity
                imagen={especialidad.imagenPrincipal}
                alt={especialidad.nombre ?? ""}
                ancho={900}
                prioridad
                sizes="(max-width: 1024px) 100vw, 500px"
              />
            </div>
          </div>
        </Contenedor>
      </section>

      {/* ── Para quién ────────────────────────────────────────────────── */}
      {especialidad.paraQuien ? (
        <Seccion aria="Para quién es">
          <Contenedor ancho="estrecho">
            <TituloSeccion nivel={2}>¿A quién le sirve?</TituloSeccion>
            <p className="whitespace-pre-line font-cuerpo text-base leading-relaxed text-tinta">
              {especialidad.paraQuien}
            </p>
          </Contenedor>
        </Seccion>
      ) : null}

      {/* ── Qué incluye ───────────────────────────────────────────────── */}
      {especialidad.queIncluye && especialidad.queIncluye.length > 0 ? (
        <Seccion fondo="alt" aria="Qué incluye">
          <Contenedor ancho="estrecho">
            <TituloSeccion nivel={2}>Qué incluye</TituloSeccion>
            <IncludesList elementos={especialidad.queIncluye} columnas={2} />
          </Contenedor>
        </Seccion>
      ) : null}

      {/* ── Proceso ───────────────────────────────────────────────────── */}
      {especialidad.comoEsElProceso && especialidad.comoEsElProceso.length > 0 ? (
        <Seccion aria="Cómo es el proceso">
          <Contenedor ancho="estrecho">
            <TituloSeccion nivel={2}>Cómo es el proceso</TituloSeccion>
            <ProcessSteps pasos={especialidad.comoEsElProceso} />
          </Contenedor>
        </Seccion>
      ) : null}

      {/* ── Después ───────────────────────────────────────────────────── */}
      {especialidad.queEsperarDespues ? (
        <Seccion fondo="alt" aria="Qué esperar después">
          <Contenedor ancho="estrecho">
            <TituloSeccion nivel={2}>Qué esperar después</TituloSeccion>
            <p className="whitespace-pre-line font-cuerpo text-base leading-relaxed text-tinta">
              {especialidad.queEsperarDespues}
            </p>
          </Contenedor>
        </Seccion>
      ) : null}

      {/* ── Especialistas ─────────────────────────────────────────────── */}
      {especialidad.especialistas && especialidad.especialistas.length > 0 ? (
        <Seccion aria="Quién la atiende">
          <Contenedor>
            <TituloSeccion nivel={2}>Quién la atiende</TituloSeccion>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {especialidad.especialistas.map((miembro) => (
                <TeamMember key={miembro._id} miembro={miembro} />
              ))}
            </div>
          </Contenedor>
        </Seccion>
      ) : null}

      {/* ── Tecnología ────────────────────────────────────────────────── */}
      {especialidad.tecnologiaRelacionada &&
      especialidad.tecnologiaRelacionada.length > 0 ? (
        <Seccion fondo="alt" aria="Tecnología">
          <Contenedor>
            <TituloSeccion nivel={2}>Tecnología que se usa</TituloSeccion>
            <div className="grid gap-6 sm:grid-cols-2">
              {especialidad.tecnologiaRelacionada.map((tec) => (
                <article
                  key={tec._id}
                  className="rounded-card border border-linea bg-fondo p-6"
                >
                  <h3 className="font-display text-lg font-semibold text-marca-900">
                    {tec.nombre}
                  </h3>
                  {tec.queSignificaParaElPaciente ? (
                    <p className="mt-2 font-cuerpo text-sm leading-relaxed text-suave">
                      {tec.queSignificaParaElPaciente}
                    </p>
                  ) : null}
                </article>
              ))}
            </div>
          </Contenedor>
        </Seccion>
      ) : null}

      {/* ── Preguntas frecuentes ──────────────────────────────────────── */}
      {especialidad.faqs && especialidad.faqs.length > 0 ? (
        <Seccion aria="Preguntas frecuentes">
          <Contenedor ancho="estrecho">
            <TituloSeccion nivel={2}>Preguntas frecuentes</TituloSeccion>
            <FaqAccordion faqs={especialidad.faqs} />
          </Contenedor>
        </Seccion>
      ) : null}

      {/* ── Cierre ────────────────────────────────────────────────────── */}
      <Seccion fondo="alt" aria="Reservar">
        <Contenedor ancho="estrecho" className="text-center">
          <h2 className="font-display text-2xl font-semibold sm:text-3xl">
            {especialidad.nombre}
          </h2>
          <div className="mt-6 flex justify-center">
            <BookingCTA variant={variante} origen={`${origen}_cierre`} tamano="lg" />
          </div>
        </Contenedor>
      </Seccion>
    </>
  );
}
