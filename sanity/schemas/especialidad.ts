import { defineField, defineType } from "sanity";

/**
 * ESPECIALIDAD — el esquema mas importante del sprint.
 *
 * Los campos de este archivo son, literalmente, el cuestionario que se le
 * envia a la Dra. Arieta para que aporte el contenido. Cada `description`
 * esta redactada como una pregunta dirigida a ella, no como una nota tecnica.
 * Si un campo no se puede explicar en una pregunta clara, sobra.
 */
export const especialidad = defineType({
  name: "especialidad",
  title: "Especialidad",
  type: "document",
  groups: [
    { name: "contenido", title: "Contenido", default: true },
    { name: "relaciones", title: "Equipo y tecnología" },
    { name: "seo", title: "Buscadores" },
  ],
  fields: [
    defineField({
      name: "nombre",
      title: "Nombre de la especialidad",
      type: "string",
      group: "contenido",
      description: "Como se llama en la clínica. Ej.: Ortodoncia y ortopedia maxilar.",
      validation: (r) => r.required().error("El nombre es obligatorio."),
    }),
    defineField({
      name: "slug",
      title: "Dirección web",
      type: "slug",
      group: "contenido",
      description:
        "Se genera sola a partir del nombre. Es la parte final de la URL: /especialidades/endodoncia",
      options: { source: "nombre", maxLength: 96 },
      validation: (r) => r.required().error("La dirección web es obligatoria."),
    }),
    defineField({
      name: "resumenCorto",
      title: "Resumen en una o dos frases",
      type: "text",
      rows: 3,
      group: "contenido",
      description:
        "Máximo 160 caracteres. Es lo que se lee en la tarjeta del índice y lo que Google muestra debajo del título en los resultados de búsqueda.",
      validation: (r) =>
        r.max(160).warning("Pasa de 160 caracteres: Google va a recortarlo en los resultados."),
    }),
    defineField({
      name: "paraQuien",
      title: "¿A qué paciente le sirve?",
      type: "text",
      rows: 4,
      group: "contenido",
      description:
        "Descríbelo en el lenguaje del paciente, no en el del odontólogo. ¿Qué le está pasando a alguien que necesita esta especialidad?",
    }),
    defineField({
      name: "queIncluye",
      title: "¿Qué incluye?",
      type: "array",
      of: [{ type: "string" }],
      group: "contenido",
      description:
        "Una línea por punto. Lo que el paciente recibe concretamente al tratarse aquí.",
    }),
    defineField({
      name: "comoEsElProceso",
      title: "¿Cómo es el proceso?",
      type: "array",
      group: "contenido",
      description:
        "Los pasos desde que el paciente llega hasta que termina. Es la pregunta que más hacen antes de reservar.",
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
          preview: {
            select: { title: "titulo", subtitle: "descripcion" },
          },
        },
      ],
    }),
    defineField({
      name: "queEsperarDespues",
      title: "¿Qué esperar después?",
      type: "text",
      rows: 4,
      group: "contenido",
      description:
        "Molestias normales, cuidados, cuándo vuelve a control. Baja la ansiedad y reduce llamadas al consultorio.",
    }),
    defineField({
      name: "duracionPrimeraCita",
      title: "¿Cuánto dura la primera cita?",
      type: "string",
      group: "contenido",
      description:
        "Ej.: 45 minutos. Cuantificar la primera visita es lo que mejor funciona en las clínicas de especialistas de referencia.",
    }),
    defineField({
      name: "especialistas",
      title: "¿Quiénes la atienden?",
      type: "array",
      group: "relaciones",
      of: [{ type: "reference", to: [{ type: "miembroEquipo" }] }],
      description:
        "Selecciona del equipo ya cargado. Si falta alguien, créalo primero en Equipo.",
    }),
    defineField({
      name: "tecnologiaRelacionada",
      title: "¿Qué tecnología se usa?",
      type: "array",
      group: "relaciones",
      of: [{ type: "reference", to: [{ type: "tecnologia" }] }],
      description:
        "Ej.: el escáner intraoral 3D. Selecciona de lo ya cargado en Tecnología.",
    }),
    defineField({
      name: "faqs",
      title: "Preguntas frecuentes",
      type: "array",
      group: "contenido",
      description:
        "Las preguntas que realmente hacen los pacientes en el consultorio. Google las muestra directamente en los resultados de búsqueda.",
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
      name: "ctaVariante",
      title: "¿Qué debe decir el botón de esta página?",
      type: "string",
      group: "contenido",
      description:
        "Cada especialidad pide un paso distinto: en Ortodoncia consultar sobre mi caso, en Rehabilitación solicitar evaluación, en la matutina reservar.",
      options: {
        list: [
          { title: "Reservar cita", value: "reservar" },
          { title: "Consultar sobre mi caso", value: "consultar" },
          { title: "Solicitar evaluación", value: "evaluacion" },
        ],
        layout: "radio",
      },
      initialValue: "reservar",
    }),
    defineField({
      name: "imagenPrincipal",
      title: "Imagen principal",
      type: "image",
      group: "contenido",
      options: { hotspot: true },
      description:
        "Foto real de la clínica o del tratamiento. El recorte se ajusta solo en móvil si marcas el punto de interés.",
      fields: [
        defineField({
          name: "alt",
          title: "Descripción de la imagen",
          type: "string",
          description:
            "Qué se ve en la foto. Lo leen las personas ciegas y lo usa Google. Obligatorio si subes imagen.",
          validation: (r) =>
            r.custom((valor, contexto) => {
              const padre = contexto.parent as { asset?: unknown } | undefined;
              if (padre?.asset && !valor) return "Describe la imagen para que sea accesible.";
              return true;
            }),
        }),
      ],
    }),
    defineField({
      name: "seoTitulo",
      title: "Título para Google",
      type: "string",
      group: "seo",
      description:
        "Si lo dejas vacío se usa el nombre de la especialidad. Ideal: menos de 60 caracteres e incluir Pueblo Libre o Lima.",
      validation: (r) => r.max(60).warning("Pasa de 60 caracteres: Google lo va a recortar."),
    }),
    defineField({
      name: "seoDescripcion",
      title: "Descripción para Google",
      type: "text",
      rows: 3,
      group: "seo",
      description: "Si la dejas vacía se usa el resumen corto. Máximo 160 caracteres.",
      validation: (r) => r.max(160).warning("Pasa de 160 caracteres: Google la va a recortar."),
    }),
    defineField({
      name: "enlaceFormasDePagoTexto",
      title: "Texto del bloque de formas de pago",
      type: "string",
      group: "contenido",
      description:
        "Texto configurable para el bloque de enlace hacia /formas-de-pago al final de la página.",
      initialValue: "Conoce nuestras modalidades de pago y facilidades de financiamiento",
    }),
    defineField({
      name: "orden",
      title: "Orden en el índice",
      type: "number",
      group: "contenido",
      description: "Número menor aparece primero. Deja 0 si no importa.",
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
    select: { title: "nombre", subtitle: "resumenCorto", media: "imagenPrincipal" },
  },
});
