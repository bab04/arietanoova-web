"use client";

import { visionTool } from "@sanity/vision";
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";

import { estructura, accionesPorTipo } from "@/sanity/estructura";
import { schemaTypes } from "@/sanity/schemas";
import { API_VERSION, DATASET, PROJECT_ID } from "@/sanity/env";

export default defineConfig({
  name: "arieta-noova-studio",
  title: "Arieta Noova",
  basePath: "/studio",
  projectId: PROJECT_ID,
  dataset: DATASET,
  plugins: [
    structureTool({ structure: estructura }),
    visionTool({ defaultApiVersion: API_VERSION }),
  ],
  schema: {
    types: schemaTypes,
  },
  document: {
    actions: (acciones, contexto) => accionesPorTipo(acciones, contexto.schemaType),
  },
});
