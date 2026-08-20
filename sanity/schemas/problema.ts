import { defineField, defineType } from "sanity";

/**
 * PROBLEMA — Fase 2.
 *
 * La ruta, la plantilla y el esquema se construyen ahora; es normal que
 * queden sin contenido durante el Sprint 1.
 *
 * Existe separado de `especialidad` por la razón que hace funcionar a las
 * clínicas de especialistas de referencia: una página habla el idioma del
 * paciente ("me sangran las encías") y la otra el del odontólogo
 * ("injerto gingival"). Doble captura en buscadores.
 */
export const problema = defineType({
  name: "problema",
  title: "Problema",
  type: "document",
  groups: [
    { name: "contenido", title: "Contenido", default: true },
    { name: "seo", title: "Buscadores" },
  ],
  fields: [
    defineField({
      name: "titulo",
      title: "¿Cómo lo dice el paciente?",
      type: "string",
      group: "contenido",
      description:
        "En sus palabras, no en las nuestras. Ej.: Me sangran las encías. Se me mueve un diente. Me duele al masticar. Así es como lo buscan en Google.",
      validation: (r) => r.required().error("El título es obligatorio."),
    }),
    defineField({
      name: "slug",
      title: "Dirección web",
      type: "slug",
      group: "contenido",
      options: { source: "titulo", maxLength: 96 },
      validation: (r) => r.required().error("La dirección web es obligatoria."),
    }),
    defineField({
      name: "resumenCorto",
      title: "Resumen en una o dos frases",
      type: "text",
      rows: 3,
      group: "contenido",
      description: "Máximo 160 caracteres. Se usa en la tarjeta del índice y en Google.",
      validation: (r) => r.max(160).warning("Pasa de 160 caracteres: Google va a recortarlo."),
    }),
    defineField({
      name: "descripcion",
      title: "Explicación",
      type: "array",
      group: "contenido",
      description:
        "Qué es, por qué pasa, qué riesgo tiene si se deja. Sin tecnicismos sin explicar.",
      of: [
        {
          type: "block",
          styles: [
            { title: "Párrafo", value: "normal" },
            { title: "Subtítulo", value: "h2" },
            { title: "Subtítulo menor", value: "h3" },
          ],
          lists: [
            { title: "Viñetas", value: "bullet" },
            { title: "Numerada", value: "number" },
          ],
          marks: {
            decorators: [
              { title: "Negrita", value: "strong" },
              { title: "Cursiva", value: "em" },
            ],
          },
        },
      ],
    }),
    defineField({
      name: "especialidadesRelacionadas",
      title: "¿Qué especialidad lo resuelve?",
      type: "array",
      group: "contenido",
      of: [{ type: "reference", to: [{ type: "especialidad" }] }],
      description:
        "El puente entre el idioma del paciente y el de la clínica. Es lo que lleva de este problema a la página de la especialidad.",
    }),
    defineField({
      name: "faqs",
      title: "Preguntas frecuentes",
      type: "array",
      group: "contenido",
      of: [
        {
          type: "object",
          name: "faq",
          fields: [
            defineField({
              name: "pregunta",
              title: "Pregunta",
              type: "string",
              validation: (r) => r.required(),
            }),
            defineField({
              name: "respuesta",
              title: "Respuesta",
              type: "text",
              rows: 4,
              validation: (r) => r.required(),
            }),
          ],
          preview: { select: { title: "pregunta", subtitle: "respuesta" } },
        },
      ],
    }),
    defineField({
      name: "seoTitulo",
      title: "Título para Google",
      type: "string",
      group: "seo",
      description: "Si lo dejas vacío se usa el título del problema.",
      validation: (r) => r.max(60).warning("Pasa de 60 caracteres: Google lo va a recortar."),
    }),
    defineField({
      name: "seoDescripcion",
      title: "Descripción para Google",
      type: "text",
      rows: 3,
      group: "seo",
      description: "Si la dejas vacía se usa el resumen corto.",
      validation: (r) => r.max(160).warning("Pasa de 160 caracteres: Google la va a recortar."),
    }),
    defineField({
      name: "orden",
      title: "Orden en el índice",
      type: "number",
      group: "contenido",
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
  preview: { select: { title: "titulo", subtitle: "resumenCorto" } },
});
