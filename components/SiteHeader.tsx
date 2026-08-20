"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { BookingCTA } from "@/components/BookingCTA";
import { IconoCerrar, IconoMenu, IconoTelefono } from "@/components/Iconos";
import { EVENTOS, registrarEvento } from "@/lib/analitica";
import { cx } from "@/lib/clases";
import { NAVEGACION_PIE, NAVEGACION_PRINCIPAL, RUTAS } from "@/lib/rutas";
import { enlaceTelefono } from "@/lib/sitio";
import type { AjustesSitio } from "@/types/contenido";

/**
 * SiteHeader — navegación, menú lateral en móvil, teléfono y botón de
 * reserva siempre visibles.
 *
 * El 68% del tráfico es móvil, así que el teléfono y la reserva no se
 * esconden nunca dentro del menú: quedan en la barra, y el menú guarda
 * solo la navegación por secciones.
 */
export function SiteHeader({ ajustes }: { ajustes: AjustesSitio }) {
  const [menuAbierto, setMenuAbierto] = useState(false);
  const rutaActual = usePathname();
  const botonMenu = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);

  const tel = enlaceTelefono(ajustes.telefono);
  const entradas = NAVEGACION_PRINCIPAL.filter((e) => !e.fase2);

  // Cerrar al navegar.
  useEffect(() => {
    setMenuAbierto(false);
  }, [rutaActual]);

  // Escape cierra y devuelve el foco al botón que abrió: sin esto el
  // usuario de teclado queda atrapado.
  useEffect(() => {
    if (!menuAbierto) return;

    function alPulsar(evento: KeyboardEvent) {
      if (evento.key === "Escape") {
        setMenuAbierto(false);
        botonMenu.current?.focus();
      }
    }

    document.addEventListener("keydown", alPulsar);
    document.body.style.overflow = "hidden";

    // El primer elemento enfocable del panel recibe el foco al abrir.
    panel.current?.querySelector<HTMLElement>("a, button")?.focus();

    return () => {
      document.removeEventListener("keydown", alPulsar);
      document.body.style.overflow = "";
    };
  }, [menuAbierto]);

  function esActiva(href: string) {
    if (href === RUTAS.inicio) return rutaActual === RUTAS.inicio;
    return rutaActual.startsWith(href);
  }

  return (
    <header className="sticky top-0 z-40 border-b border-linea bg-fondo/95 backdrop-blur">
      <a
        href="#contenido"
        className="solo-lectores solo-lectores-enfocable absolute left-4 top-4 z-50 rounded-boton bg-marca-900 px-4 py-2 text-fondo"
      >
        Saltar al contenido
      </a>

      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link
          href={RUTAS.inicio}
          className="font-display text-lg font-semibold text-marca-900 sm:text-xl"
        >
          {ajustes.nombreClinica ?? "Arieta Noova"}
        </Link>

        <nav aria-label="Navegación principal" className="hidden lg:block">
          <ul className="flex items-center gap-6">
            {entradas.map((entrada) => (
              <li key={entrada.href}>
                <Link
                  href={entrada.href}
                  aria-current={esActiva(entrada.href) ? "page" : undefined}
                  className={cx(
                    "font-cuerpo text-sm transition-colors ease-suave",
                    esActiva(entrada.href)
                      ? "font-semibold text-marca-900"
                      : "text-suave hover:text-marca-700",
                  )}
                >
                  {entrada.etiqueta}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          {tel ? (
            <a
              href={tel}
              onClick={() =>
                registrarEvento(EVENTOS.clicLlamar, { origen: "encabezado" })
              }
              className="inline-flex items-center gap-2 rounded-boton px-2 py-2 font-cuerpo text-sm text-marca-700 transition-colors ease-suave hover:text-marca-900 sm:px-3"
            >
              <IconoTelefono className="text-base" />
              <span className="hidden sm:inline">{ajustes.telefono}</span>
              <span className="sm:hidden solo-lectores">Llamar por teléfono</span>
            </a>
          ) : null}

          <BookingCTA
            variant="reservar"
            origen="encabezado"
            tamano="sm"
            className="hidden sm:inline-flex"
          />

          <button
            ref={botonMenu}
            type="button"
            onClick={() => setMenuAbierto((abierto) => !abierto)}
            aria-expanded={menuAbierto}
            aria-controls="menu-lateral"
            className="rounded-boton p-2 text-marca-900 transition-colors ease-suave hover:bg-fondo-alt lg:hidden"
          >
            {menuAbierto ? (
              <IconoCerrar className="text-xl" titulo="Cerrar menú" />
            ) : (
              <IconoMenu className="text-xl" titulo="Abrir menú" />
            )}
          </button>
        </div>
      </div>

      {/* Menú lateral en móvil */}
      <div
        className={cx(
          "fixed inset-0 z-50 lg:hidden",
          menuAbierto ? "pointer-events-auto" : "pointer-events-none",
        )}
        aria-hidden={!menuAbierto}
      >
        <button
          type="button"
          tabIndex={menuAbierto ? 0 : -1}
          onClick={() => setMenuAbierto(false)}
          className={cx(
            "absolute inset-0 bg-tinta/40 transition-opacity duration-200 ease-suave",
            menuAbierto ? "opacity-100" : "opacity-0",
          )}
        >
          <span className="solo-lectores">Cerrar menú</span>
        </button>

        <div
          ref={panel}
          id="menu-lateral"
          role="dialog"
          aria-modal={menuAbierto}
          aria-label="Menú de navegación"
          className={cx(
            "absolute right-0 top-0 flex h-full w-80 max-w-[85vw] flex-col bg-fondo shadow-flotante",
            "transition-transform duration-300 ease-suave",
            menuAbierto ? "translate-x-0" : "translate-x-full",
          )}
        >
          <div className="flex items-center justify-between border-b border-linea px-5 py-4">
            <span className="font-display text-base text-marca-900">Menú</span>
            <button
              type="button"
              tabIndex={menuAbierto ? 0 : -1}
              onClick={() => {
                setMenuAbierto(false);
                botonMenu.current?.focus();
              }}
              className="rounded-boton p-2 text-marca-900 hover:bg-fondo-alt"
            >
              <IconoCerrar className="text-xl" titulo="Cerrar menú" />
            </button>
          </div>

          <nav aria-label="Navegación móvil" className="flex-1 overflow-y-auto px-5 py-4">
            <ul className="flex flex-col gap-1">
              {entradas.map((entrada) => (
                <li key={entrada.href}>
                  <Link
                    href={entrada.href}
                    tabIndex={menuAbierto ? 0 : -1}
                    aria-current={esActiva(entrada.href) ? "page" : undefined}
                    className={cx(
                      "block rounded-boton px-3 py-3 font-cuerpo text-base transition-colors ease-suave",
                      esActiva(entrada.href)
                        ? "bg-fondo-alt font-semibold text-marca-900"
                        : "text-tinta hover:bg-fondo-alt",
                    )}
                  >
                    {entrada.etiqueta}
                  </Link>
                </li>
              ))}

              <li className="mt-4 border-t border-linea pt-4">
                <ul className="flex flex-col gap-1">
                  {NAVEGACION_PIE.map((entrada) => (
                    <li key={entrada.href}>
                      <Link
                        href={entrada.href}
                        tabIndex={menuAbierto ? 0 : -1}
                        className="block rounded-boton px-3 py-3 font-cuerpo text-sm text-suave transition-colors ease-suave hover:bg-fondo-alt hover:text-marca-700"
                      >
                        {entrada.etiqueta}
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>
            </ul>
          </nav>

          <div className="border-t border-linea p-5">
            <BookingCTA variant="reservar" origen="menu_movil" ancho tamano="md" />
          </div>
        </div>
      </div>
    </header>
  );
}
