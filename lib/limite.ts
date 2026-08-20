/**
 * Limitación de envíos por IP.
 *
 * Implementación en memoria a propósito. Para una clínica con este volumen
 * de tráfico es suficiente y no añade una dependencia de infraestructura
 * (Redis, Upstash) que habría que pagar y mantener.
 *
 * Limitación conocida: en Vercel cada instancia serverless tiene su propia
 * memoria, así que el límite es por instancia, no global. Frena el envío
 * repetido desde un formulario, que es el caso real; no frenaría un ataque
 * distribuido. Si algún día hace falta eso, se sustituye este archivo.
 */

interface Registro {
  intentos: number;
  reinicioEn: number;
}

const registros = new Map<string, Registro>();

/** Se limpia de vez en cuando para que el mapa no crezca sin límite. */
function limpiar(ahora: number) {
  if (registros.size < 1000) return;
  for (const [clave, registro] of registros) {
    if (registro.reinicioEn < ahora) registros.delete(clave);
  }
}

export interface ResultadoLimite {
  permitido: boolean;
  restantes: number;
  /** Segundos hasta que se pueda volver a intentar. */
  esperaSegundos: number;
}

export function comprobarLimite(
  clave: string,
  maximo = 5,
  ventanaMs = 10 * 60 * 1000,
): ResultadoLimite {
  const ahora = Date.now();
  limpiar(ahora);

  const registro = registros.get(clave);

  if (!registro || registro.reinicioEn < ahora) {
    registros.set(clave, { intentos: 1, reinicioEn: ahora + ventanaMs });
    return { permitido: true, restantes: maximo - 1, esperaSegundos: 0 };
  }

  if (registro.intentos >= maximo) {
    return {
      permitido: false,
      restantes: 0,
      esperaSegundos: Math.ceil((registro.reinicioEn - ahora) / 1000),
    };
  }

  registro.intentos += 1;
  return {
    permitido: true,
    restantes: maximo - registro.intentos,
    esperaSegundos: 0,
  };
}

/**
 * IP del cliente detrás del proxy de Vercel.
 * Si no se puede determinar, se devuelve una clave fija: es preferible
 * limitar de más que dejar el formulario sin protección.
 */
export function ipDePeticion(peticion: Request): string {
  const reenviada = peticion.headers.get("x-forwarded-for");
  if (reenviada) return reenviada.split(",")[0]!.trim();
  return peticion.headers.get("x-real-ip") ?? "desconocida";
}
