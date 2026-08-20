"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { IconoCalendario, IconoTelefono, IconoWhatsApp } from "@/components/Iconos";
import { conUtm, EVENTOS, normalizarOrigen, registrarEvento } from "@/lib/analitica";
import { RUTAS } from "@/lib/rutas";
import { enlaceTelefono, enlaceWhatsApp } from "@/lib/sitio";
import type { AjustesSitio } from "@/types/contenido";

/**
 * StickyBookingBar — barra inferior fija en móvil: llamar, WhatsApp, reservar.
 *
 * El 68% del tráfico es móvil y la clínica tiene 0 reservas en 6 meses de
 * ficha de Google. Esta barra es la respuesta más directa a ese hueco:
 * las tres acciones a un pulgar de distancia en toda la navegación.
 *
 * No aparece en el Studio ni en la propia página de contacto, donde
 * duplicaría lo que ya está en pantalla.
 */
export function StickyBookingBar({ ajustes }: { ajustes: AjustesSitio }) {
  const ruta = usePathname();

  if (ruta.startsWith("/studio") || ruta === RUTAS.contacto) return null;

  const origen = normalizarOrigen(`barra_movil${ruta === "/" ? "_portada" : ruta}`);
  const tel = enlaceTelefono(ajustes.telefono);
  const wa = enlaceWhatsApp(
    ajustes.whatsapp,
    "Hola, quisiera información sobre una cita.",
  );

  // El primer enlace de Doctocliq configurado es el destino de reserva.
  const reservaDirecta = ajustes.enlacesDoctocliq?.[0]?.url;
  const destinoReserva = reservaDirecta
    ? (conUtm(reservaDirecta, origen) ?? reservaDirecta)
    : RUTAS.contacto;
  const reservaEsExterna = Boolean(reservaDirecta);

  const claseBoton =
    "flex flex-1 flex-col items-center justify-center gap-1 py-2.5 font-cuerpo text-xs font-medium transition-colors ease-suave";

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-30 border-t border-linea bg-fondo shadow-flotante lg:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <nav aria-label="Acciones rápidas" className="mx-auto flex max-w-lg items-stretch">
        {tel ? (
          <a
            href={tel}
            onClick={() => registrarEvento(EVENTOS.clicLlamar, { origen })}
            className={`${claseBoton} text-marca-700 hover:bg-fondo-alt`}
          >
            <IconoTelefono className="text-xl" />
            Llamar
          </a>
        ) : null}

        {wa ? (
          <a
            href={wa}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => registrarEvento(EVENTOS.clicWhatsapp, { origen })}
            className={`${claseBoton} border-x border-linea text-marca-700 hover:bg-fondo-alt`}
          >
            <IconoWhatsApp className="text-xl" />
            WhatsApp
          </a>
        ) : null}

        {reservaEsExterna ? (
          <a
            href={destinoReserva}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() =>
              registrarEvento(EVENTOS.clicReservar, { origen, variante: "reservar" })
            }
            className={`${claseBoton} bg-marca-700 text-fondo hover:bg-marca-900`}
          >
            <IconoCalendario className="text-xl" />
            Reservar
          </a>
        ) : (
          <Link
            href={destinoReserva}
            onClick={() =>
              registrarEvento(EVENTOS.clicReservar, { origen, variante: "reservar" })
            }
            className={`${claseBoton} bg-marca-700 text-fondo hover:bg-marca-900`}
          >
            <IconoCalendario className="text-xl" />
            Reservar
          </Link>
        )}
      </nav>
    </div>
  );
}
