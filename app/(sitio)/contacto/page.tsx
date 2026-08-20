import type { Metadata } from "next";

import { ContactForm } from "@/components/ContactForm";
import { IconoCorreo, IconoTelefono, IconoUbicacion, IconoWhatsApp } from "@/components/Iconos";
import { Contenedor, Seccion, TituloSeccion } from "@/components/Seccion";
import {
  esquemaClinica,
  esquemaMigas,
  StructuredData,
} from "@/components/StructuredData";
import { construirMetadatos } from "@/lib/metadatos";
import { RUTAS } from "@/lib/rutas";
import {
  AJUSTES_RESPALDO,
  enlaceTelefono,
  enlaceWhatsApp,
  nombreDia,
  rangoHorario,
} from "@/lib/sitio";
import { consultar } from "@/sanity/client";
import { AJUSTES_SITIO, ESPECIALIDADES_INDICE } from "@/sanity/queries";
import type { AjustesSitio, EspecialidadResumen } from "@/types/contenido";

/**
 * Contacto: mapa, horarios y formulario.
 *
 * Es la única ruta donde la StickyBookingBar se oculta: llamar, escribir y
 * el formulario ya están en pantalla, y la barra solo taparía contenido.
 */

export const revalidate = 300;

export function generateMetadata(): Metadata {
  return construirMetadatos({
    ruta: RUTAS.contacto,
    tituloRespaldo: "Contacto",
    descripcionRespaldo:
      "Dirección, horarios de atención y formulario de contacto de la clínica.",
    etiquetaOg: "Contacto",
  });
}

export default async function PaginaContacto() {
  const [ajustesCrudos, especialidades] = await Promise.all([
    consultar<AjustesSitio | null>(AJUSTES_SITIO, null, {}, {
      etiquetas: ["ajustesSitio"],
    }),
    consultar<EspecialidadResumen[]>(ESPECIALIDADES_INDICE, [], {}, {
      etiquetas: ["especialidad"],
    }),
  ]);

  const ajustes = { ...AJUSTES_RESPALDO, ...(ajustesCrudos ?? {}) };
  const tel = enlaceTelefono(ajustes.telefono);
  const wa = enlaceWhatsApp(ajustes.whatsapp, "Hola, quisiera reservar una cita.");
  const horarios = ajustes.horarios ?? [];

  return (
    <>
      <StructuredData
        datos={[
          esquemaClinica(ajustes),
          esquemaMigas([
            { nombre: "Inicio", ruta: RUTAS.inicio },
            { nombre: "Contacto", ruta: RUTAS.contacto },
          ]),
        ]}
      />

      <Seccion>
        <Contenedor>
          <TituloSeccion
            nivel={1}
            descripcion="Escríbenos, llámanos o ven directamente. Respondemos dentro del horario de atención."
          >
            Contacto
          </TituloSeccion>

          <div className="grid gap-12 lg:grid-cols-2">
            {/* ── Datos ─────────────────────────────────────────────── */}
            <div className="flex flex-col gap-8">
              <div className="flex flex-col gap-4">
                {ajustes.direccion ? (
                  <div className="flex items-start gap-3">
                    <IconoUbicacion className="mt-0.5 shrink-0 text-lg text-marca-500" />
                    <div>
                      <p className="font-cuerpo text-sm font-medium text-tinta">
                        {ajustes.direccion}
                      </p>
                      {ajustes.oficina ? (
                        <p className="font-cuerpo text-sm text-suave">{ajustes.oficina}</p>
                      ) : null}
                      <p className="font-cuerpo text-sm text-suave">
                        {[ajustes.distrito, ajustes.ciudad].filter(Boolean).join(", ")}
                      </p>
                      {ajustes.googleMapsUrl ? (
                        <a
                          href={ajustes.googleMapsUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-1 inline-block font-cuerpo text-sm text-marca-700 underline underline-offset-4 hover:text-marca-900"
                        >
                          Cómo llegar
                        </a>
                      ) : null}
                    </div>
                  </div>
                ) : null}

                {tel ? (
                  <a
                    href={tel}
                    className="flex items-center gap-3 font-cuerpo text-sm text-marca-700 hover:text-marca-900"
                  >
                    <IconoTelefono className="shrink-0 text-lg text-marca-500" />
                    {ajustes.telefono}
                  </a>
                ) : null}

                {wa ? (
                  <a
                    href={wa}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 font-cuerpo text-sm text-marca-700 hover:text-marca-900"
                  >
                    <IconoWhatsApp className="shrink-0 text-lg text-marca-500" />
                    Escribir por WhatsApp
                  </a>
                ) : null}

                {ajustes.correoNotificaciones ? (
                  <a
                    href={`mailto:${ajustes.correoNotificaciones}`}
                    className="flex items-center gap-3 font-cuerpo text-sm text-marca-700 hover:text-marca-900"
                  >
                    <IconoCorreo className="shrink-0 text-lg text-marca-500" />
                    {ajustes.correoNotificaciones}
                  </a>
                ) : null}
              </div>

              {/* Horarios */}
              {horarios.length > 0 ? (
                <div>
                  <h2 className="font-display text-base font-semibold text-marca-900">
                    Horarios de atención
                  </h2>
                  <dl className="mt-3 max-w-xs space-y-1.5">
                    {horarios.map((horario, i) => (
                      <div
                        key={horario._key ?? i}
                        className="flex justify-between gap-4 font-cuerpo text-sm"
                      >
                        <dt className="text-tinta">{nombreDia(horario.dia)}</dt>
                        <dd className="text-suave">{rangoHorario(horario)}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              ) : null}

              {/* Mapa */}
              {ajustes.googleMapsEmbed ? (
                <div className="overflow-hidden rounded-card border border-linea">
                  <iframe
                    src={ajustes.googleMapsEmbed}
                    title="Ubicación de la clínica en Google Maps"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="h-72 w-full border-0"
                  />
                </div>
              ) : (
                <div className="flex h-72 items-center justify-center rounded-card border border-dashed border-linea bg-fondo-alt">
                  <p className="px-4 text-center font-cuerpo text-sm text-suave">
                    Mapa pendiente de configurar.
                  </p>
                </div>
              )}
            </div>

            {/* ── Formulario ────────────────────────────────────────── */}
            <div>
              <h2 className="font-display text-xl font-semibold text-marca-900">
                Escríbenos
              </h2>
              <p className="mb-6 mt-2 font-cuerpo text-sm text-suave">
                Te respondemos dentro del horario de atención.
              </p>

              <ContactForm especialidades={especialidades} origen="pagina_contacto" />
            </div>
          </div>
        </Contenedor>
      </Seccion>
    </>
  );
}
