"use client";

import { useCallback, useId, useRef, useState } from "react";

import { ImagenSanity } from "@/components/ImagenSanity";
import { cx } from "@/lib/clases";
import type { ImagenSanityRef } from "@/types/contenido";

/**
 * BeforeAfter — comparador con deslizador, accesible por teclado.
 *
 * La accesibilidad aquí no es un extra: el control es un <input type="range">
 * real, no un div con eventos de ratón. Eso da gratis las flechas, Inicio y
 * Fin, el rol de deslizador y el anuncio del valor en lectores de pantalla.
 * Encima se dibuja el asa; debajo sigue habiendo un control nativo.
 */
export function BeforeAfter({
  antes,
  despues,
  altAntes = "Antes del tratamiento",
  altDespues = "Después del tratamiento",
  etiqueta = "Comparar antes y después",
  className,
}: {
  antes?: ImagenSanityRef;
  despues?: ImagenSanityRef;
  altAntes?: string;
  altDespues?: string;
  etiqueta?: string;
  className?: string;
}) {
  const [posicion, setPosicion] = useState(50);
  const contenedor = useRef<HTMLDivElement>(null);
  const idDescripcion = useId();

  // Arrastre con puntero: se mapea a la misma variable de estado que el
  // deslizador, así el teclado y el ratón nunca se desincronizan.
  const moverConPuntero = useCallback((clienteX: number) => {
    const caja = contenedor.current?.getBoundingClientRect();
    if (!caja || caja.width === 0) return;
    const relativo = ((clienteX - caja.left) / caja.width) * 100;
    setPosicion(Math.min(100, Math.max(0, relativo)));
  }, []);

  if (!antes && !despues) return null;

  return (
    <figure className={cx("w-full", className)}>
      <div
        ref={contenedor}
        className="relative aspect-[4/3] w-full select-none overflow-hidden rounded-card bg-fondo-alt"
        onPointerDown={(e) => {
          e.currentTarget.setPointerCapture(e.pointerId);
          moverConPuntero(e.clientX);
        }}
        onPointerMove={(e) => {
          if (e.buttons === 1) moverConPuntero(e.clientX);
        }}
      >
        {/* Después: capa de fondo, siempre completa. */}
        <ImagenSanity
          imagen={despues}
          alt={altDespues}
          llenar
          ancho={1200}
          sizes="(max-width: 768px) 100vw, 700px"
        />

        {/* Antes: se recorta con clip-path según la posición. */}
        <div
          className="absolute inset-0"
          style={{ clipPath: `inset(0 ${100 - posicion}% 0 0)` }}
        >
          <ImagenSanity
            imagen={antes}
            alt={altAntes}
            llenar
            ancho={1200}
            sizes="(max-width: 768px) 100vw, 700px"
          />
        </div>

        {/* Asa. Decorativa: el control real es el input de abajo. */}
        <div
          className="pointer-events-none absolute inset-y-0 w-0.5 bg-fondo"
          style={{ left: `${posicion}%` }}
          aria-hidden="true"
        >
          <div className="absolute top-1/2 left-1/2 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-pastilla bg-fondo shadow-flotante">
            <span className="font-cuerpo text-xs font-bold text-marca-700">↔</span>
          </div>
        </div>

        {/* Etiquetas de esquina */}
        <span className="pointer-events-none absolute left-3 top-3 rounded-boton bg-tinta/70 px-2 py-1 font-cuerpo text-xs font-medium text-fondo">
          Antes
        </span>
        <span className="pointer-events-none absolute right-3 top-3 rounded-boton bg-tinta/70 px-2 py-1 font-cuerpo text-xs font-medium text-fondo">
          Después
        </span>
      </div>

      {/* Control real. Visible y enfocable: no es un truco de accesibilidad
          escondido, es el deslizador que usan todos. */}
      <div className="mt-3">
        <label htmlFor={`${idDescripcion}-rango`} className="solo-lectores">
          {etiqueta}
        </label>
        <input
          id={`${idDescripcion}-rango`}
          type="range"
          min={0}
          max={100}
          step={1}
          value={Math.round(posicion)}
          onChange={(e) => setPosicion(Number(e.target.value))}
          aria-valuetext={`${Math.round(posicion)} por ciento del antes visible`}
          aria-describedby={idDescripcion}
          className="w-full accent-marca-700"
        />
        <p id={idDescripcion} className="mt-1 font-cuerpo text-xs text-suave">
          Arrastra o usa las flechas del teclado para comparar.
        </p>
      </div>
    </figure>
  );
}
