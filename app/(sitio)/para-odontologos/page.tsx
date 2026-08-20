import type { Metadata } from "next";

import { IncludesList } from "@/components/IncludesList";
import { ProcessSteps } from "@/components/ProcessSteps";
import { ReferralForm } from "@/components/ReferralForm";
import { Contenedor, EstadoVacio, Seccion, TituloSeccion } from "@/components/Seccion";
import { esquemaMigas, StructuredData } from "@/components/StructuredData";
import { construirMetadatos } from "@/lib/metadatos";
import { RUTAS } from "@/lib/rutas";
import { consultar } from "@/sanity/client";
import { ESPECIALIDADES_INDICE, PAGINA_DERIVACION } from "@/sanity/queries";
import type { EspecialidadResumen, PaginaDerivacion } from "@/types/contenido";

/**
 * Página de derivación profesional.
 *
 * Está dirigida a otros odontólogos, no a pacientes: en una clínica de
 * especialistas el canal de captación real son los colegas que derivan.
 *
 * Las mentorías solo aparecen si `ofreceMentorias` está activado en Sanity;
 * es un modelo distinto al de derivación y la directora tiene que poder
 * encenderlo o apagarlo sin desplegar.
 */

export const revalidate = 300;

export function generateMetadata(): Metadata {
  return construirMetadatos({
    ruta: RUTAS.paraOdontologos,
    tituloRespaldo: "Para odontólogos",
    descripcionRespaldo:
      "Deriva un paciente y coordina el caso con el especialista que lo va a atender.",
    etiquetaOg: "Para odontólogos",
  });
}

export default async function PaginaDerivacionProfesional() {
  const [pagina, especialidades] = await Promise.all([
    consultar<PaginaDerivacion | null>(PAGINA_DERIVACION, null, {}, {
      etiquetas: ["paginaDerivacion"],
    }),
    consultar<EspecialidadResumen[]>(ESPECIALIDADES_INDICE, [], {}, {
      etiquetas: ["especialidad"],
    }),
  ]);

  const bloques: Array<{ titulo: string; contenido?: string }> = [
    { titulo: "Cómo coordinamos el caso", contenido: pagina?.comoCoordinamos },
    { titulo: "Cómo te mantenemos informado", contenido: pagina?.comoInformamosAlColega },
    { titulo: "Qué sucede después del tratamiento", contenido: pagina?.queSucedeDespues },
  ].filter((b) => b.contenido);

  return (
    <>
      <StructuredData
        datos={esquemaMigas([
          { nombre: "Inicio", ruta: RUTAS.inicio },
          { nombre: "Para odontólogos", ruta: RUTAS.paraOdontologos },
        ])}
      />

      <section className="border-b border-linea bg-fondo-alt py-seccion">
        <Contenedor ancho="estrecho">
          <h1 className="font-display text-3xl font-semibold leading-tight sm:text-4xl">
            {pagina?.titulo ?? "Para odontólogos"}
          </h1>

          {pagina?.intro ? (
            <p className="mt-5 whitespace-pre-line font-cuerpo text-lg text-suave">
              {pagina.intro}
            </p>
          ) : null}
        </Contenedor>
      </section>

      {!pagina ? (
        <Seccion>
          <Contenedor ancho="estrecho">
            <EstadoVacio
              titulo="Esta página está en preparación"
              detalle="El contenido para colegas se carga desde el gestor. Mientras tanto, el formulario de derivación ya funciona."
            />
          </Contenedor>
        </Seccion>
      ) : null}

      {/* ── Qué casos reciben ────────────────────────────────────────── */}
      {pagina?.tiposDeCasoQueRecibimos && pagina.tiposDeCasoQueRecibimos.length > 0 ? (
        <Seccion aria="Casos que recibimos">
          <Contenedor ancho="estrecho">
            <TituloSeccion nivel={2}>Casos que recibimos</TituloSeccion>
            <IncludesList elementos={pagina.tiposDeCasoQueRecibimos} columnas={2} />
          </Contenedor>
        </Seccion>
      ) : null}

      {/* ── Cómo derivar ─────────────────────────────────────────────── */}
      {pagina?.comoDerivar && pagina.comoDerivar.length > 0 ? (
        <Seccion fondo="alt" aria="Cómo derivar">
          <Contenedor ancho="estrecho">
            <TituloSeccion nivel={2}>Cómo derivar</TituloSeccion>
            <ProcessSteps pasos={pagina.comoDerivar} />
          </Contenedor>
        </Seccion>
      ) : null}

      {/* ── Bloques de texto ─────────────────────────────────────────── */}
      {bloques.length > 0 ? (
        <Seccion aria="Cómo trabajamos">
          <Contenedor ancho="estrecho">
            <div className="space-y-10">
              {bloques.map((bloque) => (
                <div key={bloque.titulo}>
                  <h2 className="font-display text-xl font-semibold">{bloque.titulo}</h2>
                  <p className="mt-3 whitespace-pre-line font-cuerpo text-base leading-relaxed text-tinta">
                    {bloque.contenido}
                  </p>
                </div>
              ))}
            </div>
          </Contenedor>
        </Seccion>
      ) : null}

      {/* ── Mentorías ────────────────────────────────────────────────── */}
      {pagina?.ofreceMentorias && pagina.descripcionMentorias ? (
        <Seccion fondo="alt" aria="Mentorías">
          <Contenedor ancho="estrecho">
            <div className="rounded-card border-l-4 border-acento bg-fondo p-6 sm:p-8">
              <h2 className="font-display text-xl font-semibold">
                ¿Prefieres resolver el caso tú mismo?
              </h2>
              <p className="mt-3 whitespace-pre-line font-cuerpo text-base leading-relaxed text-tinta">
                {pagina.descripcionMentorias}
              </p>
            </div>
          </Contenedor>
        </Seccion>
      ) : null}

      {/* ── Formulario ───────────────────────────────────────────────── */}
      <Seccion id="derivar" aria="Formulario de derivación">
        <Contenedor ancho="estrecho">
          <TituloSeccion
            nivel={2}
            descripcion="Adjunta las radiografías si las tienes a mano. Te confirmamos la recepción por correo."
          >
            Derivar un paciente
          </TituloSeccion>

          <ReferralForm
            especialidades={especialidades}
            permiteMentorias={Boolean(pagina?.ofreceMentorias)}
            correoAlternativo={pagina?.correoParaRadiografias}
            origen="pagina_derivacion"
          />
        </Contenedor>
      </Seccion>
    </>
  );
}
