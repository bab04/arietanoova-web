import { defineField, defineType } from "sanity";

/**
 * CASO — Fase 2.
 *
 * La estructura la definió la clienta: problema, diagnóstico, planificación,
 * tratamiento, resultado. Se presenta como una historia corta de paciente,
 * no como una lista de procedimientos.
 *
 * `consentimientoFirmado` bloquea la publicación si es falso. La comprobación
 * está en dos sitios a propósito:
 *   1. Validación del documento en el Studio (no deja publicar).
 *   2. Filtro en la consulta GROQ (no se sirve aunque exista).
 * Publicar la foto de la boca de un paciente sin consentimiento no es
 * un descuido recuperable.
 */
export const caso = defineType({
  name: "caso",
  title: "Caso",
  type: "document",
  groups: [
    { name: "historia", title: "Historia clínica", default: true },
    { name: "imagenes", title: "Imágenes" },
    { name: "legal", title: "Consentimiento" },
  ],
  fields: [
    defineField({
      name: "titulo",
      title: "Título del caso",
      type: "string",
      group: "historia",
      description:
        "Descriptivo y sin nombre del paciente. Ej.: Rehabilitación completa tras años sin tratamiento.",
      validation: (r) => r.required().error("El título es obligatorio."),
    }),
    defineField({
      name: "slug",
      title: "Dirección web",
      type: "slug",
      group: "historia",
      options: { source: "titulo", maxLength: 96 },
      validation: (r) => r.required().error("La dirección web es obligatoria."),
    }),
    defineField({
      name: "problema",
      title: "¿Con qué llegó el paciente?",
      type: "text",
      rows: 4,
      group: "historia",
      description: "El motivo de consulta, en el lenguaje con que llegó.",
    }),
    defineField({
      name: "diagnostico",
      title: "Diagnóstico",
      type: "text",
      rows: 4,
      group: "historia",
      description: "Qué se encontró en la evaluación.",
    }),
    defineField({
      name: "planificacion",
      title: "Planificación",
      type: "text",
      rows: 4,
      group: "historia",
      description: "Cómo se planteó resolverlo y por qué se eligió esa vía.",
    }),
    defineField({
      name: "tratamiento",
      title: "Tratamiento realizado",
      type: "text",
      rows: 4,
      group: "historia",
      description: "Qué se hizo y en cuántas sesiones.",
    }),
    defineField({
      name: "resultado",
      title: "Resultado",
      type: "text",
      rows: 4,
      group: "historia",
      description: "Qué recuperó el paciente. Función, no solo estética.",
    }),
    defineField({
      name: "especialidadesInvolucradas",
      title: "¿Qué especialidades intervinieron?",
      type: "array",
      group: "historia",
      of: [{ type: "reference", to: [{ type: "especialidad" }] }],
      description:
        "Los casos que muestran varias especialidades trabajando juntas son los que mejor sostienen el posicionamiento de la clínica.",
    }),
    defineField({
      name: "imagenAntes",
      title: "Imagen antes",
      type: "image",
      group: "imagenes",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          title: "Descripción de la imagen",
          type: "string",
        }),
      ],
    }),
    defineField({
      name: "imagenDespues",
      title: "Imagen después",
      type: "image",
      group: "imagenes",
      options: { hotspot: true },
      description:
        "Mismo encuadre, misma luz y mismo ángulo que la de antes. Si no coinciden, el comparador no funciona.",
      fields: [
        defineField({
          name: "alt",
          title: "Descripción de la imagen",
          type: "string",
        }),
      ],
    }),
    defineField({
      name: "consentimientoFirmado",
      title: "¿Hay consentimiento firmado del paciente?",
      type: "boolean",
      group: "legal",
      description:
        "Sin esto marcado el caso no se puede publicar ni aparece en la web, aunque esté creado. Debe existir el documento físico o digital firmado.",
      initialValue: false,
      validation: (r) =>
        r.custom((valor) =>
          valor === true
            ? true
            : "No se puede publicar un caso sin consentimiento firmado del paciente.",
        ),
    }),
    defineField({
      name: "orden",
      title: "Orden en el índice",
      type: "number",
      group: "historia",
      initialValue: 0,
    }),
  ],
  orderings: [
    {
      title: "Orden definido",
      name: "ordenAsc",
      by: [
        { field: "orden", direction: "asc" },
        { field: "titulo", direction: "asc" },
      ],
    },
  ],
  preview: {
    select: {
      title: "titulo",
      consentimiento: "consentimientoFirmado",
      media: "imagenDespues",
    },
    prepare({ title, consentimiento, media }) {
      return {
        title,
        subtitle: consentimiento
          ? "Consentimiento firmado"
          : "SIN CONSENTIMIENTO — no publicable",
        media,
      };
    },
  },
});
