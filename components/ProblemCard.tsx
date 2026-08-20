import Link from "next/link";

import { IconoFlecha } from "@/components/Iconos";
import { cx } from "@/lib/clases";
import { rutaProblema } from "@/lib/rutas";
import type { ProblemaResumen } from "@/types/contenido";

/**
 * ProblemCard — tarjeta del índice de problemas (Fase 2).
 *
 * Va sin imagen a propósito: un problema se titula con las palabras del
 * paciente ("me sangran las encías") y el peso lo lleva el texto. Una foto
 * clínica al lado de esa frase asusta más de lo que ayuda.
 */
export function ProblemCard({
  problema,
  className,
}: {
  problema: ProblemaResumen;
  className?: string;
}) {
  if (!problema.slug) return null;

  return (
    <Link
      href={rutaProblema(problema.slug)}
      className={cx(
        "group flex flex-col rounded-card border border-linea bg-fondo p-5",
        "transition-shadow duration-200 ease-suave hover:shadow-card",
        className,
      )}
    >
      <h3 className="font-display text-lg font-semibold text-marca-900">
        {problema.titulo}
      </h3>

      {problema.resumenCorto ? (
        <p className="mt-2 flex-1 font-cuerpo text-sm leading-relaxed text-suave">
          {problema.resumenCorto}
        </p>
      ) : null}

      <span className="mt-4 inline-flex items-center gap-2 font-cuerpo text-sm font-semibold text-marca-700">
        Qué hacer
        <IconoFlecha className="text-base transition-transform duration-200 ease-suave group-hover:translate-x-1" />
      </span>
    </Link>
  );
}
