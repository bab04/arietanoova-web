import { defineField, defineType } from "sanity";

/**
 * AJUSTES DEL SITIO — singleton.
 *
 * Datos de contacto, horarios y enlaces que aparecen en el encabezado,
 * el pie, la barra móvil, el JSON-LD de la portada y la página de contacto.
 * Cambiar el teléfono aquí lo cambia en los seis sitios a la vez.
 */
export const ajustesSitio = defineType({
  name: "ajustesSitio",
  title: "Ajustes del sitio",
  type: "document",
  groups: [
    { name: "identidad", title: "Identidad", default: true },
    { name: "contacto", title: "Contacto" },
    { name: "horarios", title: "Horarios" },
    { name: "enlaces", title: "Enlaces" },
  ],
  fields: [
    defineField({
      name: "nombreClinica",
      title: "Nombre de la clínica",
      type: "string",
      group: "identidad",
      description: "Debe coincidir letra por letra con la ficha de Google Business.",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "direccion",
      title: "Dirección",
      type: "string",
      group: "contacto",
      description: "Calle y número, sin la oficina. Debe coincidir con la ficha de Google.",
    }),
    defineField({
      name: "oficina",
      title: "Oficina",
      type: "string",
      group: "contacto",
      description:
        "Ej.: Of. 204. Va en campo aparte porque se omite en el mapa pero es imprescindible para que el paciente encuentre la puerta.",
    }),
    defineField({
      name: "distrito",
      title: "Distrito",
      type: "string",
      group: "contacto",
      initialValue: "Pueblo Libre",
    }),
    defineField({
      name: "ciudad",
      title: "Ciudad",
      type: "string",
      group: "contacto",
      initialValue: "Lima",
    }),
    defineField({
      name: "telefono",
      title: "Teléfono",
      type: "string",
      group: "contacto",
      description: "Como se marca desde un celular en Perú.",
    }),
    defineField({
      name: "whatsapp",
      title: "WhatsApp",
      type: "string",
      group: "contacto",
      description:
        "Formato internacional sin signos ni espacios: 51 seguido del número. Ej.: 51987654321",
    }),
    defineField({
      name: "correoNotificaciones",
      title: "Correo para recibir los formularios",
      type: "string",
      group: "contacto",
      description: "Aquí llegan los envíos de contacto y de derivación.",
      validation: (r) =>
        r.regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, { name: "correo" }).error(
          "Escribe una dirección de correo válida.",
        ),
    }),
    defineField({
      name: "horarios",
      title: "Horarios de atención",
      type: "array",
      group: "horarios",
      description:
        "Un renglón por día. Deben coincidir con la ficha de Google: si no coinciden, Google penaliza la ficha.",
      of: [
        {
          type: "object",
          name: "horario",
          fields: [
            defineField({
              name: "dia",
              title: "Día",
              type: "string",
              options: {
                list: [
                  { title: "Lunes", value: "lunes" },
                  { title: "Martes", value: "martes" },
                  { title: "Miércoles", value: "miercoles" },
                  { title: "Jueves", value: "jueves" },
                  { title: "Viernes", value: "viernes" },
                  { title: "Sábado", value: "sabado" },
                  { title: "Domingo", value: "domingo" },
                ],
              },
              validation: (r) => r.required(),
            }),
            defineField({
              name: "cerrado",
              title: "Cerrado",
              type: "boolean",
              initialValue: false,
            }),
            defineField({
              name: "apertura",
              title: "Abre",
              type: "string",
              description: "Formato de 24 horas: 08:00",
              hidden: ({ parent }) => Boolean(parent?.cerrado),
            }),
            defineField({
              name: "cierre",
              title: "Cierra",
              type: "string",
              description: "Formato de 24 horas: 19:00",
              hidden: ({ parent }) => Boolean(parent?.cerrado),
            }),
          ],
          preview: {
            select: { dia: "dia", apertura: "apertura", cierre: "cierre", cerrado: "cerrado" },
            prepare({ dia, apertura, cierre, cerrado }) {
              return {
                title: dia ?? "Sin día",
                subtitle: cerrado ? "Cerrado" : `${apertura ?? "?"} – ${cierre ?? "?"}`,
              };
            },
          },
        },
      ],
    }),
    defineField({
      name: "googleMapsUrl",
      title: "Enlace de Google Maps",
      type: "url",
      group: "enlaces",
      description: "El enlace de Cómo llegar. Se abre en una pestaña nueva.",
      validation: (r) => r.uri({ scheme: ["http", "https"] }),
    }),
    defineField({
      name: "googleMapsEmbed",
      title: "Enlace del mapa incrustado",
      type: "url",
      group: "enlaces",
      description:
        "En Google Maps: Compartir > Insertar un mapa. Pega solo la dirección que aparece dentro de src.",
      validation: (r) => r.uri({ scheme: ["http", "https"] }),
    }),
    defineField({
      name: "enlacesDoctocliq",
      title: "Enlaces de reserva de Doctocliq",
      type: "array",
      group: "enlaces",
      description:
        "Uno por especialista o por tipo de cita. La web les añade sola las etiquetas de seguimiento.",
      of: [
        {
          type: "object",
          name: "enlaceDoctocliq",
          fields: [
            defineField({
              name: "etiqueta",
              title: "Etiqueta",
              type: "string",
              description: "Lo que lee el paciente. Ej.: Reservar con la Dra. Arieta.",
              validation: (r) => r.required(),
            }),
            defineField({
              name: "url",
              title: "Enlace",
              type: "url",
              validation: (r) => r.required().uri({ scheme: ["http", "https"] }),
            }),
            defineField({
              name: "especialista",
              title: "Especialista",
              type: "reference",
              to: [{ type: "miembroEquipo" }],
              description: "Opcional. Sirve para saber qué agenda se llena desde la web.",
            }),
          ],
          preview: { select: { title: "etiqueta", subtitle: "url" } },
        },
      ],
    }),
    defineField({
      name: "redes",
      title: "Redes sociales",
      type: "array",
      group: "enlaces",
      of: [
        {
          type: "object",
          name: "red",
          fields: [
            defineField({
              name: "plataforma",
              title: "Plataforma",
              type: "string",
              options: {
                list: [
                  { title: "Instagram", value: "instagram" },
                  { title: "Facebook", value: "facebook" },
                  { title: "TikTok", value: "tiktok" },
                  { title: "YouTube", value: "youtube" },
                  { title: "LinkedIn", value: "linkedin" },
                ],
              },
              validation: (r) => r.required(),
            }),
            defineField({
              name: "url",
              title: "Enlace",
              type: "url",
              validation: (r) => r.required().uri({ scheme: ["http", "https"] }),
            }),
          ],
          preview: { select: { title: "plataforma", subtitle: "url" } },
        },
      ],
    }),
  ],
  preview: {
    select: { title: "nombreClinica" },
    prepare({ title }) {
      return { title: title ?? "Ajustes del sitio" };
    },
  },
});
