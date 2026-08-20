import { cx } from "@/lib/clases";
import type { Paso } from "@/types/contenido";

/**
 * ProcessSteps — pasos numerados.
 *
 * Es lo que responde "cómo es el proceso", la pregunta que más se hace
 * antes de reservar y la que hoy se resuelve por teléfono.
 *
 * Se marca como <ol> porque el orden es información, no estilo: un lector
 * de pantalla debe anunciar "elemento 2 de 5".
 */
export function ProcessSteps({
  pasos,
  className,
}: {
  pasos?: Paso[];
  className?: string;
}) {
  if (!pasos || pasos.length === 0) return null;

  return (
    <ol className={cx("space-y-6", className)}>
      {pasos.map((paso, i) => (
        <li key={paso._key ?? i} className="flex gap-4">
          <span
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-pastilla bg-marca-700 font-cuerpo text-sm font-semibold text-fondo"
            aria-hidden="true"
          >
            {i + 1}
          </span>

          <div className="pt-1">
            {paso.titulo ? (
              <h3 className="font-display text-base font-semibold text-marca-900">
                {paso.titulo}
              </h3>
            ) : null}
            {paso.descripcion ? (
              <p className="mt-1 font-cuerpo text-sm leading-relaxed text-suave">
                {paso.descripcion}
              </p>
            ) : null}
          </div>
        </li>
      ))}
    </ol>
  );
}
