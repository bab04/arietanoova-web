"use client";

import Link from "next/link";

import { cx } from "@/lib/clases";
import { conUtm, EVENTOS, normalizarOrigen, registrarEvento } from "@/lib/analitica";
import { DESTINO_POR_VARIANTE } from "@/lib/rutas";
import type { VarianteCta } from "@/types/contenido";

/**
 * BookingCTA — la llamada a la acción del sitio.
 *
 * La clienta pidió explícitamente llamadas distintas por sección:
 * en Ortodoncia "consultar sobre mi caso", en Rehabilitación "solicitar
 * evaluación", en la matutina "reservar". Cada variante lleva a un destino
 * distinto y registra el evento con `origen` como etiqueta.
 *
 * Criterio de verificación: las tres variantes llevan a destinos distintos
 * y registran el evento con su origen.
 */

interface TextoVariante {
  etiqueta: string;
  /** Se lee por lectores de pantalla cuando la etiqueta sola es ambigua. */
  descripcion: string;
}

/** Microcopy de interfaz. No es contenido clínico: puede vivir en código. */
const TEXTOS: Record<VarianteCta, TextoVariante> = {
  reservar: {
    etiqueta: "Reservar cita",
    descripcion: "Reservar una cita en la clínica",
  },
  consultar: {
    etiqueta: "Consultar sobre mi caso",
    descripcion: "Consultar sobre mi caso con un especialista",
  },
  evaluacion: {
    etiqueta: "Solicitar evaluación",
    descripcion: "Solicitar la evaluación matutina",
  },
};

export type TamanoCta = "sm" | "md" | "lg";
export type EstiloCta = "solido" | "contorno" | "texto";

export interface BookingCTAProps {
  /** Qué paso propone. Determina texto, destino y etiqueta del evento. */
  variant?: VarianteCta;
  /** De dónde sale el clic. Ej.: "portada_hero". Va como etiqueta y como UTM. */
  origen?: string;
  /** Destino explícito. Tiene prioridad sobre el de la variante. */
  href?: string;
  /** Reemplaza el texto por defecto de la variante. */
  etiqueta?: string;
  tamano?: TamanoCta;
  estilo?: EstiloCta;
  /** Ocupa todo el ancho disponible. Útil en móvil. */
  ancho?: boolean;
  className?: string;
}

const TAMANOS: Record<TamanoCta, string> = {
  sm: "px-4 py-2 text-sm",
  md: "px-5 py-3 text-base",
  lg: "px-7 py-4 text-lg",
};

const ESTILOS: Record<EstiloCta, string> = {
  solido:
    "bg-marca-700 text-fondo hover:bg-marca-900 shadow-card",
  contorno:
    "border border-marca-700 text-marca-700 hover:bg-marca-700 hover:text-fondo",
  texto: "text-marca-700 underline underline-offset-4 hover:text-marca-900",
};

export function BookingCTA({
  variant = "reservar",
  origen = "sin_origen",
  href,
  etiqueta,
  tamano = "md",
  estilo = "solido",
  ancho = false,
  className,
}: BookingCTAProps) {
  const textos = TEXTOS[variant];
  const origenNormalizado = normalizarOrigen(origen);

  // Un destino explícito manda; si no, el de la variante.
  const destinoCrudo = href ?? DESTINO_POR_VARIANTE[variant];

  // Los enlaces externos (Doctocliq) salen etiquetados; los internos no
  // necesitan UTM porque el origen ya viaja en el evento.
  const esExterno = /^https?:\/\//.test(destinoCrudo);
  const destino = esExterno
    ? (conUtm(destinoCrudo, origenNormalizado) ?? destinoCrudo)
    : destinoCrudo;

  const clases = cx(
    "inline-flex items-center justify-center gap-2 rounded-boton font-cuerpo font-semibold",
    "transition duration-200 ease-suave",
    "hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]",
    TAMANOS[tamano],
    ESTILOS[estilo],
    ancho && "w-full",
    className,
  );

  function alHacerClic() {
    registrarEvento(EVENTOS.clicReservar, {
      origen: origenNormalizado,
      variante: variant,
      destino,
    });
  }

  const contenido = etiqueta ?? textos.etiqueta;

  if (esExterno) {
    return (
      <a
        href={destino}
        target="_blank"
        rel="noopener noreferrer"
        className={clases}
        onClick={alHacerClic}
        aria-label={etiqueta ? undefined : textos.descripcion}
      >
        {contenido}
      </a>
    );
  }

  return (
    <Link
      href={destino}
      className={clases}
      onClick={alHacerClic}
      aria-label={etiqueta ? undefined : textos.descripcion}
    >
      {contenido}
    </Link>
  );
}
