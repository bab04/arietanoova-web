import type { MiembroEquipo } from "@/types/contenido";

/**
 * REGLA LEGAL DEL SPRINT, EN UN SOLO SITIO.
 *
 * Tres profesionales de la clínica tienen el RNE en trámite. Mientras lo
 * esté, la interfaz debe mostrar "Cirujano Dentista – [Especialidad]" y
 * NUNCA la palabra "Especialista".
 *
 * Se resuelve aquí y no en cada componente para que la regla no pueda
 * romperse por descuido en una tarjeta nueva. Ningún componente debe
 * construir el título profesional por su cuenta.
 *
 * Criterio de verificación: un miembro con rneEstado "en-tramite" nunca
 * muestra la palabra "Especialista" en la interfaz.
 */
export function tituloProfesional(miembro: Pick<MiembroEquipo, "rneEstado" | "especialidad">): string {
  const especialidad = miembro.especialidad?.trim();

  if (miembro.rneEstado === "vigente") {
    return especialidad ? `Especialista en ${especialidad}` : "Especialista";
  }

  // En trámite, o sin dato: se usa siempre la forma conservadora.
  return especialidad ? `Cirujano Dentista – ${especialidad}` : "Cirujano Dentista";
}

/**
 * Tratamiento delante del nombre. Sanity guarda el nombre a secas.
 * Sin dato de género no se puede elegir entre Dr. y Dra., así que se usa
 * la forma neutra "Dr(a)." salvo que el cargo ya lo resuelva.
 */
export function nombreConTratamiento(miembro: Pick<MiembroEquipo, "nombre" | "cargo">): string {
  const nombre = miembro.nombre?.trim();
  if (!nombre) return "";
  if (/^(dr|dra|dr\.|dra\.)/i.test(nombre)) return nombre;
  return `Dr(a). ${nombre}`;
}

/**
 * Credenciales verificables, ya formateadas y sin huecos.
 * El RNE solo se muestra si está vigente: anunciar un número en trámite
 * como si fuera una credencial activa es exactamente lo que hay que evitar.
 */
export function credenciales(miembro: MiembroEquipo): string[] {
  const partes: string[] = [];
  if (miembro.colegiatura) partes.push(`COP ${miembro.colegiatura}`);
  if (miembro.rne && miembro.rneEstado === "vigente") partes.push(`RNE ${miembro.rne}`);
  return partes;
}

/** Etiqueta del estado del RNE, para mostrarla con transparencia. */
export function etiquetaRne(miembro: Pick<MiembroEquipo, "rneEstado">): string | null {
  return miembro.rneEstado === "en-tramite" ? "RNE en trámite" : null;
}
