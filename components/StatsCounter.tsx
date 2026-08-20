"use client";

import { useEffect, useRef, useState } from "react";

import { cx } from "@/lib/clases";

/**
 * StatsCounter — contador animado que respeta prefers-reduced-motion.
 *
 * Dos decisiones deliberadas:
 *   - La cifra final se renderiza en el HTML desde el primer momento
 *     (`valorInicial`), así que si el JavaScript no carga o el usuario pide
 *     movimiento reducido, el dato sigue estando. La animación es un añadido,
 *     no el mecanismo por el que aparece el número.
 *   - Arranca con IntersectionObserver: animar algo que está fuera de la
 *     pantalla solo gasta batería.
 */

export interface Estadistica {
  valor: number;
  etiqueta: string;
  sufijo?: string;
  prefijo?: string;
}

export function StatsCounter({
  estadisticas,
  className,
}: {
  estadisticas: Estadistica[];
  className?: string;
}) {
  if (estadisticas.length === 0) return null;

  return (
    <dl
      className={cx(
        "grid gap-8 sm:grid-cols-2 lg:grid-cols-4",
        className,
      )}
    >
      {estadisticas.map((estadistica, i) => (
        <Contador key={i} {...estadistica} />
      ))}
    </dl>
  );
}

function Contador({ valor, etiqueta, sufijo = "", prefijo = "" }: Estadistica) {
  const [mostrado, setMostrado] = useState(valor);
  const elemento = useRef<HTMLDivElement>(null);
  const yaAnimado = useRef(false);

  useEffect(() => {
    const nodo = elemento.current;
    if (!nodo || yaAnimado.current) return;

    const reducido = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducido) return; // El valor final ya está en pantalla.

    const observador = new IntersectionObserver(
      (entradas) => {
        const entrada = entradas[0];
        if (!entrada?.isIntersecting || yaAnimado.current) return;

        yaAnimado.current = true;
        observador.disconnect();

        const duracion = 1200;
        const inicio = performance.now();

        function paso(ahora: number) {
          const avance = Math.min((ahora - inicio) / duracion, 1);
          // Desaceleración cúbica: rápido al principio, se asienta al final.
          const suavizado = 1 - Math.pow(1 - avance, 3);
          setMostrado(Math.round(valor * suavizado));
          if (avance < 1) requestAnimationFrame(paso);
        }

        setMostrado(0);
        requestAnimationFrame(paso);
      },
      { threshold: 0.4 },
    );

    observador.observe(nodo);
    return () => observador.disconnect();
  }, [valor]);

  return (
    <div ref={elemento} className="text-center">
      <dd className="font-display text-4xl font-semibold text-marca-900 sm:text-5xl">
        {prefijo}
        {mostrado.toLocaleString("es-PE")}
        {sufijo}
      </dd>
      <dt className="mt-2 font-cuerpo text-sm text-suave">{etiqueta}</dt>
    </div>
  );
}
