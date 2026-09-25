import Link from "next/link";

import {
  IconoCirugia,
  IconoDiente,
  IconoEndodoncia,
  IconoFlecha,
  IconoOdontopediatria,
  IconoOrtodoncia,
  IconoPeriodoncia,
  IconoRehabilitacion,
} from "@/components/Iconos";
import { ImagenSanity } from "@/components/ImagenSanity";
import { cx } from "@/lib/clases";
import { rutaEspecialidad } from "@/lib/rutas";
import type { EspecialidadResumen } from "@/types/contenido";

function obtenerIconoEspecialidad(slug?: string) {
  if (!slug) return IconoDiente;
  if (slug.includes("ortodoncia")) return IconoOrtodoncia;
  if (slug.includes("endodoncia")) return IconoEndodoncia;
  if (slug.includes("rehabilitacion")) return IconoRehabilitacion;
  if (slug.includes("cirugia")) return IconoCirugia;
  if (slug.includes("odontopediatria")) return IconoOdontopediatria;
  if (slug.includes("periodoncia")) return IconoPeriodoncia;
  return IconoDiente;
}

/**
 * SpecialtyCard — tarjeta del índice de especialidades y de la portada.
 *
 * Toda la tarjeta es el área de clic con microinteracción suave,
 * iconografía de alta gama clínica y adaptación perfecta a tokens.
 */
export function SpecialtyCard({
  especialidad,
  conImagen = true,
  className,
}: {
  especialidad: EspecialidadResumen;
  conImagen?: boolean;
  className?: string;
}) {
  if (!especialidad.slug) return null;

  const Icono = obtenerIconoEspecialidad(especialidad.slug);

  return (
    <Link
      href={rutaEspecialidad(especialidad.slug)}
      className={cx(
        "group relative flex flex-col overflow-hidden rounded-card border border-linea bg-fondo",
        "transition-all duration-300 ease-suave hover:-translate-y-1 hover:border-marca-500/40 hover:shadow-card",
        className,
      )}
    >
      {conImagen && especialidad.imagenPrincipal ? (
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-fondo-alt">
          <ImagenSanity
            imagen={especialidad.imagenPrincipal}
            alt={especialidad.nombre ?? ""}
            llenar
            ancho={600}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 380px"
            className="transition-transform duration-300 ease-suave group-hover:scale-105"
          />
        </div>
      ) : (
        <div className="relative flex items-center justify-between border-b border-linea/60 bg-fondo-alt/70 px-6 py-5">
          <div className="flex h-12 w-12 items-center justify-center rounded-boton bg-fondo border border-linea text-marca-900 transition-colors duration-200 group-hover:bg-marca-900 group-hover:text-blanco">
            <Icono className="text-2xl" />
          </div>
          <span className="rounded-pastilla border border-linea bg-fondo px-3 py-1 font-cuerpo text-xs font-semibold text-suave">
            Atención Especializada
          </span>
        </div>
      )}

      <div className="flex flex-1 flex-col p-6">
        <h3 className="font-display text-xl font-semibold text-marca-900 transition-colors duration-200 group-hover:text-marca-500">
          {especialidad.nombre}
        </h3>

        {especialidad.resumenCorto ? (
          <p className="mt-2.5 flex-1 font-cuerpo text-sm leading-relaxed text-suave">
            {especialidad.resumenCorto}
          </p>
        ) : (
          <p className="mt-2.5 flex-1 font-cuerpo text-sm italic text-suave">
            Descripción pendiente.
          </p>
        )}

        <div className="mt-5 flex items-center justify-between pt-3 border-t border-linea/40">
          <span className="font-cuerpo text-xs font-medium text-suave uppercase tracking-wider">
            Detalles del servicio
          </span>
          <span className="inline-flex items-center gap-1.5 font-cuerpo text-sm font-semibold text-marca-700 transition-colors duration-200 group-hover:text-marca-900">
            Conocer más
            <IconoFlecha className="text-base transition-transform duration-200 ease-suave group-hover:translate-x-1" />
          </span>
        </div>
      </div>
    </Link>
  );
}
