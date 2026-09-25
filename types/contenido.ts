/**
 * Tipos del contenido que sirve Sanity.
 *
 * Se escriben a mano (en vez de generarse) porque durante el Sprint 1 no hay
 * dataset con contenido del que derivarlos y porque las consultas GROQ
 * proyectan solo los campos que cada página usa. Cuando el dataset esté
 * poblado se puede pasar a `sanity typegen`.
 *
 * Casi todo es opcional a propósito: el contenido llega por partes y la web
 * tiene que renderizar sin romperse con lo que haya.
 */

export type VarianteCta = "reservar" | "consultar" | "evaluacion";

export type EstadoRne = "vigente" | "en-tramite";

export interface ImagenSanityRef {
  asset?: { _ref?: string; _type?: string };
  hotspot?: { x: number; y: number; width: number; height: number };
  crop?: { top: number; bottom: number; left: number; right: number };
  alt?: string;
}

export interface Paso {
  _key?: string;
  titulo?: string;
  descripcion?: string;
}

export interface Faq {
  _key?: string;
  pregunta?: string;
  respuesta?: string;
}

export interface ExperienciaDocente {
  _key?: string;
  institucion?: string;
  aniosDocencia?: string;
  vigente?: boolean;
}

export interface MiembroEquipo {
  _id: string;
  nombre?: string;
  slug?: string;
  cargo?: string;
  especialidad?: string;
  colegiatura?: string;
  rne?: string;
  rneEstado?: EstadoRne;
  formacion?: string[];
  anioTitulacion?: number;
  aniosEjercicio?: number;
  anioEspecialidad?: number;
  aniosComoEspecialista?: number;
  docencia?: ExperienciaDocente[];
  aniosExperiencia?: number;
  bio?: string;
  foto?: ImagenSanityRef;
  fotoLocal?: string;
  esDirectora?: boolean;
  orden?: number;
}

export interface Tecnologia {
  _id: string;
  nombre?: string;
  slug?: string;
  descripcion?: string;
  queSignificaParaElPaciente?: string;
  imagen?: ImagenSanityRef;
  fotoLocal?: string;
  orden?: number;
}

export interface Especialidad {
  _id: string;
  nombre?: string;
  slug?: string;
  resumenCorto?: string;
  paraQuien?: string;
  queIncluye?: string[];
  comoEsElProceso?: Paso[];
  queEsperarDespues?: string;
  duracionPrimeraCita?: string;
  especialistas?: MiembroEquipo[];
  tecnologiaRelacionada?: Tecnologia[];
  faqs?: Faq[];
  ctaVariante?: VarianteCta;
  imagenPrincipal?: ImagenSanityRef;
  seoTitulo?: string;
  seoDescripcion?: string;
  enlaceFormasDePagoTexto?: string;
  orden?: number;
}

/** Proyección reducida para tarjetas de índice y para el sitemap. */
export interface EspecialidadResumen {
  _id: string;
  nombre?: string;
  slug?: string;
  resumenCorto?: string;
  imagenPrincipal?: ImagenSanityRef;
  ctaVariante?: VarianteCta;
  orden?: number;
}

/** Bloque de Portable Text. Se tipa laxo: solo se recorre para renderizar. */
export interface BloquePortable {
  _key?: string;
  _type?: string;
  style?: string;
  listItem?: string;
  level?: number;
  children?: Array<{ _key?: string; _type?: string; text?: string; marks?: string[] }>;
  markDefs?: Array<{ _key?: string; _type?: string; href?: string }>;
}

export interface Problema {
  _id: string;
  titulo?: string;
  slug?: string;
  resumenCorto?: string;
  descripcion?: BloquePortable[];
  especialidadesRelacionadas?: EspecialidadResumen[];
  faqs?: Faq[];
  seoTitulo?: string;
  seoDescripcion?: string;
  orden?: number;
}

export interface ProblemaResumen {
  _id: string;
  titulo?: string;
  slug?: string;
  resumenCorto?: string;
  orden?: number;
}

export interface Caso {
  _id: string;
  titulo?: string;
  slug?: string;
  problema?: string;
  diagnostico?: string;
  planificacion?: string;
  tratamiento?: string;
  resultado?: string;
  especialidadesInvolucradas?: EspecialidadResumen[];
  imagenAntes?: ImagenSanityRef;
  imagenDespues?: ImagenSanityRef;
  orden?: number;
}

export interface PaginaDerivacion {
  titulo?: string;
  intro?: string;
  tiposDeCasoQueRecibimos?: string[];
  comoDerivar?: Paso[];
  comoCoordinamos?: string;
  comoInformamosAlColega?: string;
  queSucedeDespues?: string;
  ofreceMentorias?: boolean;
  descripcionMentorias?: string;
  correoParaRadiografias?: string;
}

export interface PaginaEvaluacion {
  titulo?: string;
  precio?: string;
  horarioDisponible?: string;
  queIncluye?: string[];
  comoEsElProceso?: Paso[];
  queEsperarDespues?: string;
  quienLaAtiende?: MiembroEquipo;
  vigenciaPromocion?: string;
  enlaceReserva?: string;
}

export interface ModalidadPago {
  _key?: string;
  nombre?: string;
  descripcion?: string;
}

export interface OpcionFinanciamiento {
  _key?: string;
  nombre?: string;
  descripcion?: string;
  requisitos?: string;
}

export interface PaginaFormasDePago {
  titulo?: string;
  intro?: string;
  notaTransparencia?: string;
  comoSeEntregaElPresupuesto?: string;
  modalidadesDePago?: ModalidadPago[];
  financiamiento?: OpcionFinanciamiento[];
  coberturaSeguros?: string;
  preguntasFrecuentes?: Faq[];
  seoTitulo?: string;
  seoDescripcion?: string;
}

export interface Horario {
  _key?: string;
  dia?: string;
  apertura?: string;
  cierre?: string;
  cerrado?: boolean;
}

export interface EnlaceDoctocliq {
  _key?: string;
  etiqueta?: string;
  url?: string;
  especialista?: { _id?: string; nombre?: string };
}

export interface RedSocial {
  _key?: string;
  plataforma?: string;
  url?: string;
}

export interface AjustesSitio {
  nombreClinica?: string;
  logoPrincipal?: ImagenSanityRef;
  logoInvertido?: ImagenSanityRef;
  isotipo?: ImagenSanityRef;
  favicon?: ImagenSanityRef;
  direccion?: string;
  oficina?: string;
  distrito?: string;
  ciudad?: string;
  telefono?: string;
  whatsapp?: string;
  correoNotificaciones?: string;
  horarios?: Horario[];
  googleMapsUrl?: string;
  googleMapsEmbed?: string;
  enlacesDoctocliq?: EnlaceDoctocliq[];
  redes?: RedSocial[];
}
