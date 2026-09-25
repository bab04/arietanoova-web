import { IconoChevron } from "@/components/Iconos";
import { cx } from "@/lib/clases";

/**
 * IndicadorScroll — el "hay más abajo" de la portada.
 *
 * Es un enlace de verdad, no un adorno: en móvil, un pulgar que no quiere
 * deslizar lo pulsa y baja igual, y el lector de pantalla lo anuncia como
 * lo que es. El salto lo suaviza `scroll-behavior: smooth` del sitio, y el
 * `scroll-padding-top` evita que el encabezado pegajoso tape el destino.
 *
 * Dos animaciones en dos elementos distintos a propósito:
 *   - El contenedor se desvanece con el scroll (`.apertura-indicador`,
 *     ligada a `animation-timeline`).
 *   - La flecha rebota en bucle (`.indicador-scroll-flecha`).
 * Si vivieran en el mismo nodo, una sobrescribiría a la otra: `animation`
 * es una sola propiedad.
 */
export function IndicadorScroll({
  destino,
  etiqueta = "Desliza",
  className,
}: {
  /** Ancla de la siguiente sección. Ej.: "#especialidades". */
  destino: string;
  etiqueta?: string;
  className?: string;
}) {
  return (
    <a
      href={destino}
      className={cx(
        "apertura-indicador group inline-flex flex-col items-center gap-3",
        className,
      )}
    >
      <span className="font-cuerpo text-xs font-semibold uppercase tracking-widest text-marca-500">
        {etiqueta}
      </span>

      <span
        aria-hidden="true"
        className={cx(
          "indicador-scroll-flecha inline-flex h-10 w-10 items-center justify-center",
          "rounded-pastilla border border-linea bg-fondo text-marca-700",
          "transition-colors duration-200 ease-suave",
          "group-hover:border-marca-500 group-hover:text-marca-900",
        )}
      >
        <IconoChevron className="text-lg" />
      </span>
    </a>
  );
}
