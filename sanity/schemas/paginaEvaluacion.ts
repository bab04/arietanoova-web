import { defineField, defineType } from "sanity";

/**
 * PÁGINA DE LA EVALUACIÓN MATUTINA — singleton (/evaluacion-matutina)
 *
 * Esta landing tiene un objetivo comercial concreto y medible: llenar las
 * horas vacías de la mañana. Es la única página del sitio donde se publica
 * un precio.
 */
export const paginaEvaluacion = defineType({
  name: "paginaEvaluacion",
  title: "Evaluación matutina",
  type: "document",
  fields: [
    defineField({
      name: "titulo",
      title: "Título de la página",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "precio",
      title: "Precio",
      type: "string",
      description:
        "Escrito tal como debe leerse, con moneda. Ej.: S/ 60. Es texto y no número para poder poner S/ 60 por persona si hace falta.",
    }),
    defineField({
      name: "horarioDisponible",
      title: "¿En qué horario está disponible?",
      type: "string",
      description:
        "Ej.: Lunes a viernes de 8:00 a 12:00. La restricción horaria es la razón de ser de esta oferta: hay que decirla clara.",
    }),
    defineField({
      name: "queIncluye",
      title: "¿Qué incluye?",
      type: "array",
      of: [{ type: "string" }],
      description:
        "Una línea por punto. Cuantificar qué entra en la evaluación es lo que justifica el precio y evita malentendidos en recepción.",
    }),
    defineField({
      name: "comoEsElProceso",
      title: "¿Cómo es el proceso?",
      type: "array",
      of: [
        {
          type: "object",
          name: "paso",
          fields: [
            defineField({
              name: "titulo",
              title: "Nombre del paso",
              type: "string",
              validation: (r) => r.required(),
            }),
            defineField({
              name: "descripcion",
              title: "¿Qué pasa en este paso?",
              type: "text",
              rows: 3,
            }),
          ],
          preview: { select: { title: "titulo", subtitle: "descripcion" } },
        },
      ],
    }),
    defineField({
      name: "queEsperarDespues",
      title: "¿Qué pasa después de la evaluación?",
      type: "text",
      rows: 4,
      description:
        "Si el paciente se lleva un plan de tratamiento y un presupuesto, decirlo. Es lo que convierte la evaluación en tratamiento.",
    }),
    defineField({
      name: "quienLaAtiende",
      title: "¿Quién atiende la evaluación?",
      type: "reference",
      to: [{ type: "miembroEquipo" }],
      description:
        "Que la evaluación la haga una persona con nombre y credencial verificable cambia la percepción del precio.",
    }),
    defineField({
      name: "vigenciaPromocion",
      title: "¿Hasta cuándo está vigente?",
      type: "string",
      description:
        "Déjalo vacío si no tiene fecha de fin. Si la tiene, se muestra en la página.",
    }),
    defineField({
      name: "enlaceReserva",
      title: "Enlace de reserva",
      type: "url",
      description:
        "El enlace de Doctocliq para esta evaluación. La web le añade sola las etiquetas de seguimiento (UTM).",
      validation: (r) => r.uri({ scheme: ["http", "https"] }),
    }),
  ],
  preview: {
    select: { title: "titulo", subtitle: "precio" },
    prepare({ title, subtitle }) {
      return { title: title ?? "Evaluación matutina", subtitle };
    },
  },
});
