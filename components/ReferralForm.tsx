"use client";

import { useRef, useState } from "react";

import {
  CampoArea,
  CampoSelect,
  CampoTexto,
  CampoTrampa,
  MensajeResultado,
} from "@/components/campos/Campo";
import { EVENTOS, registrarEvento } from "@/lib/analitica";
import { cx } from "@/lib/clases";
import {
  erroresPorCampo,
  esquemaDerivacion,
  EXTENSIONES_ADJUNTO_PERMITIDAS,
  validarAdjunto,
} from "@/lib/validacion";

/**
 * ReferralForm — formulario de derivación para colegas.
 *
 * Va por multipart/form-data porque acepta radiografías. Los archivos se
 * validan en el navegador antes de subirlos: dejar que un colega suba
 * 40 MB de tomografía para que el servidor lo rechace después es la peor
 * versión de este flujo, sobre todo en una conexión móvil.
 */

const MAXIMO_ARCHIVOS = 6;

export interface ReferralFormProps {
  especialidades?: Array<{ nombre?: string }>;
  /** Muestra el selector derivación / mentoría. */
  permiteMentorias?: boolean;
  correoAlternativo?: string;
  origen?: string;
}

type Estado = "inactivo" | "enviando" | "exito" | "error";

export function ReferralForm({
  especialidades = [],
  permiteMentorias = false,
  correoAlternativo,
  origen = "derivacion",
}: ReferralFormProps) {
  const [estado, setEstado] = useState<Estado>("inactivo");
  const [mensaje, setMensaje] = useState("");
  const [errores, setErrores] = useState<Record<string, string>>({});
  const [archivos, setArchivos] = useState<File[]>([]);
  const entradaArchivos = useRef<HTMLInputElement>(null);

  function alElegirArchivos(evento: React.ChangeEvent<HTMLInputElement>) {
    const seleccion = Array.from(evento.target.files ?? []);

    if (seleccion.length > MAXIMO_ARCHIVOS) {
      setErrores((previos) => ({
        ...previos,
        radiografias: `Puedes adjuntar hasta ${MAXIMO_ARCHIVOS} archivos.`,
      }));
      return;
    }

    for (const archivo of seleccion) {
      const validacion = validarAdjunto(archivo);
      if (!validacion.valido) {
        setErrores((previos) => ({
          ...previos,
          radiografias: validacion.error ?? "Archivo no válido.",
        }));
        return;
      }
    }

    // Se limpia el error anterior de adjuntos ahora que la selección es válida.
    setErrores((previos) => {
      if (!previos.radiografias) return previos;
      const resto = { ...previos };
      delete resto.radiografias;
      return resto;
    });
    setArchivos(seleccion);
  }

  async function alEnviar(evento: React.FormEvent<HTMLFormElement>) {
    evento.preventDefault();

    const formulario = evento.currentTarget;
    const datosFormulario = new FormData(formulario);

    const campos = Object.fromEntries(
      Array.from(datosFormulario.entries()).filter(
        ([clave, valor]) => typeof valor === "string" && clave !== "radiografias",
      ),
    );

    const validacion = esquemaDerivacion.safeParse(campos);

    if (!validacion.success) {
      setErrores(erroresPorCampo(validacion.error));
      setEstado("error");
      setMensaje("Revisa los campos marcados.");
      return;
    }

    setErrores({});
    setEstado("enviando");
    setMensaje("");

    try {
      const respuesta = await fetch("/api/derivacion", {
        method: "POST",
        body: datosFormulario,
      });

      const cuerpo = (await respuesta.json()) as {
        ok: boolean;
        mensaje?: string;
        errores?: Record<string, string>;
      };

      if (!respuesta.ok || !cuerpo.ok) {
        setErrores(cuerpo.errores ?? {});
        setEstado("error");
        setMensaje(
          cuerpo.mensaje ?? "No pudimos registrar la derivación. Vuelve a intentarlo.",
        );
        return;
      }

      registrarEvento(EVENTOS.envioDerivacion, {
        origen,
        variante: validacion.data.tipoSolicitud,
      });

      setEstado("exito");
      setMensaje(cuerpo.mensaje ?? "Recibimos la derivación.");
      formulario.reset();
      setArchivos([]);
    } catch {
      setEstado("error");
      setMensaje(
        correoAlternativo
          ? `No pudimos conectar con el servidor. Envía la derivación a ${correoAlternativo}.`
          : "No pudimos conectar con el servidor. Revisa tu conexión e inténtalo de nuevo.",
      );
    }
  }

  const opcionesEspecialidad = especialidades
    .filter((e) => e.nombre)
    .map((e) => ({ valor: e.nombre!, etiqueta: e.nombre! }));

  const aceptados = EXTENSIONES_ADJUNTO_PERMITIDAS.map((e) => `.${e}`).join(",");

  return (
    <form onSubmit={alEnviar} noValidate className="relative flex flex-col gap-8">
      <CampoTrampa />

      {permiteMentorias ? (
        <CampoSelect
          etiqueta="¿Qué necesitas?"
          nombre="tipoSolicitud"
          defaultValue="derivacion"
          placeholder="Selecciona"
          opciones={[
            { valor: "derivacion", etiqueta: "Derivar al paciente a la clínica" },
            { valor: "mentoria", etiqueta: "Asesoría para resolver el caso yo mismo" },
          ]}
          error={errores.tipoSolicitud}
        />
      ) : (
        <input type="hidden" name="tipoSolicitud" value="derivacion" />
      )}

      {/* ── Datos del colega ─────────────────────────────────────────── */}
      <fieldset className="flex flex-col gap-5">
        <legend className="mb-2 font-display text-base font-semibold text-marca-900">
          Tus datos
        </legend>

        <div className="grid gap-5 sm:grid-cols-2">
          <CampoTexto
            etiqueta="Nombre completo"
            nombre="colegaNombre"
            type="text"
            autoComplete="name"
            requerido
            error={errores.colegaNombre}
          />
          <CampoTexto
            etiqueta="Número de COP"
            nombre="colegaColegiatura"
            type="text"
            requerido
            error={errores.colegaColegiatura}
          />
          <CampoTexto
            etiqueta="Teléfono"
            nombre="colegaTelefono"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            requerido
            error={errores.colegaTelefono}
          />
          <CampoTexto
            etiqueta="Correo electrónico"
            nombre="colegaCorreo"
            type="email"
            inputMode="email"
            autoComplete="email"
            requerido
            error={errores.colegaCorreo}
          />
        </div>
      </fieldset>

      {/* ── Datos del paciente ───────────────────────────────────────── */}
      <fieldset className="flex flex-col gap-5">
        <legend className="mb-2 font-display text-base font-semibold text-marca-900">
          Datos del paciente
        </legend>

        <div className="grid gap-5 sm:grid-cols-3">
          <CampoTexto
            etiqueta="Nombre completo"
            nombre="pacienteNombre"
            type="text"
            requerido
            className="sm:col-span-2"
            error={errores.pacienteNombre}
          />
          <CampoTexto
            etiqueta="Edad"
            nombre="pacienteEdad"
            type="number"
            inputMode="numeric"
            min={0}
            max={120}
            error={errores.pacienteEdad}
          />
        </div>

        <CampoTexto
          etiqueta="Teléfono del paciente"
          nombre="pacienteTelefono"
          type="tel"
          inputMode="tel"
          requerido
          ayuda="Para coordinar la cita directamente con él."
          error={errores.pacienteTelefono}
        />
      </fieldset>

      {/* ── El caso ──────────────────────────────────────────────────── */}
      <fieldset className="flex flex-col gap-5">
        <legend className="mb-2 font-display text-base font-semibold text-marca-900">
          El caso
        </legend>

        {opcionesEspecialidad.length > 0 ? (
          <CampoSelect
            etiqueta="Especialidad que solicitas"
            nombre="especialidadSolicitada"
            opciones={opcionesEspecialidad}
            placeholder="No estoy seguro"
            error={errores.especialidadSolicitada}
          />
        ) : null}

        <CampoArea
          etiqueta="Motivo de la derivación"
          nombre="motivo"
          requerido
          rows={6}
          error={errores.motivo}
          ayuda="Diagnóstico presuntivo, tratamientos previos y qué esperas de la interconsulta."
        />

        {/* Adjuntos */}
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="radiografias"
            className="font-cuerpo text-sm font-medium text-tinta"
          >
            Radiografías u otros archivos
          </label>
          <p id="radiografias-ayuda" className="font-cuerpo text-xs text-suave">
            Hasta {MAXIMO_ARCHIVOS} archivos de 10 MB cada uno. Formatos: jpg, png, pdf y dcm.
          </p>

          <input
            ref={entradaArchivos}
            id="radiografias"
            name="radiografias"
            type="file"
            multiple
            accept={aceptados}
            onChange={alElegirArchivos}
            aria-describedby={
              errores.radiografias ? "radiografias-ayuda radiografias-error" : "radiografias-ayuda"
            }
            aria-invalid={errores.radiografias ? true : undefined}
            className={cx(
              "w-full rounded-boton border bg-fondo px-3 py-2.5 font-cuerpo text-sm text-tinta",
              "file:mr-4 file:rounded-boton file:border-0 file:bg-fondo-alt file:px-4 file:py-2",
              "file:font-cuerpo file:text-sm file:font-medium file:text-marca-700",
              errores.radiografias ? "border-error" : "border-linea",
            )}
          />

          {errores.radiografias ? (
            <p
              id="radiografias-error"
              role="alert"
              className="font-cuerpo text-xs font-medium text-error"
            >
              {errores.radiografias}
            </p>
          ) : null}

          {archivos.length > 0 ? (
            <ul className="mt-2 space-y-1">
              {archivos.map((archivo, i) => (
                <li key={i} className="font-cuerpo text-xs text-suave">
                  {archivo.name} · {(archivo.size / 1024 / 1024).toFixed(1)} MB
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </fieldset>

      {mensaje ? (
        <MensajeResultado estado={estado === "exito" ? "exito" : "error"} mensaje={mensaje} />
      ) : null}

      <div className="flex flex-col gap-3">
        <button
          type="submit"
          disabled={estado === "enviando"}
          className="inline-flex items-center justify-center rounded-boton bg-marca-700 px-6 py-3 font-cuerpo font-semibold text-fondo shadow-card transition-colors duration-200 ease-suave hover:bg-marca-900 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {estado === "enviando" ? "Enviando…" : "Enviar derivación"}
        </button>

        {correoAlternativo ? (
          <p className="font-cuerpo text-xs text-suave">
            ¿Prefieres el correo? Escríbenos a{" "}
            <a
              href={`mailto:${correoAlternativo}`}
              className="text-marca-700 underline underline-offset-4"
            >
              {correoAlternativo}
            </a>
          </p>
        ) : null}
      </div>
    </form>
  );
}
