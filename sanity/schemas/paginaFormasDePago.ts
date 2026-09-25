import { defineField, defineType } from "sanity";

/**
 * PÁGINA DE FORMAS DE PAGO — singleton (/formas-de-pago)
 *
 * Explica con transparencia cómo funciona el presupuesto y el pago
 * en la clínica, sin publicar un tarifario cerrado pero resolviendo
 * la ansiedad principal del paciente.
 */
export const paginaFormasDePago = defineType({
  name: "paginaFormasDePago",
  title: "Formas de pago",
  type: "document",
  groups: [
    { name: "contenido", title: "Contenido", default: true },
    { name: "seo", title: "Buscadores" },
  ],
  fields: [
    defineField({
      name: "titulo",
      title: "Título de la página",
      type: "string",
      group: "contenido",
      initialValue: "Formas de pago y facilidades",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "intro",
      title: "Introducción",
      type: "text",
      rows: 3,
      group: "contenido",
      description: "Explicación breve de nuestro compromiso con la claridad y previsibilidad en cada presupuesto.",
    }),
    defineField({
      name: "notaTransparencia",
      title: "Nota sobre transparencia (por qué no publicamos lista de precios)",
      type: "text",
      rows: 4,
      group: "contenido",
      description:
        "Explica con claridad que cada boca y caso requiere diagnóstico personalizado con escáner 3D antes de determinar el plan de tratamiento exacto.",
    }),
    defineField({
      name: "comoSeEntregaElPresupuesto",
      title: "¿Cuándo y cómo se entrega el presupuesto?",
      type: "text",
      rows: 4,
      group: "contenido",
      description: "Detalla si la entrega es inmediata o tras estudio, el soporte por escrito y si tiene costo.",
    }),
    defineField({
      name: "modalidadesDePago",
      title: "Modalidades de pago aceptadas",
      type: "array",
      group: "contenido",
      description: "Efectivo, tarjetas de débito/crédito, transferencias bancarias, billeteras digitales.",
      of: [
        {
          type: "object",
          name: "modalidad",
          fields: [
            defineField({
              name: "nombre",
              title: "Modalidad",
              type: "string",
              validation: (r) => r.required(),
            }),
            defineField({
              name: "descripcion",
              title: "Detalle o condiciones",
              type: "text",
              rows: 2,
            }),
          ],
          preview: { select: { title: "nombre", subtitle: "descripcion" } },
        },
      ],
    }),
    defineField({
      name: "financiamiento",
      title: "Opciones de financiamiento",
      type: "array",
      group: "contenido",
      description: "Planes por cuotas según avances de tratamiento, ortodoncia financiada, convenios bancarios.",
      of: [
        {
          type: "object",
          name: "opcionFinanciamiento",
          fields: [
            defineField({
              name: "nombre",
              title: "Plan de financiamiento",
              type: "string",
              validation: (r) => r.required(),
            }),
            defineField({
              name: "descripcion",
              title: "Cómo funciona",
              type: "text",
              rows: 2,
              validation: (r) => r.required(),
            }),
            defineField({
              name: "requisitos",
              title: "Requisitos o condiciones",
              type: "string",
            }),
          ],
          preview: { select: { title: "nombre", subtitle: "descripcion" } },
        },
      ],
    }),
    defineField({
      name: "coberturaSeguros",
      title: "Cobertura de seguros y reembolsos",
      type: "text",
      rows: 4,
      group: "contenido",
      description: "Cómo apoyamos al paciente con los informes y boletas detalladas para reembolso con su seguro particular o EPS.",
    }),
    defineField({
      name: "preguntasFrecuentes",
      title: "Preguntas frecuentes sobre pagos",
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
              rows: 3,
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
      validation: (r) => r.max(60).warning("Idealmente menos de 60 caracteres."),
    }),
    defineField({
      name: "seoDescripcion",
      title: "Descripción para Google",
      type: "text",
      rows: 3,
      group: "seo",
      validation: (r) => r.max(160).warning("Máximo 160 caracteres."),
    }),
  ],
  preview: {
    select: { title: "titulo" },
    prepare({ title }) {
      return { title: title || "Formas de pago" };
    },
  },
});
