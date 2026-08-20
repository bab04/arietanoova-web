import { defineField, defineType } from "sanity";

/**
 * PÁGINA DE DERIVACIÓN — singleton (/para-odontologos)
 *
 * En las clínicas de especialistas el canal de captación real son otros
 * dentistas. Esta página es para ellos, no para pacientes.
 *
 * `ofreceMentorias` existe porque la directora mencionó que algunos colegas
 * le piden asesoría para resolver ellos el caso. Es un modelo distinto a
 * la derivación y hay que poder activarlo o no sin tocar código.
 */
export const paginaDerivacion = defineType({
  name: "paginaDerivacion",
  title: "Página para odontólogos",
  type: "document",
  groups: [
    { name: "contenido", title: "Contenido", default: true },
    { name: "mentorias", title: "Mentorías" },
  ],
  fields: [
    defineField({
      name: "titulo",
      title: "Título de la página",
      type: "string",
      group: "contenido",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "intro",
      title: "Introducción",
      type: "text",
      rows: 4,
      group: "contenido",
      description:
        "Dos o tres frases dirigidas a un colega, no a un paciente. Qué relación propone la clínica.",
    }),
    defineField({
      name: "tiposDeCasoQueRecibimos",
      title: "¿Qué casos reciben?",
      type: "array",
      of: [{ type: "string" }],
      group: "contenido",
      description:
        "Una línea por tipo de caso. Cuanto más específico, más fácil le resulta al colega saber si su caso encaja.",
    }),
    defineField({
      name: "comoDerivar",
      title: "¿Cómo se deriva un paciente?",
      type: "array",
      group: "contenido",
      description: "Los pasos concretos. Es el contenido que más se consulta de esta página.",
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
      name: "comoCoordinamos",
      title: "¿Cómo se coordina el caso?",
      type: "text",
      rows: 4,
      group: "contenido",
      description: "Quién habla con quién, en qué momento y por qué vía.",
    }),
    defineField({
      name: "comoInformamosAlColega",
      title: "¿Cómo se informa al colega?",
      type: "text",
      rows: 4,
      group: "contenido",
      description:
        "El miedo real de quien deriva es perder al paciente. Esta respuesta es la que desactiva ese miedo.",
    }),
    defineField({
      name: "queSucedeDespues",
      title: "¿Qué sucede después del tratamiento?",
      type: "text",
      rows: 4,
      group: "contenido",
      description: "Si el paciente vuelve al colega derivante, decirlo aquí y explícitamente.",
    }),
    defineField({
      name: "ofreceMentorias",
      title: "¿Se ofrecen mentorías?",
      type: "boolean",
      group: "mentorias",
      description:
        "Algunos colegas no quieren derivar: quieren asesoría para resolver ellos el caso. Actívalo solo si la clínica está tomando ese tipo de solicitud.",
      initialValue: false,
    }),
    defineField({
      name: "descripcionMentorias",
      title: "¿En qué consisten las mentorías?",
      type: "text",
      rows: 5,
      group: "mentorias",
      description: "Solo se muestra si las mentorías están activadas.",
      hidden: ({ document }) => !document?.ofreceMentorias,
    }),
    defineField({
      name: "correoParaRadiografias",
      title: "Correo para recibir radiografías",
      type: "string",
      group: "contenido",
      description:
        "Se muestra como alternativa al formulario, para colegas que prefieren enviar por correo.",
      validation: (r) =>
        r.regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, { name: "correo" }).error(
          "Escribe una dirección de correo válida.",
        ),
    }),
  ],
  preview: {
    select: { title: "titulo" },
    prepare({ title }) {
      return { title: title ?? "Página para odontólogos" };
    },
  },
});
