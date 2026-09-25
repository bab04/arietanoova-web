#!/usr/bin/env node
/**
 * Criterio de verificación del Sprint 1:
 *   "Cambiar un solo valor en @theme cambia el color en todo el sitio.
 *    Verificar con búsqueda: cero valores hexadecimales fuera de globals.css."
 *
 * Este script falla (código 1) si encuentra:
 *   1. Un color hexadecimal, rgb() o hsl() fuera de los dos archivos permitidos.
 *   2. Una clase de color de la paleta por defecto de Tailwind (text-blue-600,
 *      bg-slate-100, border-gray-200...) en cualquier componente o ruta.
 *   3. Una desincronización entre globals.css y lib/tokens.ts.
 */

import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative, sep } from "node:path";

const RAIZ = process.cwd();

// Los dos únicos lugares donde un valor literal es legítimo.
const ARCHIVOS_EXENTOS = new Set([
  join("app", "globals.css"),
  join("lib", "tokens.ts"),
]);

const CARPETAS_IGNORADAS = new Set([
  "node_modules",
  ".next",
  ".git",
  "public",
  "out",
  "scripts",
]);

const EXTENSIONES = new Set([".ts", ".tsx", ".css", ".js", ".jsx", ".mjs"]);

// Paleta por defecto de Tailwind: si aparece, el token no se está usando.
const PALETA_TAILWIND =
  "slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose";

const REGLAS = [
  {
    nombre: "valor hexadecimal",
    patron: /#[0-9a-fA-F]{3,8}\b/g,
    // El fragmento de una URL (#seccion) no es un color; exigimos dígitos hex puros
    // de longitud 3, 4, 6 u 8.
    validar: (m) => [3, 4, 6, 8].includes(m.length - 1),
  },
  {
    nombre: "color rgb()/hsl() literal",
    patron: /\b(?:rgba?|hsla?)\(\s*[\d.]+/g,
    validar: () => true,
  },
  {
    nombre: "clase de la paleta por defecto de Tailwind",
    patron: new RegExp(
      `\b(?:text|bg|border|ring|fill|stroke|from|via|to|decoration|outline|shadow|accent|caret|divide|placeholder)-(?:${PALETA_TAILWIND})-\d{2,3}\b`,
      "g",
    ),
    validar: () => true,
  },
];

function* recorrer(dir) {
  for (const entrada of readdirSync(dir)) {
    if (CARPETAS_IGNORADAS.has(entrada)) continue;
    const ruta = join(dir, entrada);
    if (statSync(ruta).isDirectory()) {
      yield* recorrer(ruta);
    } else if (EXTENSIONES.has(entrada.slice(entrada.lastIndexOf(".")))) {
      yield ruta;
    }
  }
}

const hallazgos = [];

for (const ruta of recorrer(RAIZ)) {
  const rel = relative(RAIZ, ruta);
  if (ARCHIVOS_EXENTOS.has(rel)) continue;

  const contenido = readFileSync(ruta, "utf8");
  const lineas = contenido.split("\n");

  lineas.forEach((linea, i) => {
    // Una línea marcada explícitamente se salta.
    if (linea.includes("verificar-tokens: permitido")) return;

    for (const regla of REGLAS) {
      regla.patron.lastIndex = 0;
      let m;
      while ((m = regla.patron.exec(linea)) !== null) {
        if (!regla.validar(m[0])) continue;
        hallazgos.push({
          archivo: rel.split(sep).join("/"),
          linea: i + 1,
          regla: regla.nombre,
          texto: m[0],
          contexto: linea.trim().slice(0, 100),
        });
      }
    }
  });
}

// ── Sincronía entre globals.css y lib/tokens.ts ──────────────────────────
const css = readFileSync(join(RAIZ, "app", "globals.css"), "utf8");
const ts = readFileSync(join(RAIZ, "lib", "tokens.ts"), "utf8");

const PAREJAS = [
  ["--color-blanco", "blanco"],
  ["--color-crema", "crema"],
  ["--color-bosque", "bosque"],
  ["--color-oliva", "oliva"],
  ["--color-terracota", "terracota"],
  ["--color-oro", "oro"],
  ["--color-marca-900", "marca900"],
  ["--color-marca-700", "marca700"],
  ["--color-marca-500", "marca500"],
  ["--color-acento", "acento"],
  ["--color-tinta", "tinta"],
  ["--color-suave", "suave"],
  ["--color-linea", "linea"],
  ["--color-fondo:", "fondo"],
  ["--color-fondo-alt", "fondoAlt"],
];

const desincronizados = [];
for (const [varCss, claveTs] of PAREJAS) {
  const nombre = varCss.replace(":", "");
  const enCss = new RegExp(`${nombre}\s*:\s*(#[0-9a-fA-F]{3,8})`).exec(css)?.[1];
  const enTs = new RegExp(`${claveTs}\s*:\s*"(#[0-9a-fA-F]{3,8})"`).exec(ts)?.[1];
  if (enCss && enTs && enCss.toLowerCase() !== enTs.toLowerCase()) {
    desincronizados.push({ nombre, enCss, enTs, claveTs });
  }
}

// ── Informe ──────────────────────────────────────────────────────────────
if (hallazgos.length === 0 && desincronizados.length === 0) {
  console.log("✓ Sistema de tokens íntegro.");
  console.log("  Cero colores literales fuera de app/globals.css y lib/tokens.ts.");
  console.log("  Cero clases de la paleta por defecto de Tailwind.");
  console.log("  globals.css y lib/tokens.ts sincronizados.");
  process.exit(0);
}

if (hallazgos.length > 0) {
  console.error(`\n✗ ${hallazgos.length} valor(es) fuera del sistema de tokens:\n`);
  for (const h of hallazgos) {
    console.error(`  ${h.archivo}:${h.linea}  [${h.regla}] ${h.texto}`);
    console.error(`     ${h.contexto}`);
  }
  console.error("\n  Todo color debe salir de un token de app/globals.css.");
}

if (desincronizados.length > 0) {
  console.error(`\n✗ ${desincronizados.length} token(s) desincronizado(s):\n`);
  for (const d of desincronizados) {
    console.error(`  ${d.nombre} = ${d.enCss} en globals.css`);
    console.error(`  ${" ".repeat(d.nombre.length)}   ${d.enTs} en lib/tokens.ts (${d.claveTs})`);
  }
}

console.error("");
process.exit(1);
