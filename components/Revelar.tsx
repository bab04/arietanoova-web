"use client";

import {
  createElement,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
  type Ref,
} from "react";

import { retraso as estiloDeRetraso } from "@/lib/movimiento";

/**
 * Revelar — contenido que entra cuando entra en pantalla.
 *
 * Las mismas tres decisiones que ya gobiernan StatsCounter:
 *
 *   - Mejora progresiva de verdad. El HTML que sale del servidor no lleva
 *     ninguna clase que esconda nada: el estado inicial (opacidad 0) vive
 *     en `@media (scripting: enabled)` de globals.css. Sin JavaScript, el
 *     texto se ve; la animación es un añadido, no el mecanismo por el que
 *     el contenido aparece. Es contenido clínico: no puede depender de un
 *     bundle que quizá no cargue.
 *
 *   - IntersectionObserver, no un listener de scroll. Animar algo que está
 *     fuera de la pantalla solo gasta batería, y un `onscroll` en un sitio
 *     con objetivo de rendimiento ≥ 90 en móvil no se paga solo.
 *
 *   - Una vez y se desconecta. El contenido no parpadea al volver a subir.
 *
 * El movimiento reducido se respeta en globals.css, no aquí: si cada
 * componente comprobara `matchMedia` por su cuenta, bastaría olvidarlo en
 * uno para romper la promesa.
 */

/** Desde dónde llega el elemento. Por defecto, desde abajo. */
export type DireccionRevelado = "abajo" | "arriba" | "izquierda" | "derecha" | "escala";

type EtiquetaHtml = "div" | "section" | "article" | "aside" | "ul" | "ol" | "li" | "dl" | "p";

interface PropsBase {
  children: ReactNode;
  /** Etiqueta que se renderiza. Importa para la semántica, no para el efecto. */
  etiqueta?: EtiquetaHtml;
  className?: string;
  /** Espera antes de entrar, en milisegundos. Para escalonados a mano. */
  retraso?: number;
  /** Porción del elemento que debe verse para disparar. 0–1. */
  umbral?: number;
  id?: string;
}

/**
 * Observa un elemento y devuelve si ya entró en pantalla alguna vez.
 * Si el navegador no trae IntersectionObserver, se da por visible.
 */
function useEntroEnPantalla<T extends HTMLElement>(umbral: number) {
  const nodo = useRef<T | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const elemento = nodo.current;
    if (!elemento || visible) return;

    if (typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }

    const observador = new IntersectionObserver(
      (entradas) => {
        if (!entradas.some((entrada) => entrada.isIntersecting)) return;
        setVisible(true);
        observador.disconnect();
      },
      {
        threshold: umbral,
        // Dispara un poco antes del borde inferior: el elemento termina de
        // entrar justo cuando el ojo llega, no dos líneas después.
        rootMargin: "0px 0px -8% 0px",
      },
    );

    observador.observe(elemento);
    return () => observador.disconnect();
  }, [umbral, visible]);

  return { nodo, visible };
}

function estiloRetraso(ms: number): CSSProperties | undefined {
  return ms ? estiloDeRetraso(ms) : undefined;
}

/**
 * Un bloque que aparece al llegar a él.
 *
 * ```tsx
 * <Revelar direccion="abajo" retraso={120}>
 *   <TarjetaLoQueSea />
 * </Revelar>
 * ```
 */
export function Revelar({
  children,
  direccion = "abajo",
  etiqueta = "div",
  className,
  retraso = 0,
  umbral = 0.15,
  id,
}: PropsBase & { direccion?: DireccionRevelado }) {
  const { nodo, visible } = useEntroEnPantalla<HTMLElement>(umbral);

  return createElement(
    etiqueta,
    {
      id,
      ref: nodo as Ref<HTMLElement>,
      className,
      style: estiloRetraso(retraso),
      "data-revelar": direccion,
      "data-visible": visible ? "si" : undefined,
    },
    children,
  );
}

/**
 * Una rejilla o lista cuyos hijos directos entran en cascada.
 *
 * El escalonado lo reparte el CSS por posición (`nth-child`), no un índice
 * que haya que ir pasando en cada `map`. Consecuencia práctica: la rejilla
 * sigue siendo la rejilla — no se envuelve cada tarjeta en un div extra,
 * que es lo que rompería el `stretch` de las alturas.
 *
 * ```tsx
 * <RevelarEnCascada className="grid gap-6 sm:grid-cols-3">
 *   {tarjetas.map(...)}
 * </RevelarEnCascada>
 * ```
 */
export function RevelarEnCascada({
  children,
  etiqueta = "div",
  className,
  retraso = 0,
  umbral = 0.1,
  id,
}: PropsBase) {
  const { nodo, visible } = useEntroEnPantalla<HTMLElement>(umbral);

  return createElement(
    etiqueta,
    {
      id,
      ref: nodo as Ref<HTMLElement>,
      className,
      style: estiloRetraso(retraso),
      "data-revelar-cascada": "",
      "data-visible": visible ? "si" : undefined,
    },
    children,
  );
}
