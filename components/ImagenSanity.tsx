import Image from "next/image";

import { cx } from "@/lib/clases";
import { urlImagen } from "@/sanity/client";
import type { ImagenSanityRef } from "@/types/contenido";

/**
 * ImagenSanity — envoltorio de next/image con el CDN de Sanity.
 *
 * Resuelve tres cosas que, si se dejan al componente que la usa, se olvidan:
 *   - El punto de interés (hotspot) que marca la doctora en el Studio, para
 *     que el recorte en móvil no corte una cara por la mitad.
 *   - El texto alternativo: sale del campo `alt` de Sanity y, si falta,
 *     del respaldo que pase el componente.
 *   - Qué mostrar cuando no hay imagen. Durante el Sprint 1 casi nunca la
 *     hay, así que el estado vacío es el caso normal, no la excepción.
 */

export interface ImagenSanityProps {
  imagen?: ImagenSanityRef | null;
  /** Respaldo del texto alternativo si Sanity no lo trae. */
  alt?: string;
  ancho?: number;
  alto?: number;
  /** Ocupa el contenedor posicionado que la envuelve. */
  llenar?: boolean;
  sizes?: string;
  prioridad?: boolean;
  className?: string;
  /** Proporción del hueco cuando no hay imagen. */
  proporcionVacio?: string;
}

export function ImagenSanity({
  imagen,
  alt,
  ancho = 1200,
  alto,
  llenar = false,
  sizes = "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px",
  prioridad = false,
  className,
  proporcionVacio = "4 / 3",
}: ImagenSanityProps) {
  const url = urlImagen(imagen, { ancho, alto });

  // Estado vacío controlado: un hueco con la proporción correcta, para que
  // el diseño no salte cuando lleguen las fotografías.
  if (!url) {
    return (
      <div
        className={cx(
          "flex items-center justify-center rounded-card border border-dashed border-linea bg-fondo-alt",
          llenar ? "absolute inset-0" : "w-full",
          className,
        )}
        style={llenar ? undefined : { aspectRatio: proporcionVacio }}
        aria-hidden="true"
      >
        <span className="px-4 text-center font-cuerpo text-xs text-suave">
          Imagen pendiente
        </span>
      </div>
    );
  }

  const textoAlternativo = imagen?.alt ?? alt ?? "";

  if (llenar) {
    return (
      <Image
        src={url}
        alt={textoAlternativo}
        fill
        sizes={sizes}
        priority={prioridad}
        className={cx("object-cover", className)}
        style={posicionDesdeHotspot(imagen)}
      />
    );
  }

  return (
    <Image
      src={url}
      alt={textoAlternativo}
      width={ancho}
      height={alto ?? Math.round(ancho * 0.75)}
      sizes={sizes}
      priority={prioridad}
      className={cx("h-auto w-full", className)}
      style={posicionDesdeHotspot(imagen)}
    />
  );
}

/**
 * Traduce el punto de interés de Sanity a `object-position`.
 * Sin esto, `object-cover` recorta desde el centro y en móvil se pierde
 * justo lo que la doctora marcó como importante.
 */
function posicionDesdeHotspot(
  imagen?: ImagenSanityRef | null,
): React.CSSProperties | undefined {
  const punto = imagen?.hotspot;
  if (!punto) return undefined;
  return { objectPosition: `${punto.x * 100}% ${punto.y * 100}%` };
}
