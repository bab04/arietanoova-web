import { IconoChevron } from "@/components/Iconos";
import { cx } from "@/lib/clases";
import type { Faq } from "@/types/contenido";

/**
 * FaqAccordion — acordeón accesible.
 *
 * Usa <details>/<summary> nativos en vez de reconstruir el patrón con ARIA
 * y estado de React. Tres consecuencias que importan aquí:
 *   - Funciona con teclado y lectores de pantalla sin escribir una línea.
 *   - No envía JavaScript al navegador (es componente de servidor), lo que
 *     ayuda al objetivo de rendimiento ≥ 90 en móvil.
 *   - El buscador del navegador (Ctrl+F) encuentra el texto plegado.
 */
export function FaqAccordion({
  faqs,
  className,
}: {
  faqs?: Faq[];
  className?: string;
}) {
  if (!faqs || faqs.length === 0) return null;

  return (
    <div className={cx("divide-y divide-linea border-y border-linea", className)}>
      {faqs.map((faq, i) => (
        <details key={faq._key ?? i} className="group">
          <summary
            className={cx(
              "flex cursor-pointer list-none items-center justify-between gap-4 py-4",
              "font-display text-base font-medium text-marca-900",
              "hover:text-marca-700",
            )}
          >
            <span>{faq.pregunta}</span>
            <IconoChevron
              className="shrink-0 text-lg text-marca-500 transition-transform duration-200 ease-suave group-open:rotate-180"
              aria-hidden="true"
            />
          </summary>

          <div className="pb-5 pr-8">
            <p className="font-cuerpo text-sm leading-relaxed text-suave">
              {faq.respuesta}
            </p>
          </div>
        </details>
      ))}
    </div>
  );
}
