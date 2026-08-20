import { NextResponse } from "next/server";
import { z } from "zod";

import { comprobarLimite, ipDePeticion } from "@/lib/limite";
import { EVENTOS } from "@/lib/analitica";

/**
 * POST /api/track — punto único de analítica del lado del servidor.
 *
 * Hoy solo escribe en el registro del servidor: GA4 ya recibe los eventos
 * desde el navegador. Existe porque el sprint pide dejarlo preparado "por
 * si después se agrega otro destino" (Meta, un webhook, una hoja de
 * cálculo), y añadirlo entonces será tocar solo este archivo.
 *
 * Nunca falla hacia el cliente: la analítica no puede romper una reserva.
 * Ante cualquier problema responde 204.
 */

export const runtime = "nodejs";

const NOMBRES_VALIDOS = Object.values(EVENTOS) as [string, ...string[]];

const esquema = z.object({
  nombre: z.enum(NOMBRES_VALIDOS),
  ruta: z.string().max(300).optional(),
  propiedades: z
    .record(z.union([z.string(), z.number(), z.boolean()]))
    .optional()
    .default({}),
});

export async function POST(peticion: Request) {
  try {
    // Límite generoso: un paciente puede pulsar varios botones en una visita.
    const limite = comprobarLimite(`track:${ipDePeticion(peticion)}`, 60, 60 * 1000);
    if (!limite.permitido) return new NextResponse(null, { status: 204 });

    const cuerpo = await peticion.json();
    const resultado = esquema.safeParse(cuerpo);

    if (!resultado.success) return new NextResponse(null, { status: 204 });

    const { nombre, ruta, propiedades } = resultado.data;

    // Único destino por ahora. Aquí es donde se enchufan los siguientes.
    console.info("[evento]", {
      nombre,
      ruta,
      ...propiedades,
      momento: new Date().toISOString(),
    });

    return new NextResponse(null, { status: 204 });
  } catch {
    return new NextResponse(null, { status: 204 });
  }
}
