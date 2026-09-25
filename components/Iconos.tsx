/**
 * Iconos en línea.
 *
 * Se dibujan a mano en vez de traer una librería por dos razones: son ocho,
 * y todos heredan el color del texto (`currentColor`), así que respetan el
 * sistema de tokens sin excepción.
 */

type PropsIcono = React.SVGProps<SVGSVGElement> & { titulo?: string };

function Base({ titulo, children, ...props }: PropsIcono) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      width="1em"
      height="1em"
      aria-hidden={titulo ? undefined : true}
      role={titulo ? "img" : undefined}
      {...props}
    >
      {titulo ? <title>{titulo}</title> : null}
      {children}
    </svg>
  );
}

export const IconoTelefono = (p: PropsIcono) => (
  <Base {...p}>
    <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.2a2 2 0 0 1 2.1-.5c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z" />
  </Base>
);

export const IconoWhatsApp = (p: PropsIcono) => (
  <Base {...p} strokeWidth={1.6}>
    <path d="M3 21l1.7-5A8.4 8.4 0 1 1 8 19.3z" />
    <path d="M8.5 9.2c.2-.5.4-.5.7-.5h.6c.2 0 .4 0 .6.5l.7 1.6c.1.3 0 .5-.1.7l-.4.5c-.2.2-.3.4-.1.7a7 7 0 0 0 3 2.6c.3.1.5 0 .7-.2l.5-.6c.2-.2.4-.2.6-.1l1.6.8c.3.1.4.3.4.5a1.8 1.8 0 0 1-1.3 1.6c-.6.2-1.4.2-2.4-.2a10 10 0 0 1-5.4-5.4c-.4-1-.5-1.8-.3-2.4z" />
  </Base>
);

export const IconoMenu = (p: PropsIcono) => (
  <Base {...p}>
    <path d="M3 6h18M3 12h18M3 18h18" />
  </Base>
);

export const IconoCerrar = (p: PropsIcono) => (
  <Base {...p}>
    <path d="M18 6 6 18M6 6l12 12" />
  </Base>
);

export const IconoFlecha = (p: PropsIcono) => (
  <Base {...p}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </Base>
);

export const IconoCalendario = (p: PropsIcono) => (
  <Base {...p}>
    <rect x="3" y="5" width="18" height="16" rx="2" />
    <path d="M8 3v4M16 3v4M3 11h18" />
  </Base>
);

export const IconoUbicacion = (p: PropsIcono) => (
  <Base {...p}>
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z" />
    <circle cx="12" cy="10" r="3" />
  </Base>
);

export const IconoReloj = (p: PropsIcono) => (
  <Base {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 2" />
  </Base>
);

export const IconoCorreo = (p: PropsIcono) => (
  <Base {...p}>
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="m3 7 9 6 9-6" />
  </Base>
);

export const IconoCheck = (p: PropsIcono) => (
  <Base {...p}>
    <path d="m5 13 4 4L19 7" />
  </Base>
);

export const IconoChevron = (p: PropsIcono) => (
  <Base {...p}>
    <path d="m6 9 6 6 6-6" />
  </Base>
);

export const IconoDiente = (p: PropsIcono) => (
  <Base {...p}>
    <path d="M7 3C4.2 3 2 5.2 2 8c0 3.3 1.5 6.5 2.5 10 .8 2.8 2.5 3 4 1 1-1.3 2-2 3.5-2s2.5.7 3.5 2c1.5 2 3.2 1.8 4-1 1-3.5 2.5-6.7 2.5-10 0-2.8-2.2-5-5-5-1.8 0-3.2 1-4.5 2.5C11.7 4 10.3 3 8.5 3H7z" />
  </Base>
);

export const IconoOrtodoncia = (p: PropsIcono) => (
  <Base {...p}>
    <path d="M4 12h16M4 12a3 3 0 0 1 3-3h10a3 3 0 0 1 3 3M4 12a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3" />
    <rect x="7.5" y="10" width="3" height="4" rx="0.5" />
    <rect x="13.5" y="10" width="3" height="4" rx="0.5" />
  </Base>
);

export const IconoEndodoncia = (p: PropsIcono) => (
  <Base {...p}>
    <path d="M12 3v18M12 8c-2 0-4 1.5-4 4s2 5 2 9M12 8c2 0 4 1.5 4 4s-2 5-2 9" />
    <circle cx="12" cy="5" r="2" />
  </Base>
);

export const IconoRehabilitacion = (p: PropsIcono) => (
  <Base {...p}>
    <path d="M5 19h14M6 15l2.5-9 3.5 5 3.5-5 2.5 9H6z" />
    <circle cx="12" cy="5" r="1" />
  </Base>
);

export const IconoCirugia = (p: PropsIcono) => (
  <Base {...p}>
    <path d="M9 3h6v3H9zM10 6v11l2 4 2-4V6M8 10h8M8 14h8" />
  </Base>
);

export const IconoOdontopediatria = (p: PropsIcono) => (
  <Base {...p}>
    <circle cx="12" cy="12" r="9" />
    <circle cx="9" cy="10" r="1.25" fill="currentColor" />
    <circle cx="15" cy="10" r="1.25" fill="currentColor" />
    <path d="M8 14.5s1.5 2.5 4 2.5 4-2.5 4-2.5" />
  </Base>
);

export const IconoPeriodoncia = (p: PropsIcono) => (
  <Base {...p}>
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <path d="M8 12c1.5 1.5 3 2 4 2s2.5-.5 4-2" />
  </Base>
);

export const IconoEscaner3D = (p: PropsIcono) => (
  <Base {...p}>
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
    <path d="M3.27 6.96 12 12.01l8.73-5.05M12 22.08V12" />
  </Base>
);

export const IconoEstrella = (p: PropsIcono) => (
  <Base {...p} fill="currentColor">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </Base>
);

export const IconoEscudo = (p: PropsIcono) => (
  <Base {...p}>
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <path d="m9 12 2 2 4-4" />
  </Base>
);

export const IconoCertificado = (p: PropsIcono) => (
  <Base {...p}>
    <circle cx="12" cy="8" r="6" />
    <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" />
  </Base>
);

export const IconoSparkles = (p: PropsIcono) => (
  <Base {...p}>
    <path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3L12 3z" />
  </Base>
);

