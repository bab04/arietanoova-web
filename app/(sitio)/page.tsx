import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { BookingCTA } from "@/components/BookingCTA";
import {
  IconoCertificado,
  IconoCheck,
  IconoEscudo,
  IconoEscaner3D,
  IconoEstrella,
  IconoFlecha,
  IconoReloj,
  IconoSparkles,
  IconoUbicacion,
  IconoWhatsApp,
} from "@/components/Iconos";
import { IndicadorScroll } from "@/components/IndicadorScroll";
import { ProblemCard } from "@/components/ProblemCard";
import { Revelar, RevelarEnCascada } from "@/components/Revelar";
import { Contenedor, Seccion, TituloSeccion } from "@/components/Seccion";
import { SpecialtyCard } from "@/components/SpecialtyCard";
import { StatsCounter, type Estadistica } from "@/components/StatsCounter";
import {
  esquemaClinica,
  esquemaSitio,
  StructuredData,
} from "@/components/StructuredData";
import { TeamMember } from "@/components/TeamMember";
import {
  AJUSTES_RESPALDO_COMPLETOS,
  EQUIPO_RESPALDO,
  ESPECIALIDADES_RESUMEN_RESPALDO,
  EVALUACION_RESPALDO,
  PROBLEMAS_RESPALDO,
  TECNOLOGIAS_RESPALDO,
} from "@/lib/datos-respaldo";
import { construirMetadatos } from "@/lib/metadatos";
import { retraso } from "@/lib/movimiento";
import { RUTAS } from "@/lib/rutas";
import { AJUSTES_RESPALDO, direccionCompleta, enlaceWhatsApp } from "@/lib/sitio";
import { consultar } from "@/sanity/client";
import { AJUSTES_SITIO, PORTADA } from "@/sanity/queries";
import type {
  AjustesSitio,
  EspecialidadResumen,
  MiembroEquipo,
  PaginaEvaluacion,
  Tecnologia,
} from "@/types/contenido";

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
  especialidades: ESPECIALIDADES_RESUMEN_RESPALDO,
  equipo: EQUIPO_RESPALDO,
  tecnologias: TECNOLOGIAS_RESPALDO,
  evaluacion: {
    titulo: EVALUACION_RESPALDO.titulo,
    precio: EVALUACION_RESPALDO.precio,
    horarioDisponible: EVALUACION_RESPALDO.horarioDisponible,
    enlaceReserva: EVALUACION_RESPALDO.enlaceReserva,
  },
};

export const revalidate = 60;

export function generateMetadata(): Metadata {
  return construirMetadatos({
    ruta: RUTAS.inicio,
    tituloRespaldo: "Arieta Noova · Clínica Dental de Alta Especialidad en Pueblo Libre",
    descripcionRespaldo:
      "Clínica dental de especialistas en Pueblo Libre, Lima. Ortodoncia, endodoncia, rehabilitación oral, cirugía, odontopediatría y periodoncia con escáner 3D y 25 años de trayectoria.",
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

  const ajustesResueltos = {
    ...AJUSTES_RESPALDO_COMPLETOS,
    ...(ajustes ?? {}),
  };

  const especialidades =
    datos.especialidades && datos.especialidades.length > 0
      ? datos.especialidades
      : ESPECIALIDADES_RESUMEN_RESPALDO;

  const equipo =
    datos.equipo && datos.equipo.length > 0 ? datos.equipo : EQUIPO_RESPALDO;

  const tecnologias =
    datos.tecnologias && datos.tecnologias.length > 0
      ? datos.tecnologias
      : TECNOLOGIAS_RESPALDO;

  const evaluacion = datos.evaluacion ?? EVALUACION_RESPALDO;
  const directora = equipo.find((m) => m.esDirectora) ?? equipo[0];

  const cifras: Estadistica[] = [
    {
      valor: directora?.aniosEjercicio ?? 25,
      etiqueta: "Años de trayectoria de la Directora",
    },
    {
      valor: especialidades.length || 6,
      etiqueta: "Especialidades clínicas dedicadas",
    },
    {
      valor: equipo.length || 6,
      etiqueta: "Profesionales y especialistas",
    },
    {
      valor: tecnologias.length || 3,
      etiqueta: "Equipos de flujo digital 3D",
    },
  ];

  return (
    <>
      <StructuredData
        datos={[esquemaClinica(ajustesResueltos), esquemaSitio(ajustesResueltos)]}
      />

      {/* ── 1. HERO SECTION EDITORIAL Y DE ALTA GAMA ────────────────── */}
      <section className="relative overflow-hidden border-b border-linea bg-fondo-alt pt-12 pb-16 lg:pt-20 lg:pb-24">
        {/* Adorno sutil de fondo */}
        <div className="pointer-events-none absolute -top-24 -right-24 h-96 w-96 rounded-pastilla bg-marca-500/5 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-24 h-96 w-96 rounded-pastilla bg-oliva/10 blur-3xl" />

        <Contenedor>
          <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-8">
            {/* Columna de Texto y Propuesta */}
            <div className="lg:col-span-7">
              {/* Badge superior de confianza */}
              <div className="entrada inline-flex items-center gap-2 rounded-pastilla border border-marca-700/20 bg-fondo px-4 py-1.5 shadow-sm">
                <IconoEscudo className="text-marca-700" />
                <span className="font-cuerpo text-xs font-semibold uppercase tracking-widest text-marca-700">
                  Clínica Dental de Alta Especialidad · Pueblo Libre
                </span>
              </div>

              {/* Titular Principal */}
              <h1
                className="entrada mt-5 font-display text-4xl font-semibold tracking-tight text-marca-900 sm:text-5xl lg:text-6xl leading-[1.12]"
                style={retraso(120)}
              >
                La odontología de alta especialidad que mereces,{" "}
                <span className="text-marca-500 italic">en un solo lugar.</span>
              </h1>

              {/* Subtítulo enfocado en los 25 años y en el modelo de especialistas */}
              <p
                className="entrada mt-6 font-cuerpo text-lg leading-relaxed text-suave max-w-2xl"
                style={retraso(220)}
              >
                Dirigida por la <strong className="font-semibold text-marca-900">Dra. Jessica Arieta</strong> (25 años de experiencia y cátedra universitaria en San Marcos), reunimos a 6 especialistas dedicados y escáner intraoral 3D para un diagnóstico certero sin moldes molestos.
              </p>

              {/* Puntos destacados de confianza */}
              <div className="entrada mt-6 flex flex-wrap gap-y-2 gap-x-6 text-sm font-medium text-suave" style={retraso(300)}>
                <div className="flex items-center gap-2">
                  <IconoCheck className="text-marca-700" />
                  <span>Atención por especialista dedicado</span>
                </div>
                <div className="flex items-center gap-2">
                  <IconoCheck className="text-marca-700" />
                  <span>Flujo digital 3D sin pastas</span>
                </div>
                <div className="flex items-center gap-2">
                  <IconoCheck className="text-marca-700" />
                  <span>Presupuesto claro y sin sorpresas</span>
                </div>
              </div>

              {/* CTAs Principales */}
              <div
                className="entrada mt-8 flex flex-wrap items-center gap-4"
                style={retraso(380)}
              >
                <BookingCTA
                  variant="evaluacion"
                  origen="portada_hero_principal"
                  tamano="lg"
                />
                <BookingCTA
                  variant="reservar"
                  origen="portada_hero_secundario"
                  tamano="lg"
                  estilo="contorno"
                />
              </div>

              {/* Micro-prueba social */}
              <div
                className="entrada mt-8 flex items-center gap-4 pt-6 border-t border-linea/60"
                style={retraso(450)}
              >
                <div className="flex text-oro text-sm">
                  {[...Array(5)].map((_, i) => (
                    <IconoEstrella key={i} />
                  ))}
                </div>
                <p className="font-cuerpo text-xs text-suave">
                  <strong className="font-semibold text-marca-900">Evaluación de entrada a S/ 60</strong> · Citas disponibles de mañana y tarde.
                </p>
              </div>
            </div>

            {/* Columna Visual de la Clínica */}
            <div className="lg:col-span-5" style={retraso(250)}>
              <div className="relative mx-auto max-w-md lg:max-w-none">
                {/* Marco de Fotografía Principal de la Directora Médica */}
                <div className="relative aspect-[4/5] w-full overflow-hidden rounded-card border border-linea/80 bg-fondo shadow-flotante">
                  <Image
                    src="/imagenes/dra-jessica-arieta.png"
                    alt="Dra. Jessica Arieta, Directora Médica de Arieta Noova en Pueblo Libre"
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 480px"
                    className="object-cover object-top transition-transform duration-700 ease-suave hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-marca-900/70 via-transparent to-transparent" />

                  {/* Tarjeta flotante inferior sobre la imagen */}
                  <div className="absolute bottom-4 left-4 right-4 rounded-card border border-blanco/20 bg-fondo/95 p-4 backdrop-blur-md shadow-sm">
                    <p className="font-display text-base font-semibold text-marca-900">
                      Dra. Jessica Arieta
                    </p>
                    <p className="mt-0.5 font-cuerpo text-xs text-suave">
                      Directora Médica · Especialista en Ortodoncia y Ortopedia Maxilar · 25 años de trayectoria
                    </p>
                  </div>
                </div>

                {/* Badge flotante de 25 Años */}
                <div className="absolute -top-4 -left-4 rounded-card border border-linea bg-fondo p-3.5 shadow-flotante">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-pastilla bg-marca-900 text-blanco">
                      <IconoCertificado className="text-xl text-oro" />
                    </div>
                    <div>
                      <p className="font-display text-sm font-semibold text-marca-900">
                        25 Años de Trayectoria
                      </p>
                      <p className="font-cuerpo text-xs text-suave">
                        Liderazgo médico y docencia
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div
            className="entrada mt-14 flex justify-center"
            style={retraso(560)}
          >
            <IndicadorScroll destino="#cifras" />
          </div>
        </Contenedor>
      </section>

      {/* ── 2. BARRA DE CIFRAS Y AUTORIDAD ──────────────────────────── */}
      <section id="cifras" className="border-b border-linea bg-fondo py-10">
        <Contenedor>
          <Revelar>
            <StatsCounter estadisticas={cifras} />
          </Revelar>
        </Contenedor>
      </section>

      {/* ── 3. BUSCADOR DE SÍNTOMAS / ¿QUÉ MOLESTIA TIENES? ────────── */}
      <Seccion fondo="alt" id="problemas" aria="Orientación según síntoma">
        <Contenedor>
          <div className="mx-auto max-w-2xl text-center">
            <span className="font-cuerpo text-xs font-semibold uppercase tracking-widest text-marca-500">
              Orientación para el paciente
            </span>
            <h2 className="mt-2 font-display text-3xl font-semibold text-marca-900 sm:text-4xl">
              ¿Qué molestia o síntoma deseas resolver?
            </h2>
            <p className="mt-3 font-cuerpo text-base text-suave">
              Hablamos en tu idioma: identifica lo que sientes y te guiamos directamente hacia el tratamiento adecuado.
            </p>
          </div>

          <RevelarEnCascada className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {PROBLEMAS_RESPALDO.map((problema) => (
              <ProblemCard key={problema._id} problema={problema} />
            ))}
          </RevelarEnCascada>
        </Contenedor>
      </Seccion>

      {/* ── 4. GRILLA DE ESPECIALIDADES CLÍNICAS ────────────────────── */}
      <Seccion id="especialidades" aria="Especialidades">
        <Contenedor>
          <TituloSeccion descripcion="En Arieta Noova cada especialidad la atiende un profesional exclusivo de esa disciplina, asegurando el más alto rigor clínico.">
            Nuestras 6 Especialidades Médicas
          </TituloSeccion>

          <RevelarEnCascada className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {especialidades.map((especialidad) => (
              <SpecialtyCard key={especialidad._id} especialidad={especialidad} />
            ))}
          </RevelarEnCascada>

          <Revelar etiqueta="div" className="mt-10 text-center">
            <Link
              href={RUTAS.especialidades}
              className="inline-flex items-center gap-2 rounded-boton border border-marca-900 px-6 py-3 font-cuerpo text-sm font-semibold text-marca-900 transition-colors duration-200 hover:bg-marca-900 hover:text-blanco"
            >
              Explorar el detalle de todas las especialidades
              <IconoFlecha className="text-base" />
            </Link>
          </Revelar>
        </Contenedor>
      </Seccion>

      {/* ── 5. EVALUACIÓN DE ENTRADA (S/ 60) - PUERTA DE ENTRADA ────── */}
      <section className="border-y border-linea bg-fondo-alt py-16 lg:py-20">
        <Contenedor>
          <Revelar direccion="escala">
            <div className="overflow-hidden rounded-card border border-linea bg-fondo p-8 sm:p-12 shadow-card">
              <div className="grid items-center gap-8 lg:grid-cols-12">
                <div className="lg:col-span-7">
                  <div className="inline-flex items-center gap-2 rounded-pastilla border border-acento/30 bg-acento/10 px-3 py-1 text-acento">
                    <IconoSparkles className="text-xs" />
                    <span className="font-cuerpo text-xs font-semibold uppercase tracking-wider">
                      Puerta de entrada a la clínica
                    </span>
                  </div>

                  <h2 className="mt-4 font-display text-3xl font-semibold text-marca-900 sm:text-4xl">
                    {evaluacion.titulo ?? "Evaluación Diagnóstica Completa"}
                  </h2>

                  <p className="mt-3 font-cuerpo text-base text-suave">
                    Tu primera visita no es una simple revisión rápida: es un diagnóstico integral donde un especialista examina tu boca, toma registros digitales y te entrega un plan claro sin compromiso.
                  </p>

                  <div className="mt-6 space-y-3">
                    {EVALUACION_RESPALDO.queIncluye?.map((item, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-pastilla bg-marca-900 text-blanco">
                          <IconoCheck className="text-xs" />
                        </div>
                        <span className="font-cuerpo text-sm text-suave">{item}</span>
                      </div>
                    ))}
                  </div>

                  <p className="mt-6 font-cuerpo text-xs text-suave">
                    Disponible en turnos de mañana y tarde con previa reserva.
                  </p>
                </div>

                <div className="flex flex-col items-center justify-center rounded-card border border-linea bg-fondo-alt/60 p-8 text-center lg:col-span-5">
                  <span className="font-cuerpo text-xs font-semibold uppercase tracking-widest text-suave">
                    Precio Estandarizado
                  </span>
                  <p className="mt-2 font-display text-5xl font-bold text-marca-900">
                    {evaluacion.precio ?? "S/ 60"}
                  </p>
                  <p className="mt-1 font-cuerpo text-xs text-suave">
                    {evaluacion.horarioDisponible ?? "Turnos mañana y tarde"}
                  </p>

                  <div className="mt-6 w-full">
                    <BookingCTA
                      variant="evaluacion"
                      origen="portada_destacado_evaluacion"
                      href={evaluacion.enlaceReserva ?? undefined}
                      tamano="lg"
                      className="w-full justify-center"
                    />
                  </div>

                  <p className="mt-4 font-cuerpo text-xs text-suave">
                    Atención puntual con reserva previa
                  </p>
                </div>
              </div>
            </div>
          </Revelar>
        </Contenedor>
      </section>

      {/* ── 6. LOS TRES PILARES DE AUTORIDAD ───────────────────────── */}
      <Seccion aria="Pilares de confianza">
        <Contenedor>
          <TituloSeccion descripcion="¿Por qué pacientes y colegas eligen Arieta Noova para tratamientos de alta complejidad?">
            Tres Razones de Confianza
          </TituloSeccion>

          <RevelarEnCascada className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {/* Pilar 1 */}
            <div className="rounded-card border border-linea bg-fondo p-7 transition-all duration-300 hover:shadow-card hover:-translate-y-1">
              <div className="flex h-12 w-12 items-center justify-center rounded-boton bg-marca-900 text-blanco">
                <IconoCertificado className="text-2xl text-oro" />
              </div>
              <h3 className="mt-5 font-display text-xl font-semibold text-marca-900">
                25 Años y Cátedra Universitaria
              </h3>
              <p className="mt-3 font-cuerpo text-sm leading-relaxed text-suave">
                La dirección médica está a cargo de la Dra. Jessica Arieta, con más de una década de docencia en la Universidad Nacional Mayor de San Marcos (UNMSM). Criterio académico estricto aplicado a cada caso.
              </p>
            </div>

            {/* Pilar 2 */}
            <div className="rounded-card border border-linea bg-fondo p-7 transition-all duration-300 hover:shadow-card hover:-translate-y-1">
              <div className="flex h-12 w-12 items-center justify-center rounded-boton bg-marca-900 text-blanco">
                <IconoEscudo className="text-2xl" />
              </div>
              <h3 className="mt-5 font-display text-xl font-semibold text-marca-900">
                Especialistas Dedicados
              </h3>
              <p className="mt-3 font-cuerpo text-sm leading-relaxed text-suave">
                No somos un consultorio general donde una sola persona hace todo. Cada disciplina —ortodoncia, endodoncia, periodoncia, cirugía— es atendida por el profesional formado específicamente para ello.
              </p>
            </div>

            {/* Pilar 3 */}
            <div className="rounded-card border border-linea bg-fondo p-7 transition-all duration-300 hover:shadow-card hover:-translate-y-1">
              <div className="flex h-12 w-12 items-center justify-center rounded-boton bg-marca-900 text-blanco">
                <IconoEscaner3D className="text-2xl" />
              </div>
              <h3 className="mt-5 font-display text-xl font-semibold text-marca-900">
                Flujo Digital 3D Sin Náuseas
              </h3>
              <p className="mt-3 font-cuerpo text-sm leading-relaxed text-suave">
                Decimos adiós a las cubetas con pastas desagradables. Nuestro escáner intraoral 3D digitaliza tu dentadura en minutos con precisión microscópica para brackets, coronas y carillas.
              </p>
            </div>
          </RevelarEnCascada>
        </Contenedor>
      </Seccion>

      {/* ── 7. TECNOLOGÍA EN ACCIÓN ─────────────────────────────────── */}
      <Seccion fondo="alt" id="tecnologia" aria="Tecnología odontológica">
        <Contenedor>
          <div className="grid items-center gap-12 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <span className="font-cuerpo text-xs font-semibold uppercase tracking-widest text-marca-500">
                Flujo Digital Avanzado
              </span>
              <h2 className="mt-2 font-display text-3xl font-semibold text-marca-900 sm:text-4xl">
                Tecnología que cuida tu confort y precisión
              </h2>
              <p className="mt-4 font-cuerpo text-base leading-relaxed text-suave">
                Invertimos en equipamiento de diagnóstico digital para que tu tratamiento sea más rápido, completamente predecible y mucho más cómodo.
              </p>

              <div className="mt-8 space-y-4">
                {tecnologias.map((tec) => (
                  <div
                    key={tec._id}
                    className="rounded-card border border-linea bg-fondo p-5 shadow-sm"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-pastilla bg-fondo-alt text-marca-900">
                        <IconoEscaner3D className="text-lg" />
                      </div>
                      <h3 className="font-display text-base font-semibold text-marca-900">
                        {tec.nombre}
                      </h3>
                    </div>
                    {tec.queSignificaParaElPaciente ? (
                      <p className="mt-2.5 font-cuerpo text-xs leading-relaxed text-suave">
                        <strong className="font-semibold text-marca-700">Para ti: </strong>
                        {tec.queSignificaParaElPaciente}
                      </p>
                    ) : null}
                  </div>
                ))}
              </div>

              <div className="mt-8">
                <Link
                  href={RUTAS.tecnologia}
                  className="inline-flex items-center gap-2 font-cuerpo text-sm font-semibold text-marca-700 hover:text-marca-900"
                >
                  Conocer más sobre nuestro equipamiento
                  <IconoFlecha className="text-base" />
                </Link>
              </div>
            </div>

            <div className="lg:col-span-7">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="relative aspect-[4/5] overflow-hidden rounded-card border border-linea bg-fondo shadow-card">
                  <Image
                    src="/imagenes/escaner-intraoral-medit-3d.jpg"
                    alt="Escáner intraoral 3D Medit en tiempo real en Clínica Arieta Noova"
                    fill
                    sizes="(max-width: 640px) 100vw, 320px"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-marca-900/80 via-transparent to-transparent" />
                  <p className="absolute bottom-4 left-4 right-4 font-display text-sm font-semibold text-blanco">
                    Escáner Medit 3D · Mapeo digital en alta resolución sin náuseas
                  </p>
                </div>

                <div className="relative aspect-[4/5] overflow-hidden rounded-card border border-linea bg-fondo shadow-card sm:translate-y-6">
                  <Image
                    src="/imagenes/escaner-intraoral-en-accion.jpg"
                    alt="Procedimiento de escaneo intraoral digital a paciente en sillón"
                    fill
                    sizes="(max-width: 640px) 100vw, 320px"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-marca-900/80 via-transparent to-transparent" />
                  <p className="absolute bottom-4 left-4 right-4 font-display text-sm font-semibold text-blanco">
                    Precisión en Sillón · Confort y visualización en tiempo real
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Contenedor>
      </Seccion>

      {/* ── 8. EQUIPO MÉDICO DE ESPECIALISTAS ──────────────────────── */}
      <Seccion id="equipo" aria="Equipo de especialistas">
        <Contenedor>
          <TituloSeccion descripcion="Conoce a los profesionales a cargo de tu salud bucal, con formación acreditada y años de trayectoria médica.">
            Cuerpo Médico
          </TituloSeccion>

          {/* Banner Fotográfico del Equipo Completo en Operatorio */}
          <Revelar className="mb-12 overflow-hidden rounded-card border border-linea bg-fondo-alt shadow-card">
            <div className="relative aspect-[16/9] w-full sm:aspect-[21/9]">
              <Image
                src="/imagenes/equipo-clinico-arieta-noova.jpg"
                alt="Dra. Jessica Arieta y Cuerpo Clínico Multidisciplinario en Arieta Noova"
                fill
                sizes="(max-width: 1200px) 100vw, 1200px"
                className="object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-marca-900/85 via-marca-900/25 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 text-blanco sm:bottom-8 sm:left-8">
                <span className="inline-block rounded-pastilla border border-blanco/30 bg-blanco/10 px-3 py-1 font-cuerpo text-xs font-semibold uppercase tracking-wider backdrop-blur-md">
                  Cuerpo Clínico Sincronizado
                </span>
                <p className="mt-2 font-display text-lg font-semibold sm:text-2xl">
                  Dra. Jessica Arieta y su Equipo en Operatorio Clínico
                </p>
                <p className="mt-1 max-w-2xl font-cuerpo text-xs text-blanco/90 sm:text-sm">
                  Revisión y discusión de casos clínicos en pantalla digital para una atención rigurosa, cercana y de máxima confianza.
                </p>
              </div>
            </div>
          </Revelar>

          <RevelarEnCascada className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {equipo.map((miembro) => (
              <TeamMember key={miembro._id} miembro={miembro} />
            ))}
          </RevelarEnCascada>

          <Revelar etiqueta="div" className="mt-10 text-center">
            <Link
              href={RUTAS.equipo}
              className="inline-flex items-center gap-2 rounded-boton border border-marca-900 px-6 py-3 font-cuerpo text-sm font-semibold text-marca-900 transition-colors duration-200 hover:bg-marca-900 hover:text-blanco"
            >
              Ver perfil y credenciales de todo el equipo
              <IconoFlecha className="text-base" />
            </Link>
          </Revelar>
        </Contenedor>
      </Seccion>

      {/* ── 9. CANAL ÉTICO PARA ODONTÓLOGOS REFERIDORES ─────────────── */}
      <section className="border-t border-linea bg-marca-900 py-16 text-blanco">
        <Contenedor>
          <div className="mx-auto max-w-3xl text-center">
            <div className="inline-flex items-center gap-2 rounded-pastilla border border-blanco/20 bg-blanco/10 px-4 py-1.5 text-blanco">
              <IconoCertificado className="text-oro" />
              <span className="font-cuerpo text-xs font-semibold uppercase tracking-widest">
                Para Colegas Odontólogos
              </span>
            </div>

            <h2 className="mt-4 font-display text-3xl font-semibold sm:text-4xl text-blanco">
              Programa de Derivación Ética entre Colegas
            </h2>

            <p className="mt-4 font-cuerpo text-base leading-relaxed text-crema/90">
              Somos el aliado de confianza de tu consultorio. Recibimos a tus pacientes para procedimientos ortodóncicos, quirúrgicos o endodónticos complejos y te los devolvemos puntualmente con informe clínico para continuar su tratamiento.
            </p>

            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link
                href={RUTAS.paraOdontologos}
                className="inline-flex items-center gap-2 rounded-boton bg-acento px-6 py-3 font-cuerpo text-sm font-semibold text-blanco transition-colors hover:brightness-110"
              >
                Conocer el protocolo de derivación
                <IconoFlecha className="text-base" />
              </Link>
              <a
                href={enlaceWhatsApp(
                  ajustesResueltos.whatsapp,
                  "Hola Dra. Jessica Arieta, soy colega odontólogo y deseo consultar sobre el protocolo de derivación.",
                ) ?? "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-boton border border-blanco/30 px-6 py-3 font-cuerpo text-sm font-semibold text-blanco transition-colors hover:bg-blanco/10"
              >
                <IconoWhatsApp className="text-base text-blanco" />
                Coordinación directa por WhatsApp
              </a>
            </div>
          </div>
        </Contenedor>
      </section>

      {/* ── 10. UBICACIÓN, HORARIOS Y ATENCIÓN ───────────────────────── */}
      <Seccion id="contacto" aria="Ubicación y horarios">
        <Contenedor>
          <div className="grid gap-8 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <span className="font-cuerpo text-xs font-semibold uppercase tracking-widest text-marca-500">
                Visítanos en Pueblo Libre
              </span>
              <h2 className="mt-2 font-display text-3xl font-semibold text-marca-900">
                Ubicación y Horarios de Atención
              </h2>
              <p className="mt-3 font-cuerpo text-sm text-suave">
                Ubicados en una zona accesible y segura de Pueblo Libre, en el límite con Magdalena y Jesús María.
              </p>

              <div className="mt-8 space-y-5">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-boton bg-fondo-alt text-marca-900">
                    <IconoUbicacion className="text-lg" />
                  </div>
                  <div>
                    <h3 className="font-display text-base font-semibold text-marca-900">
                      Dirección
                    </h3>
                    <p className="mt-1 font-cuerpo text-sm text-suave">
                      {direccionCompleta(ajustesResueltos)}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-boton bg-fondo-alt text-marca-900">
                    <IconoReloj className="text-lg" />
                  </div>
                  <div>
                    <h3 className="font-display text-base font-semibold text-marca-900">
                      Horario de Consultorios
                    </h3>
                    <p className="mt-1 font-cuerpo text-sm text-suave">
                      Lunes a Viernes: 9:00 a.m. a 1:00 p.m. y 3:00 p.m. a 8:00 p.m.
                    </p>
                    <p className="font-cuerpo text-sm text-suave">
                      Sábados: 9:00 a.m. a 5:00 p.m. (horario continuo)
                    </p>
                    <p className="font-cuerpo text-xs font-medium text-suave mt-1">
                      Domingos: Cerrado
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                <BookingCTA variant="reservar" origen="portada_contacto" tamano="md" />
                <Link
                  href={RUTAS.contacto}
                  className="inline-flex items-center gap-2 rounded-boton border border-linea bg-fondo px-4 py-2.5 font-cuerpo text-sm font-semibold text-marca-900 hover:bg-fondo-alt"
                >
                  Ver mapa y formulario completo
                  <IconoFlecha className="text-sm" />
                </Link>
              </div>
            </div>

            <div className="lg:col-span-7">
              {/* Tarjeta de Foto e Identidad de la Clínica */}
              <div className="relative aspect-[16/10] w-full overflow-hidden rounded-card border border-linea bg-fondo shadow-card">
                <Image
                  src="/imagenes/04-logo-marmol-interior.jpeg"
                  alt="Instalaciones interiores de Arieta Noova"
                  fill
                  sizes="(max-width: 1024px) 100vw, 600px"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-marca-900/80 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 text-blanco">
                  <p className="font-display text-lg font-semibold text-blanco">
                    Arieta Noova · Centro de Especialidades Odontológicas
                  </p>
                  <p className="mt-1 font-cuerpo text-xs text-crema/90">
                    Av. Brasil 3140, Of. 204 · Pueblo Libre · Atención previa cita
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Contenedor>
      </Seccion>
    </>
  );
}
