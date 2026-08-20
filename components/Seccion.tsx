import { cx } from "@/lib/clases";

/**
 * Primitivas de maquetación.
 *
 * Existen para que ninguna página invente su propio ancho máximo ni su
 * propio ritmo vertical: los dos salen de tokens.
 */

export function Contenedor({
  children,
  className,
  ancho = "normal",
}: {
  children: React.ReactNode;
  className?: string;
  ancho?: "estrecho" | "normal" | "ancho";
}) {
  const anchos = {
    estrecho: "max-w-3xl",
    normal: "max-w-6xl",
    ancho: "max-w-7xl",
  } as const;

  return (
    <div className={cx("mx-auto w-full px-4 sm:px-6", anchos[ancho], className)}>
      {children}
    </div>
  );
}

export function Seccion({
  children,
  className,
  fondo = "normal",
  id,
  aria,
}: {
  children: React.ReactNode;
  className?: string;
  fondo?: "normal" | "alt";
  id?: string;
  aria?: string;
}) {
  return (
    <section
      id={id}
      aria-label={aria}
      className={cx(
        "py-seccion lg:py-seccion-lg",
        fondo === "alt" ? "bg-fondo-alt" : "bg-fondo",
        className,
      )}
    >
      {children}
    </section>
  );
}

export function TituloSeccion({
  children,
  descripcion,
  nivel = 2,
  alineado = "izquierda",
  className,
}: {
  children: React.ReactNode;
  descripcion?: string;
  nivel?: 1 | 2 | 3;
  alineado?: "izquierda" | "centro";
  className?: string;
}) {
  const Etiqueta = `h${nivel}` as "h1" | "h2" | "h3";
  const tamanos = {
    1: "text-3xl sm:text-4xl lg:text-5xl",
    2: "text-2xl sm:text-3xl",
    3: "text-xl sm:text-2xl",
  } as const;

  return (
    <div
      className={cx(
        "mb-10",
        alineado === "centro" && "text-center",
        className,
      )}
    >
      <Etiqueta className={cx("font-display font-semibold", tamanos[nivel])}>
        {children}
      </Etiqueta>
      {descripcion ? (
        <p
          className={cx(
            "mt-4 font-cuerpo text-base text-suave sm:text-lg",
            alineado === "centro" ? "mx-auto max-w-2xl" : "max-w-2xl",
          )}
        >
          {descripcion}
        </p>
      ) : null}
    </div>
  );
}

/**
 * Estado vacío controlado.
 *
 * Regla del sprint: no se inventa contenido clínico. Donde falte, el
 * componente renderiza desde el CMS con un estado vacío explícito. Este
 * es ese estado, y su texto es microcopy de interfaz, no contenido.
 */
export function EstadoVacio({
  titulo,
  detalle,
  className,
}: {
  titulo: string;
  detalle?: string;
  className?: string;
}) {
  return (
    <div
      className={cx(
        "rounded-card border border-dashed border-linea bg-fondo-alt px-6 py-12 text-center",
        className,
      )}
    >
      <p className="font-display text-base text-marca-700">{titulo}</p>
      {detalle ? (
        <p className="mx-auto mt-2 max-w-md font-cuerpo text-sm text-suave">{detalle}</p>
      ) : null}
    </div>
  );
}
