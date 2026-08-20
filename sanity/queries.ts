import { groq } from "next-sanity";

/**
 * Consultas GROQ.
 *
 * Dos reglas que se repiten en todas:
 *   1. Se proyecta `"slug": slug.current` para que el resto del código nunca
 *      tenga que acordarse de la forma interna del tipo slug de Sanity.
 *   2. Se ordena por `orden asc` y luego por nombre, para que el índice
 *      quede estable aunque la doctora no rellene el campo de orden.
 */

const IMAGEN = `{ asset, hotspot, crop, alt }`;

const MIEMBRO_RESUMEN = `{
  _id,
  nombre,
  "slug": slug.current,
  cargo,
  especialidad,
  colegiatura,
  rne,
  rneEstado,
  foto ${IMAGEN}
}`;

const MIEMBRO_COMPLETO = `{
  _id,
  nombre,
  "slug": slug.current,
  cargo,
  especialidad,
  colegiatura,
  rne,
  rneEstado,
  formacion,
  aniosExperiencia,
  bio,
  foto ${IMAGEN},
  esDirectora,
  orden
}`;

const TECNOLOGIA = `{
  _id,
  nombre,
  "slug": slug.current,
  descripcion,
  queSignificaParaElPaciente,
  imagen ${IMAGEN},
  orden
}`;

const ESPECIALIDAD_RESUMEN = `{
  _id,
  nombre,
  "slug": slug.current,
  resumenCorto,
  ctaVariante,
  imagenPrincipal ${IMAGEN},
  orden
}`;

// ── Especialidades ───────────────────────────────────────────────────────

export const ESPECIALIDADES_INDICE = groq`
  *[_type == "especialidad" && defined(slug.current)]
  | order(orden asc, nombre asc) ${ESPECIALIDAD_RESUMEN}
`;

export const ESPECIALIDAD_POR_SLUG = groq`
  *[_type == "especialidad" && slug.current == $slug][0] {
    _id,
    nombre,
    "slug": slug.current,
    resumenCorto,
    paraQuien,
    queIncluye,
    comoEsElProceso[] { _key, titulo, descripcion },
    queEsperarDespues,
    duracionPrimeraCita,
    especialistas[]-> ${MIEMBRO_RESUMEN},
    tecnologiaRelacionada[]-> ${TECNOLOGIA},
    faqs[] { _key, pregunta, respuesta },
    ctaVariante,
    imagenPrincipal ${IMAGEN},
    seoTitulo,
    seoDescripcion,
    orden
  }
`;

export const SLUGS_ESPECIALIDAD = groq`
  *[_type == "especialidad" && defined(slug.current)].slug.current
`;

// ── Problemas (Fase 2) ───────────────────────────────────────────────────

export const PROBLEMAS_INDICE = groq`
  *[_type == "problema" && defined(slug.current)]
  | order(orden asc, titulo asc) {
    _id,
    titulo,
    "slug": slug.current,
    resumenCorto,
    orden
  }
`;

export const PROBLEMA_POR_SLUG = groq`
  *[_type == "problema" && slug.current == $slug][0] {
    _id,
    titulo,
    "slug": slug.current,
    resumenCorto,
    descripcion,
    especialidadesRelacionadas[]-> ${ESPECIALIDAD_RESUMEN},
    faqs[] { _key, pregunta, respuesta },
    seoTitulo,
    seoDescripcion,
    orden
  }
`;

export const SLUGS_PROBLEMA = groq`
  *[_type == "problema" && defined(slug.current)].slug.current
`;

// ── Equipo ───────────────────────────────────────────────────────────────

export const EQUIPO_COMPLETO = groq`
  *[_type == "miembroEquipo"]
  | order(esDirectora desc, orden asc, nombre asc) ${MIEMBRO_COMPLETO}
`;

// ── Tecnología ───────────────────────────────────────────────────────────

export const TECNOLOGIAS = groq`
  *[_type == "tecnologia"] | order(orden asc, nombre asc) ${TECNOLOGIA}
`;

// ── Casos (Fase 2) ───────────────────────────────────────────────────────

/**
 * El filtro `consentimientoFirmado == true` no es una comodidad: es la
 * segunda barrera (la primera está en la validación del esquema) que impide
 * servir la foto de un paciente sin su consentimiento firmado.
 */
export const CASOS_INDICE = groq`
  *[_type == "caso" && consentimientoFirmado == true && defined(slug.current)]
  | order(orden asc, titulo asc) {
    _id,
    titulo,
    "slug": slug.current,
    problema,
    resultado,
    especialidadesInvolucradas[]-> ${ESPECIALIDAD_RESUMEN},
    imagenAntes ${IMAGEN},
    imagenDespues ${IMAGEN},
    orden
  }
`;

// ── Páginas únicas ───────────────────────────────────────────────────────

export const PAGINA_DERIVACION = groq`
  *[_type == "paginaDerivacion"][0] {
    titulo,
    intro,
    tiposDeCasoQueRecibimos,
    comoDerivar[] { _key, titulo, descripcion },
    comoCoordinamos,
    comoInformamosAlColega,
    queSucedeDespues,
    ofreceMentorias,
    descripcionMentorias,
    correoParaRadiografias
  }
`;

export const PAGINA_EVALUACION = groq`
  *[_type == "paginaEvaluacion"][0] {
    titulo,
    precio,
    horarioDisponible,
    queIncluye,
    comoEsElProceso[] { _key, titulo, descripcion },
    queEsperarDespues,
    quienLaAtiende-> ${MIEMBRO_RESUMEN},
    vigenciaPromocion,
    enlaceReserva
  }
`;

export const AJUSTES_SITIO = groq`
  *[_type == "ajustesSitio"][0] {
    nombreClinica,
    direccion,
    oficina,
    distrito,
    ciudad,
    telefono,
    whatsapp,
    correoNotificaciones,
    horarios[] { _key, dia, apertura, cierre, cerrado },
    googleMapsUrl,
    googleMapsEmbed,
    enlacesDoctocliq[] {
      _key,
      etiqueta,
      url,
      especialista-> { _id, nombre }
    },
    redes[] { _key, plataforma, url }
  }
`;

// ── Portada ──────────────────────────────────────────────────────────────

/**
 * Una sola consulta para toda la portada. Evita cuatro viajes a Sanity en
 * la ruta que más importa para Lighthouse.
 */
export const PORTADA = groq`{
  "especialidades": *[_type == "especialidad" && defined(slug.current)]
    | order(orden asc, nombre asc) ${ESPECIALIDAD_RESUMEN},
  "equipo": *[_type == "miembroEquipo"]
    | order(esDirectora desc, orden asc, nombre asc) ${MIEMBRO_COMPLETO},
  "tecnologias": *[_type == "tecnologia"] | order(orden asc, nombre asc) ${TECNOLOGIA},
  "evaluacion": *[_type == "paginaEvaluacion"][0] {
    titulo, precio, horarioDisponible, enlaceReserva
  }
}`;

// ── Sitemap ──────────────────────────────────────────────────────────────

export const RUTAS_PARA_SITEMAP = groq`{
  "especialidades": *[_type == "especialidad" && defined(slug.current)] {
    "slug": slug.current, _updatedAt
  },
  "problemas": *[_type == "problema" && defined(slug.current)] {
    "slug": slug.current, _updatedAt
  }
}`;
