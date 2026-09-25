import { ImagenSanity } from "@/components/ImagenSanity";
import { cx } from "@/lib/clases";
import type { AjustesSitio } from "@/types/contenido";

/**
 * LOGO CENTRALIZADO DE ARIETANOONA.
 *
 * El logo está en validación con pacientes. Para que cuando se apruebe
 * el cambio tome minutos y no horas:
 *
 *   1. Toda la web pasa por este único componente.
 *   2. Si Sanity tiene subido el archivo (SVG / imagen) para la variante,
 *      se renderiza automáticamente sin tocar código.
 *   3. Mientras no exista archivo, muestra el marcador de posición
 *      evidente con el texto legal "ArietaNoova" sin inventar símbolos.
 *   4. Aplica siempre `white-space: nowrap` para que nunca se rompa.
 */

export interface LogoProps {
  variant?: "principal" | "invertido" | "isotipo";
  ajustes?: AjustesSitio;
  className?: string;
  tamano?: "sm" | "md" | "lg";
}

export function Logo({
  variant = "principal",
  ajustes,
  className,
  tamano = "md",
}: LogoProps) {
  const imagen =
    variant === "invertido"
      ? ajustes?.logoInvertido ?? ajustes?.logoPrincipal
      : variant === "isotipo"
        ? ajustes?.isotipo
        : ajustes?.logoPrincipal;

  const tieneImagen = Boolean(imagen?.asset?._ref);

  const tamanosClase = {
    sm: "h-7 text-base sm:text-lg",
    md: "h-9 text-lg sm:text-xl",
    lg: "h-12 text-2xl sm:text-3xl",
  };

  if (tieneImagen && imagen) {
    if (variant === "isotipo") {
      return (
        <span
          className={cx(
            "relative inline-flex items-center justify-center shrink-0",
            tamano === "sm" && "h-7 w-7",
            tamano === "md" && "h-9 w-9",
            tamano === "lg" && "h-12 w-12",
            className,
          )}
        >
          <ImagenSanity
            imagen={imagen}
            alt={ajustes?.nombreClinica ?? "ArietaNoova"}
            ancho={64}
            alto={64}
            className="h-full w-full object-contain"
          />
        </span>
      );
    }

    return (
      <span
        className={cx(
          "relative inline-flex items-center shrink-0",
          tamanosClase[tamano],
          className,
        )}
      >
        <ImagenSanity
          imagen={imagen}
          alt={ajustes?.nombreClinica ?? "ArietaNoova"}
          ancho={240}
          alto={60}
          className="h-full w-auto object-contain"
        />
      </span>
    );
  }

  // Marcador de posición textual oficial mientras se valida el logo con pacientes.
  if (variant === "isotipo") {
    return (
      <span
        className={cx(
          "inline-flex items-center justify-center rounded-boton font-display font-bold tracking-tight select-none",
          tamano === "sm" && "h-7 w-7 text-xs",
          tamano === "md" && "h-9 w-9 text-sm",
          tamano === "lg" && "h-12 w-12 text-base",
          "bg-bosque text-blanco",
          className,
        )}
        style={{ whiteSpace: "nowrap" }}
        aria-label={ajustes?.nombreClinica ?? "ArietaNoova"}
      >
        AN
      </span>
    );
  }

  return (
    <span
      className={cx(
        "inline-flex items-center gap-2.5 font-display font-semibold tracking-tight transition-colors ease-suave select-none",
        tamanosClase[tamano],
        variant === "invertido" ? "text-blanco" : "text-marca-900",
        className,
      )}
      style={{ whiteSpace: "nowrap" }}
    >
      <span
        className={cx(
          "flex h-7 w-7 shrink-0 items-center justify-center rounded-pastilla border text-xs font-bold transition-transform group-hover:scale-105",
          variant === "invertido"
            ? "border-blanco/30 bg-blanco/15 text-oro"
            : "border-marca-900/15 bg-marca-900 text-blanco shadow-sm",
        )}
      >
        AN
      </span>
      <span className="flex items-baseline">
        <span className={variant === "invertido" ? "text-blanco" : "text-marca-900"}>Arieta</span>
        <span
          className={cx(
            "ml-1 font-bold",
            variant === "invertido" ? "text-oro" : "text-marca-500",
          )}
        >
          Noova
        </span>
      </span>
    </span>
  );
}
