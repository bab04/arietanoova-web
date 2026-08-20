import { NextResponse } from "next/server";

import { correoDeNotificaciones, enviarCorreo, plantillaCorreo } from "@/lib/correo";
import { comprobarLimite, ipDePeticion } from "@/lib/limite";
import { erroresPorCampo, esquemaContacto } from "@/lib/validacion";

/**
 * POST /api/contacto
 *
 * Orden de las comprobaciones, de la más barata a la más cara:
 *   1. Límite por IP (no toca ni el cuerpo de la petición).
 *   2. Cuerpo JSON bien formado.
 *   3. Honeypot.
 *   4. Validación Zod — el mismo esquema que usó el navegador.
 *   5. Envío por Resend.
 *
 * Todas las respuestas van en español porque las lee el paciente.
 */

export const runtime = "nodejs";

export async function POST(peticion: Request) {
  const ip = ipDePeticion(peticion);
  const limite = comprobarLimite(`contacto:${ip}`, 5, 10 * 60 * 1000);

  if (!limite.permitido) {
    const minutos = Math.ceil(limite.esperaSegundos / 60);
    return NextResponse.json(
      {
        ok: false,
        mensaje: `Has enviado varios mensajes seguidos. Vuelve a intentarlo en ${minutos} minuto${minutos === 1 ? "" : "s"} o llámanos por teléfono.`,
      },
      { status: 429 },
    );
  }

  let cuerpo: unknown;
  try {
    cuerpo = await peticion.json();
  } catch {
    return NextResponse.json(
      { ok: false, mensaje: "No pudimos leer el formulario. Vuelve a intentarlo." },
      { status: 400 },
    );
  }

  const resultado = esquemaContacto.safeParse(cuerpo);

  if (!resultado.success) {
    return NextResponse.json(
      {
        ok: false,
        mensaje: "Revisa los campos marcados.",
        errores: erroresPorCampo(resultado.error),
      },
      { status: 400 },
    );
  }

  const datos = resultado.data;

  // Honeypot: un robot rellenó el campo oculto. Se responde con éxito para
  // no enseñarle cómo evitar el filtro, pero no se envía nada.
  if (datos.sitioWeb) {
    return NextResponse.json({ ok: true, mensaje: "Mensaje recibido." });
  }

  const destino = await correoDeNotificaciones();

  if (!destino) {
    console.error("[contacto] Sin correo de notificaciones configurado.");
    return NextResponse.json(
      {
        ok: false,
        mensaje:
          "No pudimos enviar tu mensaje en este momento. Escríbenos por WhatsApp o llámanos.",
      },
      { status: 500 },
    );
  }

  const { html, texto } = plantillaCorreo({
    titulo: "Nueva consulta desde la web",
    filas: [
      ["Nombre", datos.nombre],
      ["Teléfono", datos.telefono],
      ["Correo", datos.correo],
      ["Especialidad", datos.especialidad ?? ""],
      ["Recibido", new Date().toLocaleString("es-PE", { timeZone: "America/Lima" })],
    ],
    mensaje: { etiqueta: "Motivo de la consulta", contenido: datos.motivo },
    nota: "Puedes responder directamente a este correo: la respuesta le llega al paciente.",
  });

  const envio = await enviarCorreo({
    para: destino,
    asunto: `Consulta web · ${datos.nombre}`,
    html,
    texto,
    // Responder al correo del paciente sin tener que copiarlo a mano.
    responderA: datos.correo,
  });

  if (!envio.enviado) {
    return NextResponse.json(
      {
        ok: false,
        mensaje:
          "No pudimos enviar tu mensaje en este momento. Escríbenos por WhatsApp o llámanos.",
      },
      { status: 502 },
    );
  }

  return NextResponse.json({
    ok: true,
    mensaje: "Recibimos tu mensaje. Te contactamos dentro del horario de atención.",
  });
}
