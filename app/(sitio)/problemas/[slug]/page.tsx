import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { BookingCTA } from "@/components/BookingCTA";
import { FaqAccordion } from "@/components/FaqAccordion";
import { RevelarEnCascada } from "@/components/Revelar";
import { Contenedor, Seccion, TituloSeccion } from "@/components/Seccion";
import { SpecialtyCard } from "@/components/SpecialtyCard";
import {
  esquemaFaq,
  esquemaMigas,
  esquemaProblema,
  StructuredData,
} from "@/components/StructuredData";
import { TextoPortable } from "@/components/TextoPortable";
import { normalizarOrigen } from "@/lib/analitica";
import { construirMetadatos } from "@/lib/metadatos";
import { RUTAS, rutaProblema } from "@/lib/rutas";
import { urlAbsoluta } from "@/lib/sitio";
import { consultar } from "@/sanity/client";
import { PROBLEMA_POR_SLUG, SLUGS_PROBLEMA } from "@/sanity/queries";
import type { EspecialidadResumen, Problema } from "@/types/contenido";

/** Página de un problema — Fase 2. */

export const revalidate = 60;
export const dynamicParams = true;

import { PROBLEMAS_DETALLADOS_RESPALDO } from "@/lib/datos-respaldo";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const slugs = await consultar<string[]>(
    SLUGS_PROBLEMA,
    PROBLEMAS_DETALLADOS_RESPALDO.map((p) => p.slug ?? ""),
  );
  return slugs.filter(Boolean).map((slug) => ({ slug }));
}

async function obtener(slug: string) {
  const respaldo = PROBLEMAS_DETALLADOS_RESPALDO.find((p) => p.slug === slug) ?? null;
  const dato = await consultar<Problema | null>(
    PROBLEMA_POR_SLUG,
    respaldo,
    { slug },
    { etiquetas: ["problema", `problema:${slug}`] },
  );
  return dato ?? respaldo;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const problema = await obtener(slug);

  if (!problema) {
    return construirMetadatos({
      ruta: rutaProblema(slug),
      tituloRespaldo: "Problema no encontrado",
      noIndexar: true,
    });
  }

  return construirMetadatos({
    ruta: rutaProblema(slug),
    titulo: problema.seoTitulo,
    descripcion: problema.seoDescripcion,
    tituloRespaldo: problema.titulo,
    descripcionRespaldo: problema.resumenCorto,
    etiquetaOg: "Problema frecuente",
  });
}

export default async function PaginaProblema({ params }: Props) {
  const { slug } = await params;
  const problema = await obtener(slug);

  if (!problema) notFound();

  const url = urlAbsoluta(rutaProblema(slug));
  const origen = normalizarOrigen(`problema_${slug}`);
  const faqSchema = esquemaFaq(problema.faqs, url);

  const esquemas = [
    esquemaProblema(problema, url),
    esquemaMigas([
      { nombre: "Inicio", ruta: RUTAS.inicio },
      { nombre: "Problemas", ruta: RUTAS.problemas },
      { nombre: problema.titulo ?? slug, ruta: rutaProblema(slug) },
    ]),
    ...(faqSchema ? [faqSchema] : []),
  ];

  return (
    <>
      <StructuredData datos={esquemas} />

      <section className="border-b border-linea bg-fondo-alt py-seccion">
        <Contenedor ancho="estrecho">
          <nav aria-label="Migas de pan" className="mb-6">
            <ol className="flex flex-wrap items-center gap-2 font-cuerpo text-sm text-suave">
              <li>
                <Link href={RUTAS.inicio} className="hover:text-marca-700">
                  Inicio
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <Link href={RUTAS.problemas} className="hover:text-marca-700">
                  Problemas
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li className="text-marca-900">{problema.titulo}</li>
            </ol>
          </nav>

          <h1 className="font-display text-3xl font-semibold leading-tight sm:text-4xl">
            {problema.titulo}
          </h1>

          {problema.resumenCorto ? (
            <p className="mt-5 font-cuerpo text-lg text-suave">{problema.resumenCorto}</p>
          ) : null}
        </Contenedor>
      </section>

      {problema.descripcion && problema.descripcion.length > 0 ? (
        <Seccion aria="Explicación">
          <Contenedor ancho="estrecho">
            <TextoPortable bloques={problema.descripcion} />
          </Contenedor>
        </Seccion>
      ) : null}

      {problema.especialidadesRelacionadas &&
      problema.especialidadesRelacionadas.length > 0 ? (
        <Seccion fondo="alt" aria="Especialidades relacionadas">
          <Contenedor>
            <TituloSeccion nivel={2}>Qué especialidad lo resuelve</TituloSeccion>
            <RevelarEnCascada className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {problema.especialidadesRelacionadas.map(
                (especialidad: EspecialidadResumen) => (
                  <SpecialtyCard
                    key={especialidad._id}
                    especialidad={especialidad}
                    conImagen={false}
                  />
                ),
              )}
            </RevelarEnCascada>
          </Contenedor>
        </Seccion>
      ) : null}

      {problema.faqs && problema.faqs.length > 0 ? (
        <Seccion aria="Preguntas frecuentes">
          <Contenedor ancho="estrecho">
            <TituloSeccion nivel={2}>Preguntas frecuentes</TituloSeccion>
            <FaqAccordion faqs={problema.faqs} />
          </Contenedor>
        </Seccion>
      ) : null}

      <Seccion fondo="alt" aria="Consultar">
        <Contenedor ancho="estrecho" className="text-center">
          <h2 className="font-display text-2xl font-semibold">
            ¿Te está pasando esto?
          </h2>
          <div className="mt-6 flex justify-center">
            <BookingCTA variant="consultar" origen={origen} tamano="lg" />
          </div>
        </Contenedor>
      </Seccion>
    </>
  );
}
