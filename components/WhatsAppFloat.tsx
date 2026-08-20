"use client";

import { usePathname } from "next/navigation";

import { IconoWhatsApp } from "@/components/Iconos";
import { EVENTOS, normalizarOrigen, registrarEvento } from "@/lib/analitica";
import { enlaceWhatsApp } from "@/lib/sitio";
import type { AjustesSitio } from "@/types/contenido";

/**
 * WhatsAppFloat — botón flotante con mensaje prellenado según la ruta.
 *
 * El mensaje cambia con la sección porque quien escribe desde la página de
 * endodoncia no pregunta lo mismo que quien llega desde la portada; llegar
 * con el contexto ya escrito le ahorra a recepción la primera pregunta.
 *
 * Es microcopy de interfaz, no contenido clínico: no describe tratamientos
 * ni promete nada, solo abre la conversación.
 */

const MENSAJES: Array<{ prefijo: string; mensaje: string }> = [
  {
    prefijo: "/especialidades/",
    mensaje: "Hola, vi la página de una especialidad en la web y quisiera consultar sobre mi caso.",
  },
  {
    prefijo: "/especialidades",
    mensaje: "Hola, quisiera saber qué especialidad necesito.",
  },
  {
    prefijo: "/evaluacion-matutina",
    mensaje: "Hola, quisiera reservar la evaluación matutina.",
  },
  {
    prefijo: "/para-odontologos",
    mensaje: "Hola, soy odontólogo y quisiera derivar un paciente.",
  },
  {
    prefijo: "/equipo",
    mensaje: "Hola, quisiera agendar una cita con un especialista.",
  },
  {
    prefijo: "/tecnologia",
    mensaje: "Hola, quisiera información sobre el escaneo intraoral.",
  },
  {
    prefijo: "/problemas",
    mensaje: "Hola, tengo una molestia y quisiera saber con quién debo atenderme.",
  },
  {
    prefijo: "/casos",
    mensaje: "Hola, vi los casos en la web y quisiera consultar por el mío.",
  },
];

const MENSAJE_POR_DEFECTO = "Hola, quisiera información sobre una cita.";

function mensajeParaRuta(ruta: string): string {
  const coincidencia = MENSAJES.find((m) => ruta.startsWith(m.prefijo));
  return coincidencia?.mensaje ?? MENSAJE_POR_DEFECTO;
}

export function WhatsAppFloat({ ajustes }: { ajustes: AjustesSitio }) {
  const ruta = usePathname();

  if (ruta.startsWith("/studio")) return null;

  const href = enlaceWhatsApp(ajustes.whatsapp, mensajeParaRuta(ruta));
  if (!href) return null;

  const origen = normalizarOrigen(`flotante${ruta === "/" ? "_portada" : ruta}`);

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => registrarEvento(EVENTOS.clicWhatsapp, { origen })}
      aria-label="Escribir por WhatsApp"
      // bottom-24 en móvil deja libre la StickyBookingBar; en escritorio baja.
      className="fixed bottom-24 right-4 z-30 flex h-14 w-14 items-center justify-center rounded-pastilla bg-marca-500 text-fondo shadow-flotante transition-transform duration-200 ease-suave hover:scale-105 lg:bottom-6 lg:right-6"
    >
      <IconoWhatsApp className="text-2xl" />
    </a>
  );
}
