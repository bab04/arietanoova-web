import type { SchemaTypeDefinition } from "sanity";

import { ajustesSitio } from "./ajustesSitio";
import { caso } from "./caso";
import { especialidad } from "./especialidad";
import { miembroEquipo } from "./miembroEquipo";
import { paginaDerivacion } from "./paginaDerivacion";
import { paginaEvaluacion } from "./paginaEvaluacion";
import { problema } from "./problema";
import { tecnologia } from "./tecnologia";

export const schemaTypes: SchemaTypeDefinition[] = [
  // Contenido con muchas entradas
  especialidad,
  problema,
  miembroEquipo,
  tecnologia,
  caso,
  // Páginas únicas
  paginaEvaluacion,
  paginaDerivacion,
  ajustesSitio,
];

/** Documentos que existen una sola vez: el Studio no ofrece crear más. */
export const TIPOS_SINGLETON = [
  "ajustesSitio",
  "paginaDerivacion",
  "paginaEvaluacion",
] as const;

export type TipoSingleton = (typeof TIPOS_SINGLETON)[number];
