"use client";

import { useState } from "react";

import {
  CampoArea,
  CampoCasilla,
  CampoSelect,
  CampoTexto,
  CampoTrampa,
  MensajeResultado,
} from "@/components/campos/Campo";
import { EVENTOS, registrarEvento } from "@/lib/analitica";
import { erroresPorCampo, esquemaContacto } from "@/lib/validacion";

/**
 * ContactForm.
 *
 * Valida en el navegador con el mismo esquema Zod que usa el servidor, así
 * que el paciente ve el error antes de esperar el viaje de red, y el
 * servidor sigue validando igual (nunca se confía en el cliente).
 */

export interface ContactFormProps {
  /** Especialidades cargadas en Sanity, para el desplegable. */
  especialidades?: Array<{ nombre?: string; slug?: string }>;
  /** Preselección cuando se llega desde una especialidad concreta. */
  especialidadInicial?: string;
  origen?: string;
}

type Estado = "inactivo" | "enviando" | "exito" | "error";

export function ContactForm({
  especialidades = [],
  especialidadInicial = "",
  origen = "contacto",
}: ContactFormProps) {
  const [estado, setEstado] = useState<Estado>("inactivo");
  const [mensaje, setMensaje] = useState("");
  const [errores, setErrores] = useState<Record<string, string>>({});

  async function alEnviar(evento: React.FormEvent<HTMLFormElement>) {
    evento.preventDefault();

    const formulario = evento.currentTarget;
    const datos = Object.fromEntries(new FormData(formulario));

    // El navegador manda "on" para una casilla marcada; Zod espera true.
    const candidato = {
      ...datos,
      aceptaContacto: datos.aceptaContacto === "on" || datos.aceptaContacto === "true",
    };

    const validacion = esquemaContacto.safeParse(candidato);

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
      const respuesta = await fetch("/api/contacto", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validacion.data),
      });

      const cuerpo = (await respuesta.json()) as {
        ok: boolean;
        mensaje?: string;
        errores?: Record<string, string>;
      };

      if (!respuesta.ok || !cuerpo.ok) {
        setErrores(cuerpo.errores ?? {});
        setEstado("error");
        setMensaje(cuerpo.mensaje ?? "No pudimos enviar tu mensaje. Vuelve a intentarlo.");
        return;
      }

      registrarEvento(EVENTOS.envioContacto, {
        origen,
        variante: validacion.data.especialidad || "general",
      });

      setEstado("exito");
      setMensaje(cuerpo.mensaje ?? "Recibimos tu mensaje.");
      formulario.reset();
    } catch {
      setEstado("error");
      setMensaje(
        "No pudimos conectar con el servidor. Revisa tu conexión o escríbenos por WhatsApp.",
      );
    }
  }

  const opciones = especialidades
    .filter((e) => e.nombre)
    .map((e) => ({ valor: e.nombre!, etiqueta: e.nombre! }));

  return (
    <form onSubmit={alEnviar} noValidate className="relative flex flex-col gap-5">
      <CampoTrampa />

      <div className="grid gap-5 sm:grid-cols-2">
        <CampoTexto
          etiqueta="Nombre completo"
          nombre="nombre"
          type="text"
          autoComplete="name"
          requerido
          error={errores.nombre}
          placeholder="María Fernández"
        />

        <CampoTexto
          etiqueta="Teléfono"
          nombre="telefono"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          requerido
          error={errores.telefono}
          placeholder="987 654 321"
        />
      </div>

      <CampoTexto
        etiqueta="Correo electrónico"
        nombre="correo"
        type="email"
        inputMode="email"
        autoComplete="email"
        requerido
        error={errores.correo}
        placeholder="maria@correo.com"
      />

      {opciones.length > 0 ? (
        <CampoSelect
          etiqueta="Especialidad"
          nombre="especialidad"
          opciones={opciones}
          defaultValue={especialidadInicial}
          error={errores.especialidad}
          ayuda="Si no lo sabes, déjalo en blanco: te orientamos nosotros."
          placeholder="No estoy seguro"
        />
      ) : null}

      <CampoArea
        etiqueta="¿En qué podemos ayudarte?"
        nombre="motivo"
        requerido
        rows={5}
        error={errores.motivo}
        ayuda="Cuéntanos brevemente qué te pasa o qué necesitas."
      />

      <CampoCasilla
        etiqueta="Autorizo que me contacten por teléfono, WhatsApp o correo para responder a esta consulta."
        nombre="aceptaContacto"
        requerido
        error={errores.aceptaContacto}
      />

      {mensaje ? (
        <MensajeResultado estado={estado === "exito" ? "exito" : "error"} mensaje={mensaje} />
      ) : null}

      <button
        type="submit"
        disabled={estado === "enviando"}
        className="inline-flex items-center justify-center rounded-boton bg-marca-700 px-6 py-3 font-cuerpo font-semibold text-fondo shadow-card transition-colors duration-200 ease-suave hover:bg-marca-900 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {estado === "enviando" ? "Enviando…" : "Enviar consulta"}
      </button>
    </form>
  );
}
