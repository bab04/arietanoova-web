import type { CSSProperties } from "react";

/**
 * Retraso de entrada, en milisegundos.
 *
 * Lo leen tanto la clase `.entrada` (animación al cargar) como el
 * componente <Revelar> (transición al entrar en pantalla). Existe para que
 * un escalonado se escriba `style={retraso(120)}` y no como un literal CSS
 * repetido por media portada.
 */
export function retraso(ms: number): CSSProperties {
  return { "--retraso": `${ms}ms` } as CSSProperties;
}

/**
 * Escalonado por posición, para listas que se montan con `map`.
 * `paso` por defecto: el mismo que usa la cascada en CSS.
 */
export function retrasoEnCascada(indice: number, paso = 90): CSSProperties {
  return retraso(indice * paso);
}
