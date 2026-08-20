import { ImagenSanity } from "@/components/ImagenSanity";
import { cx } from "@/lib/clases";
import { credenciales, etiquetaRne, tituloProfesional } from "@/lib/equipo";
import type { MiembroEquipo as TipoMiembro } from "@/types/contenido";

/**
 * TeamMember — foto, nombre, título profesional, credenciales y formación.
 *
 * El título profesional NO se arma aquí: sale de `tituloProfesional()`, que
 * es donde vive la regla de que un RNE en trámite nunca puede mostrarse
 * como "Especialista". Si un día hay que cambiarla, se cambia en un sitio.
 */
export function TeamMember({
  miembro,
  compacto = false,
  className,
}: {
  miembro: TipoMiembro;
  /** Versión reducida para listados dentro de una especialidad. */
  compacto?: boolean;
  className?: string;
}) {
  const titulo = tituloProfesional(miembro);
  const listaCredenciales = credenciales(miembro);
  const avisoRne = etiquetaRne(miembro);

  if (compacto) {
    return (
      <div className={cx("flex items-center gap-4", className)}>
        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-pastilla bg-fondo-alt">
          <ImagenSanity
            imagen={miembro.foto}
            alt={miembro.nombre ?? ""}
            llenar
            ancho={128}
            sizes="64px"
          />
        </div>
        <div className="min-w-0">
          <p className="font-display text-base font-semibold text-marca-900">
            {miembro.nombre}
          </p>
          <p className="font-cuerpo text-sm text-suave">{titulo}</p>
          {listaCredenciales.length > 0 ? (
            <p className="font-cuerpo text-xs text-suave">
              {listaCredenciales.join(" · ")}
            </p>
          ) : null}
        </div>
      </div>
    );
  }

  return (
    <article
      className={cx(
        "flex flex-col overflow-hidden rounded-card border border-linea bg-fondo",
        className,
      )}
    >
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-fondo-alt">
        <ImagenSanity
          imagen={miembro.foto}
          alt={miembro.nombre ?? ""}
          llenar
          ancho={600}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 300px"
        />
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-display text-lg font-semibold text-marca-900">
          {miembro.nombre}
        </h3>

        <p className="mt-1 font-cuerpo text-sm font-medium text-marca-700">{titulo}</p>

        {miembro.esDirectora ? (
          <p className="mt-1 font-cuerpo text-xs font-semibold uppercase tracking-wide text-acento">
            Directora
          </p>
        ) : null}

        {listaCredenciales.length > 0 ? (
          <p className="mt-3 font-cuerpo text-xs text-suave">
            {listaCredenciales.join(" · ")}
          </p>
        ) : null}

        {/* Se declara el trámite en vez de ocultarlo: la transparencia es
            lo que sostiene el posicionamiento de clínica de especialistas. */}
        {avisoRne ? (
          <p className="mt-1 font-cuerpo text-xs text-suave">{avisoRne}</p>
        ) : null}

        {miembro.bio ? (
          <p className="mt-4 flex-1 font-cuerpo text-sm leading-relaxed text-suave">
            {miembro.bio}
          </p>
        ) : null}

        {miembro.formacion && miembro.formacion.length > 0 ? (
          <div className="mt-4 border-t border-linea pt-4">
            <h4 className="font-cuerpo text-xs font-semibold uppercase tracking-wide text-marca-900">
              Formación
            </h4>
            <ul className="mt-2 space-y-1">
              {miembro.formacion.map((estudio, i) => (
                <li key={i} className="font-cuerpo text-xs text-suave">
                  {estudio}
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {typeof miembro.aniosExperiencia === "number" && miembro.aniosExperiencia > 0 ? (
          <p className="mt-3 font-cuerpo text-xs text-suave">
            {miembro.aniosExperiencia} años de experiencia
          </p>
        ) : null}
      </div>
    </article>
  );
}
