import { defineField, defineType } from "sanity";

/**
 * MIEMBRO DEL EQUIPO
 *
 * Regla legal y de posicionamiento que atraviesa todo el sitio:
 * tres profesionales tienen el RNE en trámite. Mientras `rneEstado` sea
 * "en-tramite", la interfaz muestra "Cirujano Dentista – [Especialidad]"
 * y NUNCA la palabra "Especialista".
 *
 * Esa decisión no se toma en el componente: se calcula una sola vez en
 * lib/equipo.ts (tituloProfesional) y todos los componentes la consumen.
 */
export const miembroEquipo = defineType({
  name: "miembroEquipo",
  title: "Equipo",
  type: "document",
  groups: [
    { name: "identidad", title: "Identidad", default: true },
    { name: "credenciales", title: "Credenciales" },
    { name: "perfil", title: "Perfil" },
  ],
  fields: [
    defineField({
      name: "nombre",
      title: "Nombre completo",
      type: "string",
      group: "identidad",
      description: "Sin el Dr. o Dra. delante: eso lo pone la web sola.",
      validation: (r) => r.required().error("El nombre es obligatorio."),
    }),
    defineField({
      name: "slug",
      title: "Dirección web",
      type: "slug",
      group: "identidad",
      options: { source: "nombre", maxLength: 96 },
      validation: (r) => r.required().error("La dirección web es obligatoria."),
    }),
    defineField({
      name: "cargo",
      title: "Cargo en la clínica",
      type: "string",
      group: "identidad",
      description: "Ej.: Directora médica, Especialista en endodoncia, Cirujano dentista.",
    }),
    defineField({
      name: "especialidad",
      title: "Especialidad",
      type: "string",
      group: "identidad",
      description:
        "Escrita como se dice: Endodoncia, Ortodoncia, Rehabilitación oral. Se usa para armar el título profesional.",
    }),
    defineField({
      name: "colegiatura",
      title: "Número de COP",
      type: "string",
      group: "credenciales",
      description: "Colegio Odontológico del Perú. Solo el número.",
      validation: (r) => r.required().error("La colegiatura es obligatoria: es la credencial verificable."),
    }),
    defineField({
      name: "rne",
      title: "Número de RNE",
      type: "string",
      group: "credenciales",
      description:
        "Registro Nacional de Especialistas. Déjalo vacío si aún no lo tiene asignado.",
    }),
    defineField({
      name: "rneEstado",
      title: "Estado del RNE",
      type: "string",
      group: "credenciales",
      description:
        "Si está en trámite, la web muestra Cirujano Dentista y nunca la palabra Especialista. Es una regla legal, no una preferencia de redacción.",
      options: {
        list: [
          { title: "Vigente", value: "vigente" },
          { title: "En trámite", value: "en-tramite" },
        ],
        layout: "radio",
      },
      initialValue: "en-tramite",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "formacion",
      title: "Formación",
      type: "array",
      of: [{ type: "string" }],
      group: "credenciales",
      description:
        "Una línea por estudio. Ej.: Especialidad en Endodoncia, UPCH, 2019. Universidad y año dan más peso que el título solo.",
    }),
    defineField({
      name: "aniosExperiencia",
      title: "Años de experiencia",
      type: "number",
      group: "credenciales",
      description: "Se usa en el contador de la portada.",
      validation: (r) => r.min(0).max(70),
    }),
    defineField({
      name: "bio",
      title: "Reseña breve",
      type: "text",
      rows: 5,
      group: "perfil",
      description:
        "Tres o cuatro frases. Qué casos atiende y qué le importa al tratarlos. En primera o tercera persona, pero igual para todo el equipo.",
    }),
    defineField({
      name: "foto",
      title: "Fotografía",
      type: "image",
      group: "perfil",
      options: { hotspot: true },
      description: "Marca el punto de interés sobre el rostro para que el recorte no lo corte.",
      fields: [
        defineField({
          name: "alt",
          title: "Descripción de la imagen",
          type: "string",
          description: "Si la dejas vacía se usa el nombre de la persona.",
        }),
      ],
    }),
    defineField({
      name: "esDirectora",
      title: "¿Es la directora?",
      type: "boolean",
      group: "identidad",
      description: "Aparece primero en Equipo y destacada en la portada.",
      initialValue: false,
    }),
    defineField({
      name: "orden",
      title: "Orden en el listado",
      type: "number",
      group: "identidad",
      description: "Número menor aparece primero. La directora va siempre delante.",
      initialValue: 0,
    }),
  ],
  orderings: [
    {
      title: "Directora primero, luego orden",
      name: "jerarquia",
      by: [
        { field: "esDirectora", direction: "desc" },
        { field: "orden", direction: "asc" },
        { field: "nombre", direction: "asc" },
      ],
    },
  ],
  preview: {
    select: {
      title: "nombre",
      cargo: "cargo",
      estado: "rneEstado",
      media: "foto",
    },
    prepare({ title, cargo, estado, media }) {
      const aviso = estado === "en-tramite" ? " · RNE en trámite" : "";
      return { title, subtitle: `${cargo ?? "Sin cargo"}${aviso}`, media };
    },
  },
});
