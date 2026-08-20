import Link from "next/link";

import { IconoFlecha } from "@/components/Iconos";
import { ImagenSanity } from "@/components/ImagenSanity";
import { cx } from "@/lib/clases";
import { rutaEspecialidad } from "@/lib/rutas";
import type { EspecialidadResumen } from "@/types/contenido";

/**
 * SpecialtyCard — tarjeta del índice de especialidades y de la portada.
 *
 * Toda la tarjeta es el área de clic (el enlace envuelve el contenido) para
 * que en móvil no haya que acertarle a un texto de 14 píxeles.
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

  return (
    <Link
      href={rutaEspecialidad(especialidad.slug)}
      className={cx(
        "group flex flex-col overflow-hidden rounded-card border border-linea bg-fondo",
        "transition-shadow duration-200 ease-suave hover:shadow-card",
        className,
      )}
    >
      {conImagen ? (
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
      ) : null}

      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-display text-lg font-semibold text-marca-900">
          {especialidad.nombre}
        </h3>

        {especialidad.resumenCorto ? (
          <p className="mt-2 flex-1 font-cuerpo text-sm leading-relaxed text-suave">
            {especialidad.resumenCorto}
          </p>
        ) : (
          <p className="mt-2 flex-1 font-cuerpo text-sm italic text-suave">
            Descripción pendiente.
          </p>
        )}

        <span className="mt-4 inline-flex items-center gap-2 font-cuerpo text-sm font-semibold text-marca-700">
          Ver más
          <IconoFlecha className="text-base transition-transform duration-200 ease-suave group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
  );
}
