import { z } from "zod";

/**
 * Esquemas de validación compartidos entre cliente y servidor.
 *
 * El mismo objeto Zod valida el formulario mientras se escribe y valida el
 * cuerpo de la petición en el Route Handler. Así es imposible que el
 * navegador acepte algo que el servidor rechaza, o al revés.
 *
 * Todos los mensajes están en español porque los lee el paciente.
 */

const TELEFONO_PERU = /^(\+?51)?[\s-]?9\d{2}[\s-]?\d{3}[\s-]?\d{3}$|^\d{6,12}$/;

const nombre = z
  .string()
  .trim()
  .min(2, "Escribe tu nombre completo.")
  .max(120, "El nombre es demasiado largo.");

const correo = z
  .string()
  .trim()
  .min(1, "Escribe tu correo electrónico.")
  .email("Ese correo no parece válido. Revisa que tenga @ y un dominio.");

const telefono = z
  .string()
  .trim()
  .min(1, "Escribe un teléfono de contacto.")
  .regex(TELEFONO_PERU, "Ese teléfono no parece válido. Ej.: 987 654 321");

/**
 * Honeypot: un campo que ningún humano ve ni rellena.
 *
 * Zod lo acepta con cualquier valor A PROPÓSITO. Si aquí se pusiera
 * `.max(0)`, la validación devolvería un error de campo nombrando `sitioWeb`
 * — que es justo lo que no debe saber el robot: le estaríamos diciendo qué
 * campo dejar vacío para pasar el filtro.
 *
 * La trampa la resuelve el Route Handler: si viene con contenido, responde
 * 200 como si todo hubiera ido bien y no envía nada.
 */
const honeypot = z.string().optional();

// ── Formulario de contacto ───────────────────────────────────────────────

export const esquemaContacto = z.object({
  nombre,
  correo,
  telefono,
  motivo: z
    .string()
    .trim()
    .min(10, "Cuéntanos en una o dos frases en qué podemos ayudarte.")
    .max(2000, "El mensaje es demasiado largo. Máximo 2000 caracteres."),
  especialidad: z.string().trim().max(120).optional(),
  aceptaContacto: z.literal(true, {
    errorMap: () => ({ message: "Necesitamos tu permiso para responderte." }),
  }),
  sitioWeb: honeypot,
});

export type DatosContacto = z.infer<typeof esquemaContacto>;

// ── Formulario de derivación profesional ─────────────────────────────────

export const esquemaDerivacion = z.object({
  // Datos del colega que deriva
  colegaNombre: nombre,
  colegaCorreo: correo,
  colegaTelefono: telefono,
  colegaColegiatura: z
    .string()
    .trim()
    .min(3, "Escribe tu número de COP.")
    .max(30, "Ese número de colegiatura es demasiado largo."),

  // Datos del paciente
  pacienteNombre: nombre,
  pacienteTelefono: telefono,
  pacienteEdad: z
    .union([z.string(), z.number()])
    .optional()
    .transform((valor) => {
      if (valor === undefined || valor === "") return undefined;
      const numero = Number(valor);
      return Number.isFinite(numero) ? numero : undefined;
    })
    .refine(
      (valor) => valor === undefined || (valor >= 0 && valor <= 120),
      "Revisa la edad del paciente.",
    ),

  motivo: z
    .string()
    .trim()
    .min(10, "Describe el motivo de la derivación.")
    .max(3000, "El motivo es demasiado largo. Máximo 3000 caracteres."),

  especialidadSolicitada: z.string().trim().max(120).optional(),

  tipoSolicitud: z.enum(["derivacion", "mentoria"]).default("derivacion"),

  sitioWeb: honeypot,
});

export type DatosDerivacion = z.infer<typeof esquemaDerivacion>;

// ── Adjuntos ─────────────────────────────────────────────────────────────

export const TAMANO_MAXIMO_ADJUNTO = 10 * 1024 * 1024; // 10 MB

/**
 * Tipos permitidos para radiografías.
 *
 * `.dcm` (DICOM) casi nunca trae un tipo MIME útil desde el navegador —
 * suele llegar como cadena vacía o application/octet-stream — así que se
 * valida también por extensión.
 */
export const TIPOS_ADJUNTO_PERMITIDOS = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "application/pdf",
  "application/dicom",
  "application/octet-stream",
] as const;

export const EXTENSIONES_ADJUNTO_PERMITIDAS = ["jpg", "jpeg", "png", "pdf", "dcm"] as const;

export interface ResultadoAdjunto {
  valido: boolean;
  error?: string;
}

export function validarAdjunto(archivo: {
  name: string;
  size: number;
  type: string;
}): ResultadoAdjunto {
  if (archivo.size === 0) {
    return { valido: false, error: `El archivo ${archivo.name} está vacío.` };
  }

  if (archivo.size > TAMANO_MAXIMO_ADJUNTO) {
    return {
      valido: false,
      error: `El archivo ${archivo.name} pesa más de 10 MB. Comprímelo o envíalo por correo.`,
    };
  }

  const extension = archivo.name.split(".").pop()?.toLowerCase() ?? "";
  const extensionOk = (EXTENSIONES_ADJUNTO_PERMITIDAS as readonly string[]).includes(
    extension,
  );

  if (!extensionOk) {
    return {
      valido: false,
      error: `El archivo ${archivo.name} no es un tipo permitido. Acepta jpg, png, pdf y dcm.`,
    };
  }

  // La extensión manda; el tipo MIME solo se usa para descartar lo evidente.
  const tipoOk =
    archivo.type === "" ||
    (TIPOS_ADJUNTO_PERMITIDOS as readonly string[]).includes(archivo.type);

  if (!tipoOk) {
    return {
      valido: false,
      error: `El archivo ${archivo.name} no es un tipo permitido. Acepta jpg, png, pdf y dcm.`,
    };
  }

  return { valido: true };
}

/** Traduce un error de Zod a { campo: mensaje } para pintarlo junto al input. */
export function erroresPorCampo(error: z.ZodError): Record<string, string> {
  const salida: Record<string, string> = {};
  for (const problema of error.errors) {
    const campo = problema.path.join(".");
    if (campo && !salida[campo]) salida[campo] = problema.message;
  }
  return salida;
}
