import type { Metadata } from "next";

import { BookingCTA } from "@/components/BookingCTA";
import { FaqAccordion } from "@/components/FaqAccordion";
import { RevelarEnCascada } from "@/components/Revelar";
import { Contenedor, Seccion, TituloSeccion } from "@/components/Seccion";
import { esquemaFaq, esquemaMigas, StructuredData } from "@/components/StructuredData";
import { construirMetadatos } from "@/lib/metadatos";
import { RUTAS } from "@/lib/rutas";
import { urlAbsoluta } from "@/lib/sitio";
import { consultar } from "@/sanity/client";
import { PAGINA_FORMAS_DE_PAGO } from "@/sanity/queries";
import type { PaginaFormasDePago } from "@/types/contenido";

/**
 * Página de Formas de Pago (/formas-de-pago)
 *
 * Resuelve la primera ansiedad del paciente: saber cómo funciona el pago
 * y las facilidades antes de reservar. Cumple con la decisión de no
 * publicar un tarifario plano sin diagnóstico clínico previo, pero
 * explicando con total transparencia el proceso de entrega de presupuesto,
 * financiamiento, seguros y modalidades aceptadas.
 */

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  const pagina = await consultar<PaginaFormasDePago | null>(
    PAGINA_FORMAS_DE_PAGO,
    null,
    {},
    { etiquetas: ["paginaFormasDePago"] },
  );

  return construirMetadatos({
    ruta: RUTAS.formasDePago,
    titulo: pagina?.seoTitulo,
    descripcion: pagina?.seoDescripcion,
    tituloRespaldo: pagina?.titulo ?? "Formas de pago y facilidades",
    descripcionRespaldo:
      pagina?.intro ??
      "Transparencia total en presupuestos, facilidades de financiamiento por etapas y medios de pago en ArietaNoova, Pueblo Libre.",
    etiquetaOg: "Formas de pago",
  });
}

export default async function PaginaFormasDePago() {
  const pagina = await consultar<PaginaFormasDePago | null>(
    PAGINA_FORMAS_DE_PAGO,
    null,
    {},
    { etiquetas: ["paginaFormasDePago"] },
  );

  const url = urlAbsoluta(RUTAS.formasDePago);
  const faqSchema = esquemaFaq(pagina?.preguntasFrecuentes, url);

  const esquemas = [
    esquemaMigas([
      { nombre: "Inicio", ruta: RUTAS.inicio },
      { nombre: "Formas de pago", ruta: RUTAS.formasDePago },
    ]),
    ...(faqSchema ? [faqSchema] : []),
  ];

  return (
    <>
      <StructuredData datos={esquemas} />

      {/* ── Encabezado ────────────────────────────────────────────────── */}
      <section className="border-b border-linea bg-fondo-alt py-seccion lg:py-seccion-lg">
        <Contenedor ancho="estrecho">
          <p className="font-cuerpo text-xs font-semibold uppercase tracking-wider text-acento">
            Claridad y previsibilidad
          </p>
          <h1 className="mt-2 font-display text-3xl font-semibold leading-tight sm:text-4xl lg:text-5xl">
            {pagina?.titulo ?? "Formas de pago y financiamiento"}
          </h1>
          <p className="mt-4 font-cuerpo text-base leading-relaxed text-suave sm:text-lg">
            {pagina?.intro ??
              "Creemos que el cuidado de tu salud oral debe ser predecible y sin sorpresas. Aquí te explicamos con total claridad cómo estructuramos los presupuestos y las opciones que tienes para financiar tu tratamiento."}
          </p>
        </Contenedor>
      </section>

      {/* ── Nota de Transparencia ─────────────────────────────────────── */}
      <Seccion aria="Por qué no publicamos lista de precios">
        <Contenedor ancho="estrecho">
          <div className="rounded-card border-l-4 border-l-acento border-y border-r border-linea bg-crema/40 p-6 sm:p-8">
            <h2 className="font-display text-xl font-semibold text-marca-900">
              Por qué no publicamos una lista genérica de precios
            </h2>
            <p className="mt-3 font-cuerpo text-sm sm:text-base leading-relaxed text-tinta">
              {pagina?.notaTransparencia ??
                "En una clínica de especialistas, ningún tratamiento es genérico. Dos pacientes con apiñamiento dental o dolor molar pueden requerir procedimientos completamente distintos. Publicar un tarifario fijo suele ser engañoso, porque el costo real depende de un diagnóstico preciso con escáner 3D que determine el estado exacto de hueso, encía y dientes. Preferimos darte un presupuesto exacto y definitivo tras tu evaluación, sin costos ocultos en medio del tratamiento."}
            </p>
          </div>
        </Contenedor>
      </Seccion>

      {/* ── Cómo se entrega el presupuesto ───────────────────────────── */}
      <Seccion fondo="alt" aria="Cómo se entrega el presupuesto">
        <Contenedor ancho="estrecho">
          <TituloSeccion nivel={2}>¿Cómo y cuándo recibes tu presupuesto?</TituloSeccion>
          <div className="space-y-4 font-cuerpo text-base leading-relaxed text-tinta">
            <p>
              {pagina?.comoSeEntregaElPresupuesto ??
                "Tras tu cita de diagnóstico clínico y digital, el especialista te explica en detalle cada fase necesaria. Recibes un presupuesto formal y por escrito que desglosa el plan completo, los materiales de grado clínico que se emplearán, el tiempo estimado y las etapas de pago."}
            </p>
            <RevelarEnCascada className="grid gap-4 pt-4 sm:grid-cols-2">
              <div className="rounded-card border border-linea bg-fondo p-5">
                <p className="font-display text-base font-semibold text-marca-900">
                  Desglose por etapas
                </p>
                <p className="mt-2 font-cuerpo text-xs text-suave">
                  Sabes de antemano qué cubre cada cita y cuándo corresponde abonarlo.
                </p>
              </div>
              <div className="rounded-card border border-linea bg-fondo p-5">
                <p className="font-display text-base font-semibold text-marca-900">
                  Sin costos ocultos
                </p>
                <p className="mt-2 font-cuerpo text-xs text-suave">
                  El presupuesto acordado se respeta para todo el plan planificado.
                </p>
              </div>
            </RevelarEnCascada>
          </div>
        </Contenedor>
      </Seccion>

      {/* ── Modalidades de Pago Aceptadas ─────────────────────────────── */}
      <Seccion aria="Modalidades de pago">
        <Contenedor ancho="estrecho">
          <TituloSeccion nivel={2}>Modalidades de pago aceptadas</TituloSeccion>
          <RevelarEnCascada className="grid gap-4 sm:grid-cols-2">
            {pagina?.modalidadesDePago && pagina.modalidadesDePago.length > 0 ? (
              pagina.modalidadesDePago.map((mod, i) => (
                <div
                  key={mod._key ?? i}
                  className="rounded-card border border-linea bg-fondo p-5"
                >
                  <h3 className="font-display text-base font-semibold text-marca-900">
                    {mod.nombre}
                  </h3>
                  {mod.descripcion ? (
                    <p className="mt-2 font-cuerpo text-sm text-suave">{mod.descripcion}</p>
                  ) : null}
                </div>
              ))
            ) : (
              <>
                <div className="rounded-card border border-linea bg-fondo p-5">
                  <h3 className="font-display text-base font-semibold text-marca-900">
                    Tarjetas de crédito y débito
                  </h3>
                  <p className="mt-2 font-cuerpo text-sm text-suave">
                    Aceptamos Visa, Mastercard, Diners y American Express.
                  </p>
                </div>
                <div className="rounded-card border border-linea bg-fondo p-5">
                  <h3 className="font-display text-base font-semibold text-marca-900">
                    Transferencias y billeteras digitales
                  </h3>
                  <p className="mt-2 font-cuerpo text-sm text-suave">
                    Transferencias directas a cuentas BCP / BBVA, Yape y Plin.
                  </p>
                </div>
                <div className="rounded-card border border-linea bg-fondo p-5">
                  <h3 className="font-display text-base font-semibold text-marca-900">
                    Efectivo
                  </h3>
                  <p className="mt-2 font-cuerpo text-sm text-suave">
                    Abonos directos en recepción en soles peruanos y dólares americanos.
                  </p>
                </div>
                <div className="rounded-card border border-linea bg-fondo p-5">
                  <h3 className="font-display text-base font-semibold text-marca-900">
                    Comprobantes electrónicos
                  </h3>
                  <p className="mt-2 font-cuerpo text-sm text-suave">
                    Emisión inmediata de boletas y facturas electrónicas para fines tributarios y seguros.
                  </p>
                </div>
              </>
            )}
          </RevelarEnCascada>
        </Contenedor>
      </Seccion>

      {/* ── Financiamiento ────────────────────────────────────────────── */}
      <Seccion fondo="alt" aria="Opciones de financiamiento">
        <Contenedor ancho="estrecho">
          <TituloSeccion nivel={2}>Facilidades de financiamiento</TituloSeccion>
          <div className="space-y-4">
            {pagina?.financiamiento && pagina.financiamiento.length > 0 ? (
              pagina.financiamiento.map((fin, i) => (
                <article
                  key={fin._key ?? i}
                  className="rounded-card border border-linea bg-fondo p-6"
                >
                  <h3 className="font-display text-lg font-semibold text-marca-900">
                    {fin.nombre}
                  </h3>
                  <p className="mt-2 font-cuerpo text-sm leading-relaxed text-tinta">
                    {fin.descripcion}
                  </p>
                  {fin.requisitos ? (
                    <p className="mt-3 font-cuerpo text-xs font-medium text-suave">
                      Condiciones: {fin.requisitos}
                    </p>
                  ) : null}
                </article>
              ))
            ) : (
              <>
                <article className="rounded-card border border-linea bg-fondo p-6">
                  <h3 className="font-display text-lg font-semibold text-marca-900">
                    Pago por avance de tratamiento (Ortodoncia y Prótesis)
                  </h3>
                  <p className="mt-2 font-cuerpo text-sm leading-relaxed text-tinta">
                    En tratamientos de duración prolongada como ortodoncia, abonas una inicial y el saldo se distribuye en cuotas mensuales conforme asistes a tus controles.
                  </p>
                </article>
                <article className="rounded-card border border-linea bg-fondo p-6">
                  <h3 className="font-display text-lg font-semibold text-marca-900">
                    Cuotas con tarjeta de crédito
                  </h3>
                  <p className="mt-2 font-cuerpo text-sm leading-relaxed text-tinta">
                    Puedes fraccionar el pago de tus procedimientos en las cuotas que prefieras directamente con tu banco emisor.
                  </p>
                </article>
              </>
            )}
          </div>
        </Contenedor>
      </Seccion>

      {/* ── Cobertura de seguros ──────────────────────────────────────── */}
      <Seccion aria="Seguros y reembolsos">
        <Contenedor ancho="estrecho">
          <TituloSeccion nivel={2}>Seguros médicos y reembolsos</TituloSeccion>
          <div className="rounded-card border border-linea bg-fondo p-6 sm:p-8">
            <p className="font-cuerpo text-base leading-relaxed text-tinta">
              {pagina?.coberturaSeguros ??
                "Emitimos todos los documentos clínicos, boletas y facturas electrónicas detalladas para que puedas gestionar el reembolso de tu tratamiento con tu compañía de seguros privada o EPS (Rimac, Pacífico, Mapfre, Sanitas, etc.)."}
            </p>
          </div>
        </Contenedor>
      </Seccion>

      {/* ── Preguntas frecuentes ──────────────────────────────────────── */}
      {pagina?.preguntasFrecuentes && pagina.preguntasFrecuentes.length > 0 ? (
        <Seccion fondo="alt" aria="Preguntas frecuentes sobre pagos">
          <Contenedor ancho="estrecho">
            <TituloSeccion nivel={2}>Preguntas frecuentes sobre pagos</TituloSeccion>
            <FaqAccordion faqs={pagina.preguntasFrecuentes} />
          </Contenedor>
        </Seccion>
      ) : null}

      {/* ── Cierre CTA ────────────────────────────────────────────────── */}
      <Seccion fondo={pagina?.preguntasFrecuentes?.length ? "normal" : "alt"} aria="Solicitar evaluación">
        <Contenedor ancho="estrecho" className="text-center">
          <h2 className="font-display text-2xl font-semibold sm:text-3xl">
            ¿Listo para evaluar tu caso con un especialista?
          </h2>
          <p className="mt-3 font-cuerpo text-base text-suave">
            Agenda tu cita de diagnóstico para recibir tu plan de tratamiento personalizado y presupuesto transparente.
          </p>
          <div className="mt-6 flex justify-center">
            <BookingCTA variant="reservar" origen="formas_de_pago_cierre" tamano="lg" />
          </div>
        </Contenedor>
      </Seccion>
    </>
  );
}
