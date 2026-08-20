import { NextResponse } from "next/server";

import {
  correoDeNotificaciones,
  enviarCorreo,
  plantillaCorreo,
  type AdjuntoCorreo,
} from "@/lib/correo";
import { comprobarLimite, ipDePeticion } from "@/lib/limite";
import {
  erroresPorCampo,
  esquemaDerivacion,
  validarAdjunto,
} from "@/lib/validacion";

/**
 * POST /api/derivacion
 *
 * A diferencia de /api/contacto, recibe multipart/form-data porque acepta
 * radiografías adjuntas (jpg, png, pdf, dcm) de hasta 10 MB.
 *
 * El tope de 10 MB se comprueba dos veces: por archivo y sobre el total,
 * porque el límite real de Resend es sobre el correo entero. Cinco archivos
 * de 9 MB pasarían la primera comprobación y reventarían el envío.
 */

export const runtime = "nodejs";

/** Límite total del correo. Resend acepta ~40 MB; se deja margen. */
const TOTAL_MAXIMO = 20 * 1024 * 1024;
const MAXIMO_ARCHIVOS = 6;

export async function POST(peticion: Request) {
  const ip = ipDePeticion(peticion);
  const limite = comprobarLimite(`derivacion:${ip}`, 5, 10 * 60 * 1000);

  if (!limite.permitido) {
    const minutos = Math.ceil(limite.esperaSegundos / 60);
    return NextResponse.json(
      {
        ok: false,
        mensaje: `Has enviado varias derivaciones seguidas. Vuelve a intentarlo en ${minutos} minuto${minutos === 1 ? "" : "s"}.`,
      },
      { status: 429 },
    );
  }

  let formulario: FormData;
  try {
    formulario = await peticion.formData();
  } catch {
    return NextResponse.json(
      { ok: false, mensaje: "No pudimos leer el formulario. Vuelve a intentarlo." },
      { status: 400 },
    );
  }

  const campos = Object.fromEntries(
    Array.from(formulario.entries()).filter(([, valor]) => typeof valor === "string"),
  );

  const resultado = esquemaDerivacion.safeParse(campos);

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

  if (datos.sitioWeb) {
    return NextResponse.json({ ok: true, mensaje: "Derivación recibida." });
  }

  // ── Adjuntos ───────────────────────────────────────────────────────────
  const archivos = formulario
    .getAll("radiografias")
    .filter((valor): valor is File => valor instanceof File && valor.size > 0);

  if (archivos.length > MAXIMO_ARCHIVOS) {
    return NextResponse.json(
      {
        ok: false,
        mensaje: `Puedes adjuntar hasta ${MAXIMO_ARCHIVOS} archivos. Envía el resto por correo.`,
        errores: { radiografias: `Máximo ${MAXIMO_ARCHIVOS} archivos.` },
      },
      { status: 400 },
    );
  }

  const adjuntos: AdjuntoCorreo[] = [];
  let pesoTotal = 0;

  for (const archivo of archivos) {
    const validacion = validarAdjunto({
      name: archivo.name,
      size: archivo.size,
      type: archivo.type,
    });

    if (!validacion.valido) {
      return NextResponse.json(
        {
          ok: false,
          mensaje: validacion.error,
          errores: { radiografias: validacion.error ?? "Archivo no válido." },
        },
        { status: 400 },
      );
    }

    pesoTotal += archivo.size;

    if (pesoTotal > TOTAL_MAXIMO) {
      return NextResponse.json(
        {
          ok: false,
          mensaje:
            "Los archivos suman demasiado peso en conjunto. Envía los más pesados por correo.",
          errores: { radiografias: "Peso total excedido." },
        },
        { status: 400 },
      );
    }

    adjuntos.push({
      filename: nombreSeguro(archivo.name),
      content: Buffer.from(await archivo.arrayBuffer()),
    });
  }

  // ── Envío ──────────────────────────────────────────────────────────────
  const destino = await correoDeNotificaciones();

  if (!destino) {
    console.error("[derivacion] Sin correo de notificaciones configurado.");
    return NextResponse.json(
      {
        ok: false,
        mensaje: "No pudimos registrar la derivación. Escríbenos por WhatsApp.",
      },
      { status: 500 },
    );
  }

  const esMentoria = datos.tipoSolicitud === "mentoria";

  const { html, texto } = plantillaCorreo({
    titulo: esMentoria
      ? "Solicitud de mentoría de un colega"
      : "Nueva derivación profesional",
    filas: [
      ["— Colega —", " "],
      ["Nombre", datos.colegaNombre],
      ["COP", datos.colegaColegiatura],
      ["Teléfono", datos.colegaTelefono],
      ["Correo", datos.colegaCorreo],
      ["— Paciente —", " "],
      ["Nombre", datos.pacienteNombre],
      ["Teléfono", datos.pacienteTelefono],
      ["Edad", datos.pacienteEdad ? String(datos.pacienteEdad) : ""],
      ["— Solicitud —", " "],
      ["Tipo", esMentoria ? "Mentoría" : "Derivación"],
      ["Especialidad", datos.especialidadSolicitada ?? ""],
      ["Adjuntos", adjuntos.length > 0 ? `${adjuntos.length} archivo(s)` : "Ninguno"],
      ["Recibido", new Date().toLocaleString("es-PE", { timeZone: "America/Lima" })],
    ],
    mensaje: { etiqueta: "Motivo", contenido: datos.motivo },
    nota: "Puedes responder directamente a este correo: la respuesta le llega al colega.",
  });

  const envio = await enviarCorreo({
    para: destino,
    asunto: `${esMentoria ? "Mentoría" : "Derivación"} · ${datos.colegaNombre} → ${datos.pacienteNombre}`,
    html,
    texto,
    responderA: datos.colegaCorreo,
    adjuntos,
  });

  if (!envio.enviado) {
    return NextResponse.json(
      {
        ok: false,
        mensaje:
          "No pudimos registrar la derivación en este momento. Escríbenos por WhatsApp o envía la radiografía por correo.",
      },
      { status: 502 },
    );
  }

  return NextResponse.json({
    ok: true,
    mensaje: esMentoria
      ? "Recibimos tu solicitud. Te contactamos para coordinar."
      : "Recibimos la derivación. Te confirmamos la cita del paciente y te mantenemos informado del caso.",
  });
}

/**
 * Limpia el nombre del archivo antes de adjuntarlo.
 * Una radiografía puede llegar con acentos, espacios o rutas dentro del
 * nombre; el correo debe salir con algo predecible.
 */
function nombreSeguro(nombre: string): string {
  const base = nombre.split(/[\\/]/).pop() ?? "archivo";
  return base
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-zA-Z0-9._-]/g, "_")
    .slice(0, 100);
}
