import { defineField, defineType } from "sanity";

/**
 * TECNOLOGÍA
 *
 * La clínica tiene escáner intraoral 3D y hoy no lo está usando como
 * argumento en ningún lado. El campo que sostiene esta sección no es
 * `descripcion` sino `queSignificaParaElPaciente`: el equipo importa por
 * lo que le ahorra a quien se sienta en el sillón, no por su ficha técnica.
 */
export const tecnologia = defineType({
  name: "tecnologia",
  title: "Tecnología",
  type: "document",
  fields: [
    defineField({
      name: "nombre",
      title: "Nombre del equipo o técnica",
      type: "string",
      description: "Ej.: Escáner intraoral 3D. Flujo digital de trabajo.",
      validation: (r) => r.required().error("El nombre es obligatorio."),
    }),
    defineField({
      name: "slug",
      title: "Dirección web",
      type: "slug",
      options: { source: "nombre", maxLength: 96 },
    }),
    defineField({
      name: "descripcion",
      title: "¿Qué es?",
      type: "text",
      rows: 4,
      description: "Explicación breve. Qué hace el equipo.",
    }),
    defineField({
      name: "queSignificaParaElPaciente",
      title: "¿Qué le cambia al paciente?",
      type: "text",
      rows: 4,
      description:
        "El campo que más pesa de esta ficha. Sin pasta de impresión, sin arcadas, resultado el mismo día, menos citas. Concreto, no adjetivos.",
    }),
    defineField({
      name: "imagen",
      title: "Imagen",
      type: "image",
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
      name: "orden",
      title: "Orden en el listado",
      type: "number",
      initialValue: 0,
    }),
  ],
  orderings: [
    {
      title: "Orden definido",
      name: "ordenAsc",
      by: [
        { field: "orden", direction: "asc" },
        { field: "nombre", direction: "asc" },
      ],
    },
  ],
  preview: {
    select: { title: "nombre", subtitle: "queSignificaParaElPaciente", media: "imagen" },
  },
});
