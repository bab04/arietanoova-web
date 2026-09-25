#!/usr/bin/env node
/**
 * Genera el cuestionario para la Dra. Arieta a partir de los esquemas de
 * Sanity.
 *
 * La razón de generarlo en vez de escribirlo: el prompt del sprint dice que
 * los campos del esquema `especialidad` SON el cuestionario. Si se escriben
 * a mano en un documento aparte, los dos se separan en cuanto alguien
 * añada un campo. Generándolo, la única fuente de verdad sigue siendo el
 * esquema.
 *
 * Uso:  npm run cuestionario
 * Salida: CUESTIONARIO-DRA-ARIETA.md
 */

import { writeFileSync } from "node:fs";
import { join } from "node:path";

// Los esquemas están en TypeScript, así que se ejecuta con tsx.
const { especialidad } = await import("../sanity/schemas/especialidad.ts");
const { miembroEquipo } = await import("../sanity/schemas/miembroEquipo.ts");
const { tecnologia } = await import("../sanity/schemas/tecnologia.ts");
const { paginaEvaluacion } = await import("../sanity/schemas/paginaEvaluacion.ts");
const { paginaDerivacion } = await import("../sanity/schemas/paginaDerivacion.ts");

/** Campos que son de configuración técnica, no preguntas para la doctora. */
const OMITIR = new Set(["slug", "orden", "seoTitulo", "seoDescripcion"]);

function tipoLegible(campo) {
  const nombre = campo.name;
  const tipo = campo.type;

  if (tipo === "array") {
    const de = campo.of?.[0];
    if (de?.type === "reference") return "Selección de lo ya cargado";
    if (de?.type === "string") return "Lista (una línea por punto)";
    if (de?.type === "object") {
      const subcampos = (de.fields ?? []).map((f) => f.title ?? f.name).join(" + ");
      return `Lista de bloques (${subcampos})`;
    }
    return "Lista";
  }

  if (tipo === "boolean") return "Sí / No";
  if (tipo === "image") return "Fotografía";
  if (tipo === "reference") return "Selección de lo ya cargado";
  if (tipo === "number") return "Número";
  if (tipo === "url") return "Enlace";
  if (tipo === "text") return "Texto largo";
  if (campo.options?.list) {
    return `Opción: ${campo.options.list.map((o) => o.title ?? o.value).join(" / ")}`;
  }
  if (nombre.toLowerCase().includes("correo")) return "Correo electrónico";
  return "Texto breve";
}

function esObligatorio(campo) {
  // La validación se declara como función; se inspecciona su código fuente,
  // que es suficiente para distinguir required() de las advertencias.
  const fuente = campo.validation?.toString() ?? "";
  return fuente.includes("required()");
}

function seccion(esquema, titulo, nota) {
  const campos = (esquema.fields ?? []).filter((c) => !OMITIR.has(c.name));

  const lineas = [`## ${titulo}`, ""];
  if (nota) lineas.push(`> ${nota}`, "");

  for (const campo of campos) {
    const marca = esObligatorio(campo) ? " **(obligatorio)**" : "";
    lineas.push(`### ${campo.title ?? campo.name}${marca}`);
    lineas.push("");
    if (campo.description) {
      lineas.push(campo.description);
      lineas.push("");
    }
    lineas.push(`*Formato:* ${tipoLegible(campo)}`);
    lineas.push("");
    lineas.push("**Respuesta:**");
    lineas.push("");
    lineas.push("");
    lineas.push("---");
    lineas.push("");
  }

  return lineas.join("\n");
}

const ESPECIALIDADES_INICIALES = [
  "Ortodoncia y ortopedia maxilar",
  "Endodoncia",
  "Rehabilitación oral",
  "Cirugía oral",
  "Odontopediatría",
  "Periodoncia",
];

const hoy = new Date().toLocaleDateString("es-PE", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

const documento = `# Cuestionario de contenido — ArietaNoova

**Para:** Dra. Arieta
**De:** Benjamín Arancibia
**Fecha:** ${hoy}

---

## Cómo usar este documento

Cada pregunta corresponde a un campo real de la web. Lo que responda aquí
es literalmente lo que va a leer un paciente: no hay una etapa posterior de
reescritura, así que conviene responder en el lenguaje con el que le habla
a alguien sentado en el sillón.

**Tres cosas que ayudan más de lo que parece:**

1. **Responder en lenguaje de paciente, no de odontólogo.** "Se le mueve un
   diente" funciona mejor que "movilidad dentaria grado II".
2. **Números concretos.** "45 minutos", "tres sesiones", "25 años". Las
   cifras hacen más por la confianza que los adjetivos.
3. **Dejar en blanco lo que no aplique.** Un campo vacío no rompe nada: la
   web simplemente no muestra esa sección. Es preferible a rellenarlo por
   rellenar.

**El bloque de Especialidad hay que responderlo seis veces**, una por cada
una:

${ESPECIALIDADES_INICIALES.map((e) => `- ${e}`).join("\n")}

---

${seccion(
  especialidad,
  "1. Especialidad",
  "Responder una vez por cada especialidad de la lista de arriba.",
)}
${seccion(
  miembroEquipo,
  "2. Cada integrante del equipo",
  "Responder una vez por cada profesional, incluida usted.",
)}
${seccion(
  tecnologia,
  "3. Cada equipo o técnica",
  "El escáner intraoral 3D es el más importante: hoy no aparece en ningún lado de su comunicación.",
)}
${seccion(
  paginaEvaluacion,
  "4. Evaluación matutina",
  "Es la página que busca llenar los turnos vacíos de la mañana. Se responde una sola vez.",
)}
${seccion(
  paginaDerivacion,
  "5. Página para odontólogos",
  "Dirigida a colegas que derivan pacientes, no a pacientes. Se responde una sola vez.",
)}
## Lo que no está en este cuestionario

Estos datos los necesito también, pero no van en la web como texto:

- **Fotografías**: del local, del equipo y de los profesionales. Son el
  insumo que más condiciona el resultado final.
- **Enlaces de Doctocliq**: uno por especialista o por tipo de cita.
- **Enlace del mapa de Google**: desde su ficha de Google Business.
- **Correo** donde quiere recibir los formularios de la web.
- **Casos con consentimiento firmado**, si quiere que la sección de casos
  arranque en la segunda fase.

---

*Generado automáticamente desde los esquemas del gestor de contenido.
Si un campo cambia en la web, este documento cambia con él.*
`;

const salida = join(process.cwd(), "CUESTIONARIO-DRA-ARIETA.md");
writeFileSync(salida, documento, "utf8");

console.log(`✓ Cuestionario generado: ${salida}`);
console.log(`  ${documento.split("\n").length} líneas`);
