"use client";

import { useId } from "react";

import { cx } from "@/lib/clases";

/**
 * Campos de formulario.
 *
 * Todos comparten el mismo contrato de accesibilidad, que es donde se
 * suelen perder puntos de Lighthouse y, más importante, donde un usuario
 * de lector de pantalla se queda sin saber qué está mal:
 *   - <label> asociado por id real, nunca por posición.
 *   - aria-invalid y aria-describedby cuando hay error.
 *   - El mensaje de error va en un role="alert" para que se anuncie solo.
 *   - El asterisco de obligatorio es decorativo; lo que informa es `required`.
 */

interface PropsBase {
  etiqueta: string;
  nombre: string;
  error?: string;
  ayuda?: string;
  requerido?: boolean;
  className?: string;
}

function Envoltura({
  etiqueta,
  id,
  error,
  ayuda,
  requerido,
  className,
  children,
}: PropsBase & { id: string; children: React.ReactNode }) {
  return (
    <div className={cx("flex flex-col gap-1.5", className)}>
      <label htmlFor={id} className="font-cuerpo text-sm font-medium text-tinta">
        {etiqueta}
        {requerido ? (
          <span className="text-error" aria-hidden="true">
            {" *"}
          </span>
        ) : null}
      </label>

      {ayuda ? (
        <p id={`${id}-ayuda`} className="font-cuerpo text-xs text-suave">
          {ayuda}
        </p>
      ) : null}

      {children}

      {error ? (
        <p
          id={`${id}-error`}
          role="alert"
          className="font-cuerpo text-xs font-medium text-error"
        >
          {error}
        </p>
      ) : null}
    </div>
  );
}

const CLASES_CONTROL =
  "w-full rounded-boton border bg-fondo px-3 py-2.5 font-cuerpo text-base text-tinta " +
  "placeholder:text-suave transition-colors ease-suave " +
  "focus:border-marca-500 focus:outline-none";

function bordeSegunError(error?: string) {
  return error ? "border-error" : "border-linea";
}

function descrito(id: string, error?: string, ayuda?: string) {
  return [ayuda ? `${id}-ayuda` : null, error ? `${id}-error` : null]
    .filter(Boolean)
    .join(" ") || undefined;
}

// ── Entrada de texto ─────────────────────────────────────────────────────

export function CampoTexto({
  etiqueta,
  nombre,
  error,
  ayuda,
  requerido,
  className,
  ...props
}: PropsBase & Omit<React.InputHTMLAttributes<HTMLInputElement>, "name" | "id">) {
  const id = `${nombre}-${useId()}`;

  return (
    <Envoltura
      etiqueta={etiqueta}
      nombre={nombre}
      id={id}
      error={error}
      ayuda={ayuda}
      requerido={requerido}
      className={className}
    >
      <input
        {...props}
        id={id}
        name={nombre}
        required={requerido}
        aria-invalid={error ? true : undefined}
        aria-describedby={descrito(id, error, ayuda)}
        className={cx(CLASES_CONTROL, bordeSegunError(error))}
      />
    </Envoltura>
  );
}

// ── Área de texto ────────────────────────────────────────────────────────

export function CampoArea({
  etiqueta,
  nombre,
  error,
  ayuda,
  requerido,
  className,
  ...props
}: PropsBase &
  Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, "name" | "id">) {
  const id = `${nombre}-${useId()}`;

  return (
    <Envoltura
      etiqueta={etiqueta}
      nombre={nombre}
      id={id}
      error={error}
      ayuda={ayuda}
      requerido={requerido}
      className={className}
    >
      <textarea
        {...props}
        id={id}
        name={nombre}
        rows={props.rows ?? 5}
        required={requerido}
        aria-invalid={error ? true : undefined}
        aria-describedby={descrito(id, error, ayuda)}
        className={cx(CLASES_CONTROL, "resize-y", bordeSegunError(error))}
      />
    </Envoltura>
  );
}

// ── Lista desplegable ────────────────────────────────────────────────────

export function CampoSelect({
  etiqueta,
  nombre,
  error,
  ayuda,
  requerido,
  className,
  opciones,
  placeholder = "Selecciona una opción",
  ...props
}: PropsBase &
  Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "name" | "id"> & {
    opciones: Array<{ valor: string; etiqueta: string }>;
    placeholder?: string;
  }) {
  const id = `${nombre}-${useId()}`;

  return (
    <Envoltura
      etiqueta={etiqueta}
      nombre={nombre}
      id={id}
      error={error}
      ayuda={ayuda}
      requerido={requerido}
      className={className}
    >
      <select
        {...props}
        id={id}
        name={nombre}
        required={requerido}
        aria-invalid={error ? true : undefined}
        aria-describedby={descrito(id, error, ayuda)}
        className={cx(CLASES_CONTROL, bordeSegunError(error))}
      >
        <option value="">{placeholder}</option>
        {opciones.map((opcion) => (
          <option key={opcion.valor} value={opcion.valor}>
            {opcion.etiqueta}
          </option>
        ))}
      </select>
    </Envoltura>
  );
}

// ── Casilla ──────────────────────────────────────────────────────────────

export function CampoCasilla({
  etiqueta,
  nombre,
  error,
  requerido,
  className,
  ...props
}: Omit<PropsBase, "ayuda"> &
  Omit<React.InputHTMLAttributes<HTMLInputElement>, "name" | "id" | "type">) {
  const id = `${nombre}-${useId()}`;

  return (
    <div className={cx("flex flex-col gap-1.5", className)}>
      <div className="flex items-start gap-3">
        <input
          {...props}
          type="checkbox"
          id={id}
          name={nombre}
          required={requerido}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-error` : undefined}
          className="mt-1 h-4 w-4 shrink-0 rounded-boton border-linea accent-marca-700"
        />
        <label htmlFor={id} className="font-cuerpo text-sm leading-relaxed text-tinta">
          {etiqueta}
        </label>
      </div>

      {error ? (
        <p
          id={`${id}-error`}
          role="alert"
          className="font-cuerpo text-xs font-medium text-error"
        >
          {error}
        </p>
      ) : null}
    </div>
  );
}

// ── Honeypot ─────────────────────────────────────────────────────────────

/**
 * Campo trampa. Invisible para las personas (fuera de pantalla, sin tabulación
 * y oculto a los lectores) pero presente en el DOM, que es lo que rellenan
 * los robots que envían formularios automáticamente.
 *
 * No se usa `display:none`: los robots más simples lo detectan.
 */
export function CampoTrampa() {
  return (
    <div
      aria-hidden="true"
      className="absolute left-[-9999px] top-0 h-0 w-0 overflow-hidden"
    >
      <label htmlFor="sitioWeb">No rellenar este campo</label>
      <input
        type="text"
        id="sitioWeb"
        name="sitioWeb"
        tabIndex={-1}
        autoComplete="off"
        defaultValue=""
      />
    </div>
  );
}

// ── Mensaje de resultado ─────────────────────────────────────────────────

export function MensajeResultado({
  estado,
  mensaje,
}: {
  estado: "exito" | "error";
  mensaje: string;
}) {
  return (
    <p
      role={estado === "error" ? "alert" : "status"}
      className={cx(
        "rounded-boton border px-4 py-3 font-cuerpo text-sm",
        estado === "exito"
          ? "border-exito text-exito"
          : "border-error text-error",
      )}
    >
      {mensaje}
    </p>
  );
}
