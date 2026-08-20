import assert from "node:assert/strict";
import test from "node:test";

import { credenciales, etiquetaRne, tituloProfesional } from "@/lib/equipo";
import { esquemaPersona } from "@/lib/jsonld";
import type { MiembroEquipo } from "@/types/contenido";

/**
 * Criterio de verificación del Sprint 1:
 *
 *   "Un miembro del equipo con rneEstado: 'en-tramite' nunca muestra la
 *    palabra 'Especialista' en la interfaz."
 *
 * Es una regla legal, no una preferencia de redacción: tres profesionales
 * de la clínica tienen el RNE en trámite. Por eso tiene prueba propia.
 *
 * Ejecutar con: npm run verificar:rne
 */

function miembro(parcial: Partial<MiembroEquipo>): MiembroEquipo {
  return {
    _id: "prueba",
    nombre: "Nombre Apellido",
    colegiatura: "12345",
    rneEstado: "en-tramite",
    ...parcial,
  };
}

test("RNE en trámite: nunca aparece la palabra Especialista", () => {
  const casos: Array<Partial<MiembroEquipo>> = [
    { rneEstado: "en-tramite", especialidad: "Endodoncia" },
    { rneEstado: "en-tramite", especialidad: "Ortodoncia y ortopedia maxilar" },
    { rneEstado: "en-tramite", especialidad: undefined },
    // Sin dato de estado se aplica también la forma conservadora.
    { rneEstado: undefined, especialidad: "Periodoncia" },
  ];

  for (const caso of casos) {
    const titulo = tituloProfesional(miembro(caso));
    assert.ok(
      !/especialista/i.test(titulo),
      `"${titulo}" contiene "Especialista" con el RNE en trámite.`,
    );
    assert.ok(
      titulo.startsWith("Cirujano Dentista"),
      `"${titulo}" debería empezar por "Cirujano Dentista".`,
    );
  }
});

test("RNE vigente: sí se declara la especialidad", () => {
  const titulo = tituloProfesional(
    miembro({ rneEstado: "vigente", especialidad: "Endodoncia" }),
  );
  assert.equal(titulo, "Especialista en Endodoncia");
});

test("El número de RNE solo se publica cuando está vigente", () => {
  const enTramite = credenciales(
    miembro({ rneEstado: "en-tramite", rne: "9999", colegiatura: "12345" }),
  );
  assert.deepEqual(enTramite, ["COP 12345"]);

  const vigente = credenciales(
    miembro({ rneEstado: "vigente", rne: "9999", colegiatura: "12345" }),
  );
  assert.deepEqual(vigente, ["COP 12345", "RNE 9999"]);
});

test("El trámite se declara en la interfaz, no se oculta", () => {
  assert.equal(etiquetaRne(miembro({ rneEstado: "en-tramite" })), "RNE en trámite");
  assert.equal(etiquetaRne(miembro({ rneEstado: "vigente" })), null);
});

test("El JSON-LD respeta la misma regla que la pantalla", () => {
  const persona = esquemaPersona(
    miembro({ rneEstado: "en-tramite", rne: "9999", especialidad: "Cirugía oral" }),
  );

  assert.ok(
    !/especialista/i.test(String(persona.jobTitle)),
    `jobTitle "${persona.jobTitle}" no debe decir "Especialista".`,
  );

  // Una credencial en trámite no se declara como credencial obtenida.
  assert.equal(persona.hasCredential, undefined);

  const vigenteJson = esquemaPersona(
    miembro({ rneEstado: "vigente", rne: "9999", especialidad: "Cirugía oral" }),
  );
  assert.ok(vigenteJson.hasCredential, "Con el RNE vigente sí debe declararse.");
});
