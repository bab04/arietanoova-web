import type { DocumentActionComponent } from "sanity";
import type { StructureResolver } from "sanity/structure";

import { TIPOS_SINGLETON } from "./schemas";

/**
 * Barra lateral del Studio.
 *
 * Se define a mano por dos razones:
 *   1. Los tres singletons (ajustes, derivación, evaluación) se abren como
 *      un documento, no como una lista donde se podría crear un segundo.
 *   2. El orden que ve la doctora refleja el orden en que va a cargar el
 *      contenido, no el orden alfabético de los tipos.
 */
export const estructura: StructureResolver = (S) =>
  S.list()
    .title("ArietaNoova")
    .items([
      S.listItem()
        .title("Especialidades")
        .child(S.documentTypeList("especialidad").title("Especialidades")),

      S.listItem()
        .title("Equipo")
        .child(S.documentTypeList("miembroEquipo").title("Equipo")),

      S.listItem()
        .title("Tecnología")
        .child(S.documentTypeList("tecnologia").title("Tecnología")),

      S.divider(),

      S.listItem()
        .title("Problemas (Fase 2)")
        .child(S.documentTypeList("problema").title("Problemas")),

      S.listItem()
        .title("Casos (Fase 2)")
        .child(S.documentTypeList("caso").title("Casos")),

      S.divider(),

      S.listItem()
        .title("Evaluación matutina")
        .id("paginaEvaluacion")
        .child(
          S.document().schemaType("paginaEvaluacion").documentId("paginaEvaluacion"),
        ),

      S.listItem()
        .title("Página para odontólogos")
        .id("paginaDerivacion")
        .child(
          S.document().schemaType("paginaDerivacion").documentId("paginaDerivacion"),
        ),

      S.listItem()
        .title("Formas de pago")
        .id("paginaFormasDePago")
        .child(
          S.document().schemaType("paginaFormasDePago").documentId("paginaFormasDePago"),
        ),

      S.divider(),

      S.listItem()
        .title("Ajustes del sitio")
        .id("ajustesSitio")
        .child(S.document().schemaType("ajustesSitio").documentId("ajustesSitio")),
    ]);

/**
 * Los singletons no se pueden duplicar, despublicar ni borrar desde el Studio.
 * Sin esto, un clic accidental deja el sitio sin teléfono ni horarios.
 */
export function accionesPorTipo(
  acciones: DocumentActionComponent[],
  tipo: string,
): DocumentActionComponent[] {
  if (!(TIPOS_SINGLETON as readonly string[]).includes(tipo)) return acciones;

  const prohibidas = new Set(["unpublish", "delete", "duplicate"]);
  return acciones.filter((accion) => !accion.action || !prohibidas.has(accion.action));
}
