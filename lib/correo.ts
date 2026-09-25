import { Resend } from "resend";

import { tokens } from "@/lib/tokens";

import { AJUSTES_SITIO } from "@/sanity/queries";
import { consultar } from "@/sanity/client";
import type { AjustesSitio } from "@/types/contenido";

/**
 * Envío de correo con Resend.
 *
 * Sin RESEND_API_KEY el envío no falla: se registra en la consola del
 * servidor y se devuelve éxito simulado. Así los formularios se pueden
 * probar de punta a punta en local sin credenciales, que es uno de los
 * criterios de verificación del sprint.
 */

const CLAVE = process.env.RESEND_API_KEY ?? "";
const REMITENTE = process.env.CORREO_REMITENTE ?? "ArietaNoova <onboarding@resend.dev>";
const DESTINO_RESPALDO = process.env.CORREO_NOTIFICACIONES ?? "";

let clienteResend: Resend | null = null;

function obtenerResend(): Resend | null {
  if (!CLAVE) return null;
  if (!clienteResend) clienteResend = new Resend(CLAVE);
  return clienteResend;
}

/**
 * Correo de destino: manda el de Sanity (`ajustesSitio.correoNotificaciones`)
 * y, si no está, la variable de entorno. La clínica puede cambiarlo desde
 * el Studio sin desplegar.
 */
export async function correoDeNotificaciones(): Promise<string | null> {
  const ajustes = await consultar<AjustesSitio | null>(AJUSTES_SITIO, null, {}, {
    revalidar: 300,
    etiquetas: ["ajustesSitio"],
  });

  return ajustes?.correoNotificaciones || DESTINO_RESPALDO || null;
}

export interface AdjuntoCorreo {
  filename: string;
  content: Buffer;
}

export interface ResultadoEnvio {
  enviado: boolean;
  simulado: boolean;
  error?: string;
}

export async function enviarCorreo({
  para,
  asunto,
  html,
  texto,
  responderA,
  adjuntos,
}: {
  para: string;
  asunto: string;
  html: string;
  texto: string;
  responderA?: string;
  adjuntos?: AdjuntoCorreo[];
}): Promise<ResultadoEnvio> {
  const resend = obtenerResend();

  if (!resend) {
    console.info(
      [
        "─────────────────────────────────────────────",
        "[correo] Sin RESEND_API_KEY: envío simulado.",
        `  Para:    ${para}`,
        `  Asunto:  ${asunto}`,
        responderA ? `  Responder a: ${responderA}` : null,
        adjuntos?.length ? `  Adjuntos: ${adjuntos.length}` : null,
        "─────────────────────────────────────────────",
        texto,
        "─────────────────────────────────────────────",
      ]
        .filter(Boolean)
        .join("\n"),
    );
    return { enviado: true, simulado: true };
  }

  try {
    const { error } = await resend.emails.send({
      from: REMITENTE,
      to: [para],
      subject: asunto,
      html,
      text: texto,
      replyTo: responderA,
      attachments: adjuntos?.map((a) => ({
        filename: a.filename,
        content: a.content,
      })),
    });

    if (error) {
      console.error("[correo] Resend devolvió un error:", error);
      return { enviado: false, simulado: false, error: error.message };
    }

    return { enviado: true, simulado: false };
  } catch (error) {
    console.error("[correo] Fallo al enviar:", error);
    return {
      enviado: false,
      simulado: false,
      error: error instanceof Error ? error.message : "Error desconocido",
    };
  }
}

/** Escapa texto del usuario antes de meterlo en el HTML del correo. */
export function escapar(texto: string): string {
  return texto
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/**
 * Plantilla del correo interno.
 * Deliberadamente sobria: la lee recepción, no un paciente, y tiene que
 * poder leerse de un vistazo en el móvil.
 */
export function plantillaCorreo({
  titulo,
  filas,
  mensaje,
  nota,
}: {
  titulo: string;
  filas: Array<[string, string]>;
  mensaje?: { etiqueta: string; contenido: string };
  nota?: string;
}): { html: string; texto: string } {
  const filasHtml = filas
    .filter(([, valor]) => valor)
    .map(
      ([etiqueta, valor]) =>
        `<tr>
          <td style="padding:8px 16px 8px 0;vertical-align:top;font-size:13px;color:${tokens.suave};white-space:nowrap">${escapar(etiqueta)}</td>
          <td style="padding:8px 0;font-size:14px;color:${tokens.tinta}">${escapar(valor)}</td>
        </tr>`,
    )
    .join("");

  const mensajeHtml = mensaje
    ? `<h2 style="margin:28px 0 8px;font-size:14px;color:${tokens.suave};font-weight:600">${escapar(mensaje.etiqueta)}</h2>
       <p style="margin:0;padding:16px;background:${tokens.fondoAlt};border-radius:8px;font-size:14px;line-height:1.6;color:${tokens.tinta};white-space:pre-wrap">${escapar(mensaje.contenido)}</p>`
    : "";

  const notaHtml = nota
    ? `<p style="margin:24px 0 0;font-size:12px;color:${tokens.suave}">${escapar(nota)}</p>`
    : "";

  const html = `<!doctype html>
<html lang="es">
<body style="margin:0;padding:24px;background:${tokens.fondoAlt};font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif">
  <div style="max-width:560px;margin:0 auto;padding:32px;background:${tokens.fondo};border-radius:12px">
    <h1 style="margin:0 0 24px;font-size:18px;color:${tokens.marca900}">${escapar(titulo)}</h1>
    <table style="width:100%;border-collapse:collapse">${filasHtml}</table>
    ${mensajeHtml}
    ${notaHtml}
  </div>
</body>
</html>`;

  const texto = [
    titulo,
    "",
    ...filas.filter(([, v]) => v).map(([etiqueta, valor]) => `${etiqueta}: ${valor}`),
    mensaje ? `\n${mensaje.etiqueta}:\n${mensaje.contenido}` : "",
    nota ? `\n${nota}` : "",
  ]
    .filter(Boolean)
    .join("\n");

  return { html, texto };
}
