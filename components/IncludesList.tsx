import { IconoCheck } from "@/components/Iconos";
import { cx } from "@/lib/clases";

/**
 * IncludesList — lista de "qué incluye".
 *
 * Cuantificar qué entra en una cita es lo que justifica el precio y lo que
 * evita el malentendido en recepción. Se usa en especialidades y en la
 * landing de la evaluación matutina.
 */
export function IncludesList({
  elementos,
  columnas = 1,
  className,
}: {
  elementos?: string[];
  columnas?: 1 | 2;
  className?: string;
}) {
  if (!elementos || elementos.length === 0) return null;

  return (
    <ul
      className={cx(
        "space-y-3",
        columnas === 2 && "sm:grid sm:grid-cols-2 sm:gap-x-8 sm:gap-y-3 sm:space-y-0",
        className,
      )}
    >
      {elementos.map((elemento, i) => (
        <li key={i} className="flex items-start gap-3">
          <IconoCheck
            className="mt-1 shrink-0 text-base text-marca-500"
            aria-hidden="true"
          />
          <span className="font-cuerpo text-sm leading-relaxed text-tinta">
            {elemento}
          </span>
        </li>
      ))}
    </ul>
  );
}
