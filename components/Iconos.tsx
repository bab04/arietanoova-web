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
