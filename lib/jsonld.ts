import { tituloProfesional } from "@/lib/equipo";
import { diaSchema, urlAbsoluta, URL_SITIO } from "@/lib/sitio";
import { rutaEspecialidad } from "@/lib/rutas";
import type {
  AjustesSitio,
  Especialidad,
  Faq,
  MiembroEquipo,
  Problema,
} from "@/types/contenido";

/**
 * Constructores de JSON-LD.
 *
 * Son funciones puras y viven aparte del componente que las inyecta, por
 * dos razones: se pueden probar sin renderizar React (scripts/*.test.ts),
 * y el marcado estructurado se revisa como datos, que es lo que es.
 *
 * Criterio de verificación: pasa la prueba de resultados enriquecidos de
 * Google sin errores. Por eso `limpiar` elimina las propiedades vacías —
 * un campo presente pero nulo es un error, no una omisión.
 */

export type Json = Record<string, unknown>;

/** Quita claves con valor nulo, indefinido o array vacío, en profundidad. */
export function limpiar<T extends Json>(objeto: T): T {
  const salida: Json = {};
  for (const [clave, valor] of Object.entries(objeto)) {
    if (valor === null || valor === undefined || valor === "") continue;
    if (Array.isArray(valor)) {
      if (valor.length === 0) continue;
      salida[clave] = valor;
      continue;
    }
    if (typeof valor === "object") {
      const anidado = limpiar(valor as Json);
      if (Object.keys(anidado).length === 0) continue;
      salida[clave] = anidado;
      continue;
    }
    salida[clave] = valor;
  }
  return salida as T;
}

// ── Portada: Dentist (subtipo de LocalBusiness) ──────────────────────────

export function esquemaClinica(ajustes: AjustesSitio): Json {
  const horarios = (ajustes.horarios ?? [])
    .filter((h) => !h.cerrado && h.apertura && h.cierre && diaSchema(h.dia))
    .map((h) =>
      limpiar({
        "@type": "OpeningHoursSpecification",
        dayOfWeek: `https://schema.org/${diaSchema(h.dia)}`,
        opens: h.apertura,
        closes: h.cierre,
      }),
    );

  return limpiar({
    "@context": "https://schema.org",
    "@type": "Dentist",
    "@id": `${URL_SITIO}/#clinica`,
    name: ajustes.nombreClinica,
    url: URL_SITIO,
    telephone: ajustes.telefono,
    email: ajustes.correoNotificaciones,
    address: limpiar({
      "@type": "PostalAddress",
      streetAddress: [ajustes.direccion, ajustes.oficina].filter(Boolean).join(", "),
      addressLocality: ajustes.distrito,
      addressRegion: ajustes.ciudad,
      addressCountry: "PE",
    }),
    // Coordenadas de Pueblo Libre, Lima. PROVISIONAL: se afinan cuando se
    // confirme la ubicación exacta en la ficha de Google Business.
    geo: {
      "@type": "GeoCoordinates",
      latitude: -12.0742,
      longitude: -77.0631,
    },
    areaServed: limpiar({
      "@type": "City",
      name: ajustes.ciudad ?? "Lima",
    }),
    openingHoursSpecification: horarios,
    hasMap: ajustes.googleMapsUrl,
    sameAs: (ajustes.redes ?? []).map((r) => r.url).filter(Boolean),
    availableLanguage: { "@type": "Language", name: "Spanish" },
  });
}

// ── Especialidad: MedicalProcedure ───────────────────────────────────────

export function esquemaEspecialidad(especialidad: Especialidad): Json {
  const url = especialidad.slug ? urlAbsoluta(rutaEspecialidad(especialidad.slug)) : URL_SITIO;

  return limpiar({
    "@context": "https://schema.org",
    "@type": "MedicalProcedure",
    "@id": `${url}#procedimiento`,
    name: especialidad.nombre,
    description: especialidad.resumenCorto,
    url,
    procedureType: "https://schema.org/NoninvasiveProcedure",
    howPerformed: especialidad.queEsperarDespues,
    followup: especialidad.queEsperarDespues,
    provider: { "@id": `${URL_SITIO}/#clinica` },
    relevantSpecialty: limpiar({
      "@type": "MedicalSpecialty",
      name: especialidad.nombre,
    }),
  });
}

// ── FAQPage ──────────────────────────────────────────────────────────────

export function esquemaFaq(faqs: Faq[] | undefined, url: string): Json | null {
  const validas = (faqs ?? []).filter((f) => f.pregunta && f.respuesta);
  if (validas.length === 0) return null;

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${url}#faq`,
    mainEntity: validas.map((faq) => ({
      "@type": "Question",
      name: faq.pregunta,
      acceptedAnswer: { "@type": "Answer", text: faq.respuesta },
    })),
  };
}

// ── Person ───────────────────────────────────────────────────────────────

export function esquemaPersona(miembro: MiembroEquipo): Json {
  return limpiar({
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${URL_SITIO}/equipo#${miembro.slug ?? miembro._id}`,
    name: miembro.nombre,
    // El título profesional respeta la regla del RNE en trámite también aquí:
    // marcar "Especialista" en JSON-LD sería tan incorrecto como en pantalla.
    jobTitle: tituloProfesional(miembro),
    description: miembro.bio,
    worksFor: { "@id": `${URL_SITIO}/#clinica` },
    // Solo se declara la credencial cuando está vigente.
    hasCredential:
      miembro.rne && miembro.rneEstado === "vigente"
        ? {
            "@type": "EducationalOccupationalCredential",
            credentialCategory: "Registro Nacional de Especialistas",
            identifier: miembro.rne,
          }
        : undefined,
    identifier: miembro.colegiatura ? `COP ${miembro.colegiatura}` : undefined,
  });
}

// ── Problema: MedicalCondition ───────────────────────────────────────────

export function esquemaProblema(problema: Problema, url: string): Json {
  return limpiar({
    "@context": "https://schema.org",
    "@type": "MedicalCondition",
    "@id": `${url}#condicion`,
    name: problema.titulo,
    description: problema.resumenCorto,
    url,
  });
}

// ── Migas de pan ─────────────────────────────────────────────────────────

export function esquemaMigas(
  migas: Array<{ nombre: string; ruta: string }>,
): Json {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: migas.map((miga, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: miga.nombre,
      item: urlAbsoluta(miga.ruta),
    })),
  };
}

// ── WebSite ──────────────────────────────────────────────────────────────

export function esquemaSitio(ajustes: AjustesSitio): Json {
  return limpiar({
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${URL_SITIO}/#sitio`,
    name: ajustes.nombreClinica,
    url: URL_SITIO,
    inLanguage: "es-PE",
    publisher: { "@id": `${URL_SITIO}/#clinica` },
  });
}
