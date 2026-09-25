#!/usr/bin/env node
/**
 * Siembra el dataset con contenido de ejemplo para verificar el flujo
 * completo: Studio → consulta GROQ → página → sitemap.
 *
 * REGLA QUE NO SE ROMPE: nada de esto es contenido clínico real. Todos los
 * textos van marcados con el prefijo [EJEMPLO] para que sea imposible
 * confundirlos con lo que aporte la doctora, y para poder encontrarlos y
 * borrarlos con una búsqueda.
 *
 * Uso:
 *   1. Crear el proyecto en sanity.io y anotar el projectId.
 *   2. Generar un token de escritura (Editor) en sanity.io/manage.
 *   3. Rellenar en .env.local:
 *        NEXT_PUBLIC_SANITY_PROJECT_ID
 *        SANITY_API_WRITE_TOKEN
 *   4. npm run sanity:semilla
 *
 * Para deshacer:
 *   npm run sanity:semilla -- --borrar
 */

import { createClient } from "@sanity/client";

const PROJECT_ID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "";
const DATASET = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
const TOKEN = process.env.SANITY_API_WRITE_TOKEN ?? "";

const MARCA = "[EJEMPLO]";
const BORRAR = process.argv.includes("--borrar");

if (!PROJECT_ID || !/^[a-z0-9-]+$/.test(PROJECT_ID)) {
  console.error(
    "\n✗ Falta NEXT_PUBLIC_SANITY_PROJECT_ID en .env.local.\n" +
      "  Créalo primero en https://sanity.io/manage\n",
  );
  process.exit(1);
}

if (!TOKEN) {
  console.error(
    "\n✗ Falta SANITY_API_WRITE_TOKEN en .env.local.\n" +
      "  Genera un token con permiso de Editor en https://sanity.io/manage\n",
  );
  process.exit(1);
}

const cliente = createClient({
  projectId: PROJECT_ID,
  dataset: DATASET,
  apiVersion: "2024-10-01",
  token: TOKEN,
  useCdn: false,
});

// ── Documentos de ejemplo ────────────────────────────────────────────────
// Los identificadores llevan el prefijo "ejemplo-" para poder borrarlos
// todos de una sola pasada.

const DIRECTORA = {
  _id: "directora-arieta",
  _type: "miembroEquipo",
  nombre: "Dra. Jessica Arieta",
  slug: { _type: "slug", current: "dra-jessica-arieta" },
  cargo: "Directora y Especialista",
  especialidad: "Ortodoncia y ortopedia maxilar",
  colegiatura: "00000",
  rne: "0000",
  rneEstado: "vigente",
  formacion: [
    "Cirujano Dentista, Titulación 2001",
    "Especialidad en Ortodoncia y Ortopedia Maxilar (desde 2013)",
  ],
  anioTitulacion: 2001,
  aniosEjercicio: 25,
  anioEspecialidad: 2013,
  aniosComoEspecialista: 13,
  docencia: [
    {
      _key: "d1",
      institucion: "Universidad Nacional Mayor de San Marcos (UNMSM)",
      aniosDocencia: "Más de 10 años",
      vigente: true,
    },
    {
      _key: "d2",
      institucion: "Universidad Norbert Wiener",
      aniosDocencia: "4 años",
      vigente: false,
    },
  ],
  bio: "Directora de ArietaNoova con 25 años de ejercicio profesional y 13 como especialista.",
  esDirectora: true,
  orden: 1,
};

const ESPECIALISTA = {
  _id: "ejemplo-especialista",
  _type: "miembroEquipo",
  nombre: `${MARCA} Nombre Apellido`,
  slug: { _type: "slug", current: "ejemplo-especialista" },
  cargo: `${MARCA} Cargo por definir`,
  especialidad: "Endodoncia",
  colegiatura: "00000",
  // En trámite a propósito: es el caso que activa la regla de "nunca
  // Especialista" y permite verificarla en pantalla.
  rneEstado: "en-tramite",
  formacion: [`${MARCA} Universidad y año por confirmar`],
  anioTitulacion: 2018,
  aniosEjercicio: 8,
  anioEspecialidad: 2024,
  aniosComoEspecialista: 2,
  aniosExperiencia: 8,
  bio: `${MARCA} Texto de relleno. Sustituir por la reseña real.`,
  esDirectora: false,
  orden: 99,
};

const TECNOLOGIA = {
  _id: "ejemplo-tecnologia",
  _type: "tecnologia",
  nombre: `${MARCA} Escáner intraoral 3D`,
  slug: { _type: "slug", current: "ejemplo-escaner-intraoral" },
  descripcion: `${MARCA} Descripción por confirmar con la doctora.`,
  queSignificaParaElPaciente: `${MARCA} Beneficio para el paciente por confirmar.`,
  orden: 99,
};

const ESPECIALIDAD = {
  _id: "ejemplo-especialidad",
  _type: "especialidad",
  nombre: `${MARCA} Especialidad de prueba`,
  slug: { _type: "slug", current: "ejemplo-especialidad" },
  resumenCorto: `${MARCA} Resumen de prueba para verificar tarjetas, meta description y sitemap.`,
  paraQuien: `${MARCA} Texto de relleno. Lo aporta la doctora.`,
  queIncluye: [
    `${MARCA} Primer punto de relleno`,
    `${MARCA} Segundo punto de relleno`,
    `${MARCA} Tercer punto de relleno`,
  ],
  comoEsElProceso: [
    { _key: "p1", titulo: `${MARCA} Primer paso`, descripcion: `${MARCA} Relleno.` },
    { _key: "p2", titulo: `${MARCA} Segundo paso`, descripcion: `${MARCA} Relleno.` },
    { _key: "p3", titulo: `${MARCA} Tercer paso`, descripcion: `${MARCA} Relleno.` },
  ],
  queEsperarDespues: `${MARCA} Texto de relleno.`,
  duracionPrimeraCita: "45 minutos",
  especialistas: [{ _key: "e1", _type: "reference", _ref: DIRECTORA._id }],
  tecnologiaRelacionada: [{ _key: "t1", _type: "reference", _ref: TECNOLOGIA._id }],
  faqs: [
    {
      _key: "f1",
      pregunta: `${MARCA} ¿Pregunta de prueba?`,
      respuesta: `${MARCA} Respuesta de prueba, para verificar el acordeón y el JSON-LD de FAQPage.`,
    },
  ],
  // "consultar" a propósito: verifica que la variante del CTA cambia el
  // texto y el destino sin tocar código.
  ctaVariante: "consultar",
  enlaceFormasDePagoTexto: "Conoce nuestras facilidades de pago y opciones de financiamiento",
  seoTitulo: `${MARCA} Título de prueba`,
  seoDescripcion: `${MARCA} Descripción de prueba para verificar la meta description.`,
  orden: 99,
};

const AJUSTES = {
  _id: "ajustesSitio",
  _type: "ajustesSitio",
  nombreClinica: "ArietaNoova",
  direccion: `${MARCA} Dirección por confirmar`,
  oficina: "Of. 204",
  distrito: "Pueblo Libre",
  ciudad: "Lima",
  telefono: "(01) 000 0000",
  whatsapp: "51900000000",
  correoNotificaciones: process.env.CORREO_NOTIFICACIONES || "hola@arietanoova.pe",
  horarios: [
    { _key: "h1", dia: "lunes", apertura: "08:00", cierre: "19:00", cerrado: false },
    { _key: "h2", dia: "martes", apertura: "08:00", cierre: "19:00", cerrado: false },
    { _key: "h3", dia: "miercoles", apertura: "08:00", cierre: "19:00", cerrado: false },
    { _key: "h4", dia: "jueves", apertura: "08:00", cierre: "19:00", cerrado: false },
    { _key: "h5", dia: "viernes", apertura: "08:00", cierre: "19:00", cerrado: false },
    { _key: "h6", dia: "sabado", apertura: "09:00", cierre: "13:00", cerrado: false },
    { _key: "h7", dia: "domingo", cerrado: true },
  ],
  enlacesDoctocliq: [],
  redes: [],
};

const FORMAS_DE_PAGO = {
  _id: "paginaFormasDePago",
  _type: "paginaFormasDePago",
  titulo: "Formas de pago y facilidades",
  intro: "Transparencia y claridad en cada presupuesto de la clínica.",
  notaTransparencia: "No publicamos una lista genérica de precios porque cada paciente requiere diagnóstico personalizado con escáner 3D.",
  comoSeEntregaElPresupuesto: "El presupuesto se entrega por escrito tras la evaluación inicial, desglosado por fases.",
  modalidadesDePago: [
    { _key: "m1", nombre: "Tarjetas de crédito y débito", descripcion: "Visa, Mastercard, Amex, Diners." },
    { _key: "m2", nombre: "Transferencias y billeteras digitales", descripcion: "BCP, BBVA, Yape y Plin." },
    { _key: "m3", nombre: "Efectivo", descripcion: "En soles y dólares." },
  ],
  financiamiento: [
    { _key: "f1", nombre: "Pago por avance de tratamiento", descripcion: "Abono inicial y cuotas mensuales en ortodoncia." },
  ],
  coberturaSeguros: "Emitimos comprobantes electrónicos válidos para trámites de reembolso con EPS y aseguradoras.",
  preguntasFrecuentes: [
    { _key: "fp1", pregunta: "¿Puedo pagar en cuotas?", respuesta: "Sí, tratamientos como ortodoncia se pagan en cuotas mensuales por control." },
  ],
  seoTitulo: "Formas de pago · ArietaNoova",
  seoDescripcion: "Conoce las modalidades de pago y opciones de financiamiento en ArietaNoova.",
};

const EVALUACION = {
  _id: "paginaEvaluacion",
  _type: "paginaEvaluacion",
  titulo: "Evaluación matutina",
  precio: "S/ 60",
  horarioDisponible: `${MARCA} Lunes a viernes de 8:00 a 12:00`,
  queIncluye: [`${MARCA} Punto por confirmar`, `${MARCA} Punto por confirmar`],
  comoEsElProceso: [
    { _key: "p1", titulo: `${MARCA} Paso de relleno`, descripcion: `${MARCA} Relleno.` },
  ],
  queEsperarDespues: `${MARCA} Texto de relleno.`,
  quienLaAtiende: { _type: "reference", _ref: DIRECTORA._id },
};

const DERIVACION = {
  _id: "paginaDerivacion",
  _type: "paginaDerivacion",
  titulo: "Para odontólogos",
  intro: `${MARCA} Texto de relleno dirigido a colegas.`,
  tiposDeCasoQueRecibimos: [`${MARCA} Tipo de caso por confirmar`],
  comoDerivar: [
    { _key: "p1", titulo: `${MARCA} Paso de relleno`, descripcion: `${MARCA} Relleno.` },
  ],
  comoCoordinamos: `${MARCA} Texto de relleno.`,
  comoInformamosAlColega: `${MARCA} Texto de relleno.`,
  queSucedeDespues: `${MARCA} Texto de relleno.`,
  ofreceMentorias: true,
  descripcionMentorias: `${MARCA} Texto de relleno. Verifica que la sección aparece solo con ofreceMentorias activo.`,
  correoParaRadiografias: process.env.CORREO_NOTIFICACIONES || "hola@arietanoova.pe",
};

// El orden importa: las referencias tienen que existir antes de apuntarlas.
const DOCUMENTOS = [DIRECTORA, ESPECIALISTA, TECNOLOGIA, ESPECIALIDAD, AJUSTES, FORMAS_DE_PAGO, EVALUACION, DERIVACION];

async function sembrar() {
  console.log(`\nSembrando ${DATASET} en el proyecto ${PROJECT_ID}…\n`);

  const transaccion = cliente.transaction();
  for (const documento of DOCUMENTOS) {
    transaccion.createOrReplace(documento);
  }

  await transaccion.commit();

  for (const documento of DOCUMENTOS) {
    console.log(`  ✓ ${documento._type.padEnd(18)} ${documento._id}`);
  }

  console.log(`
✓ Listo. Ahora puedes verificar:

  /studio                            los documentos aparecen en la barra lateral
  /especialidades                    la tarjeta ${MARCA} está en el índice
  /especialidades/ejemplo-especialidad
                                     la página existe, y el botón dice
                                     "Consultar sobre mi caso" (ctaVariante)
  /sitemap.xml                       la URL de la especialidad está incluida
  /equipo                            el perfil dice "Cirujano Dentista",
                                     nunca "Especialista" (RNE en trámite)

Para borrar todo lo sembrado:
  npm run sanity:semilla -- --borrar
`);
}

async function borrar() {
  console.log(`\nBorrando el contenido de ejemplo de ${DATASET}…\n`);

  // Solo los documentos con prefijo "ejemplo-": los singletons se conservan
  // porque para entonces ya pueden tener datos reales de la clínica.
  const ids = await cliente.fetch(`*[_id match "ejemplo-*"]._id`);

  if (ids.length === 0) {
    console.log("  No hay documentos de ejemplo que borrar.\n");
    return;
  }

  const transaccion = cliente.transaction();
  for (const id of ids) transaccion.delete(id);
  await transaccion.commit();

  for (const id of ids) console.log(`  ✓ borrado ${id}`);

  console.log(
    `
Nota: los singletons (ajustesSitio, paginaEvaluacion, paginaDerivacion)
NO se borran, porque a estas alturas pueden tener datos reales.
Revísalos en /studio y quita lo que siga marcado con ${MARCA}.
`,
  );
}

try {
  await (BORRAR ? borrar() : sembrar());
} catch (error) {
  console.error("\n✗ Falló la operación:", error.message ?? error);
  process.exit(1);
}
