import Link from "next/link";

import { IconoCorreo, IconoTelefono, IconoUbicacion } from "@/components/Iconos";
import { Logo } from "@/components/Logo";
import { NAVEGACION_PIE, NAVEGACION_PRINCIPAL, RUTAS } from "@/lib/rutas";
import { enlaceTelefono, nombreDia, rangoHorario } from "@/lib/sitio";
import type { AjustesSitio } from "@/types/contenido";

/**
 * SiteFooter — dirección con oficina, horarios, enlaces y redes.
 *
 * Es componente de servidor: no lleva estado ni eventos, así que no hay
 * razón para enviar su JavaScript al navegador.
 *
 * La oficina (Of. 204) va siempre junto a la dirección. Es el dato que
 * hace la diferencia entre que el paciente llegue o dé vueltas por el
 * edificio.
 */
export function SiteFooter({ ajustes }: { ajustes: AjustesSitio }) {
  const tel = enlaceTelefono(ajustes.telefono);
  const horarios = ajustes.horarios ?? [];
  const redes = ajustes.redes ?? [];
  const anio = new Date().getFullYear();

  const enlaces = [
    ...NAVEGACION_PRINCIPAL.filter((e) => !e.fase2),
    ...NAVEGACION_PIE,
  ];

  return (
    <footer className="border-t border-linea bg-fondo-alt">
      <div className="mx-auto max-w-6xl px-4 py-seccion sm:px-6">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Identidad y dirección */}
          <div className="lg:col-span-1">
            <div className="mb-3">
              <Logo variant="principal" ajustes={ajustes} />
            </div>

            {ajustes.direccion || ajustes.oficina ? (
              <p className="mt-4 flex items-start gap-2 font-cuerpo text-sm text-suave">
                <IconoUbicacion className="mt-0.5 shrink-0 text-base text-marca-500" />
                <span>
                  {ajustes.direccion}
                  {ajustes.oficina ? (
                    <>
                      <br />
                      {ajustes.oficina}
                    </>
                  ) : null}
                  {ajustes.distrito ? (
                    <>
                      <br />
                      {ajustes.distrito}
                      {ajustes.ciudad ? `, ${ajustes.ciudad}` : null}
                    </>
                  ) : null}
                </span>
              </p>
            ) : null}

            {tel ? (
              <p className="mt-3">
                <a
                  href={tel}
                  className="inline-flex items-center gap-2 font-cuerpo text-sm text-marca-700 hover:text-marca-900"
                >
                  <IconoTelefono className="text-base" />
                  {ajustes.telefono}
                </a>
              </p>
            ) : null}

            {ajustes.correoNotificaciones ? (
              <p className="mt-2">
                <a
                  href={`mailto:${ajustes.correoNotificaciones}`}
                  className="inline-flex items-center gap-2 font-cuerpo text-sm text-marca-700 hover:text-marca-900"
                >
                  <IconoCorreo className="text-base" />
                  {ajustes.correoNotificaciones}
                </a>
              </p>
            ) : null}
          </div>

          {/* Horarios */}
          <div>
            <h2 className="font-display text-sm font-semibold uppercase tracking-wide text-marca-900">
              Horarios
            </h2>
            {horarios.length > 0 ? (
              <dl className="mt-4 space-y-1.5">
                {horarios.map((horario, i) => (
                  <div
                    key={horario._key ?? `${horario.dia}-${i}`}
                    className="flex justify-between gap-4 font-cuerpo text-sm"
                  >
                    <dt className="text-tinta">{nombreDia(horario.dia)}</dt>
                    <dd className="text-suave">{rangoHorario(horario)}</dd>
                  </div>
                ))}
              </dl>
            ) : (
              <p className="mt-4 font-cuerpo text-sm text-suave">
                Horarios por confirmar.
              </p>
            )}
          </div>

          {/* Secciones */}
          <div>
            <h2 className="font-display text-sm font-semibold uppercase tracking-wide text-marca-900">
              Secciones
            </h2>
            <ul className="mt-4 space-y-2">
              {enlaces.map((entrada) => (
                <li key={entrada.href}>
                  <Link
                    href={entrada.href}
                    className="font-cuerpo text-sm text-suave hover:text-marca-700"
                  >
                    {entrada.etiqueta}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Mapa y redes */}
          <div>
            <h2 className="font-display text-sm font-semibold uppercase tracking-wide text-marca-900">
              Cómo llegar
            </h2>

            {ajustes.googleMapsUrl ? (
              <p className="mt-4">
                <a
                  href={ajustes.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-cuerpo text-sm text-marca-700 underline underline-offset-4 hover:text-marca-900"
                >
                  Ver en Google Maps
                </a>
              </p>
            ) : (
              <p className="mt-4 font-cuerpo text-sm text-suave">
                Ubicación por confirmar.
              </p>
            )}

            {redes.length > 0 ? (
              <ul className="mt-5 flex flex-wrap gap-3">
                {redes.map((red, i) => (
                  <li key={red._key ?? `${red.plataforma}-${i}`}>
                    <a
                      href={red.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-cuerpo text-sm capitalize text-marca-700 hover:text-marca-900"
                    >
                      {red.plataforma}
                    </a>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-linea pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-cuerpo text-xs text-suave">
            © {anio} {ajustes.nombreClinica ?? "ArietaNoova"}. Todos los derechos reservados.
          </p>
          <p className="font-cuerpo text-xs text-suave">
            <Link href={RUTAS.paraOdontologos} className="hover:text-marca-700">
              ¿Eres odontólogo? Deriva un paciente
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
