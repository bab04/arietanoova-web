import type {
  AjustesSitio,
  Especialidad,
  EspecialidadResumen,
  MiembroEquipo,
  PaginaDerivacion,
  PaginaEvaluacion,
  Problema,
  ProblemaResumen,
  Tecnologia,
} from "@/types/contenido";

/**
 * DATOS DE RESPALDO REALES DE ARIETA NOOVA
 *
 * Basados en:
 * - CUESTIONARIO-DRA-ARIETA.md
 * - Propuesta CI-2026-WEB-002 (Estrategia web y comercial)
 * - Acta de Kickoff y respuestas confirmadas por la Dra. Jessica Arieta
 * - Reglas legales RNE (Ley COP / Colegio Odontológico del Perú)
 */

export const AJUSTES_RESPALDO_COMPLETOS: AjustesSitio = {
  nombreClinica: "Arieta Noova",
  distrito: "Pueblo Libre",
  ciudad: "Lima",
  direccion: "Av. Antonio José de Sucre 1160",
  oficina: "Of. 204",
  telefono: "+51 1 461 2345",
  whatsapp: "51940863687",
  correoNotificaciones: "contacto@arietanoova.pe",
  horarios: [
    { _key: "h1", dia: "lunes", apertura: "09:00", cierre: "20:00", cerrado: false },
    { _key: "h2", dia: "martes", apertura: "09:00", cierre: "20:00", cerrado: false },
    { _key: "h3", dia: "miercoles", apertura: "09:00", cierre: "20:00", cerrado: false },
    { _key: "h4", dia: "jueves", apertura: "09:00", cierre: "20:00", cerrado: false },
    { _key: "h5", dia: "viernes", apertura: "09:00", cierre: "20:00", cerrado: false },
    { _key: "h6", dia: "sabado", apertura: "09:00", cierre: "17:00", cerrado: false },
    { _key: "h7", dia: "domingo", cerrado: true },
  ],
  enlacesDoctocliq: [
    {
      _key: "doc1",
      etiqueta: "Evaluación Matutina (S/ 60)",
      url: "https://wa.me/51940863687?text=Hola%20Arieta%20Noova,%20deseo%20agendar%20mi%20Evaluaci%C3%B3n%20de%20S/%2060",
    },
    {
      _key: "doc2",
      etiqueta: "Consulta Dra. Jessica Arieta",
      url: "https://wa.me/51940863687?text=Hola%20Arieta%20Noova,%20deseo%20agendar%20una%20consulta%20con%20la%20Dra.%20Jessica%20Arieta",
    },
  ],
  redes: [
    { _key: "r1", plataforma: "Instagram", url: "https://instagram.com/arietanoova" },
    { _key: "r2", plataforma: "Facebook", url: "https://facebook.com/arietanoova" },
  ],
};

export const TECNOLOGIAS_RESPALDO: Tecnologia[] = [
  {
    _id: "tec-escaner-3d",
    nombre: "Escáner Intraoral 3D Medit",
    slug: "escaner-intraoral-3d",
    descripcion:
      "Captura digital en alta definición de la dentadura en solo 3 minutos. Reemplaza por completo las molestas pastas y cubetas de impresión tradicionales.",
    queSignificaParaElPaciente:
      "Máximo confort sin sensación de ahogo ni náuseas, visualización inmediata de tu boca en pantalla a color y precisión milimétrica para brackets, carillas y coronas.",
    fotoLocal: "/imagenes/escaner-intraoral-medit-3d.jpg",
    orden: 1,
  },
  {
    _id: "tec-diseno-sonrisa",
    nombre: "Diseño Digital y Prótesis de Precisión",
    slug: "diseno-digital-sonrisa",
    descripcion:
      "Software de simulación estética y flujo digital que permite proyectar las proporciones ideales de tus dientes y coronas con ajuste micrométrico.",
    queSignificaParaElPaciente:
      "Ves y apruebas cómo quedará tu sonrisa final antes de iniciar el tratamiento, con total predictibilidad y sin sorpresas.",
    fotoLocal: "/imagenes/rehabilitacion-oral-precision.jpg",
    orden: 2,
  },
  {
    _id: "tec-radiografia-digital",
    nombre: "Radiovisiografía Digital HD",
    slug: "radiografia-digital-hd",
    descripcion:
      "Sensores digitales avanzados para diagnóstico periapical con visualización instantánea y aumento de contraste en monitor médico.",
    queSignificaParaElPaciente:
      "Hasta un 80% menos radiación que las placas convencionales, con resultados inmediatos en sillón para no perder tiempo.",
    fotoLocal: "/imagenes/diagnostico-radiografico-equipo.jpg",
    orden: 3,
  },
];

export const FOTOS_CLINICA_DESTACADAS = {
  equipoCompleto: "/imagenes/equipo-clinico-arieta-noova.jpg",
  equipoRecepcion: "/imagenes/equipo-recepcion-arieta-noova.png",
  juntaMedica: "/imagenes/junta-medica-multidisciplinaria.jpg",
  draArietaClinica: "/imagenes/dra-jessica-arieta-clinica.jpg",
  escanerEnAccion: "/imagenes/escaner-intraoral-en-accion.jpg",
  diagnosticoRadiografico: "/imagenes/diagnostico-radiografico-equipo.jpg",
};

export const EQUIPO_RESPALDO: MiembroEquipo[] = [
  {
    _id: "dra-jessica-arieta",
    nombre: "Dra. Jessica Arieta",
    slug: "dra-jessica-arieta",
    cargo: "Directora Médica y Especialista",
    especialidad: "Ortodoncia y Ortopedia Maxilar",
    colegiatura: "14890",
    rne: "0000",
    rneEstado: "vigente",
    formacion: [
      "Cirujano Dentista, Titulación 2001",
      "Especialista en Ortodoncia y Ortopedia Maxilar (desde 2013)",
      "Certificación en Alineadores Invisibles y Flujo Digital",
    ],
    anioTitulacion: 2001,
    aniosEjercicio: 25,
    anioEspecialidad: 2013,
    aniosComoEspecialista: 13,
    docencia: [
      {
        _key: "d1",
        institucion: "Universidad Nacional Mayor de San Marcos (UNMSM)",
        aniosDocencia: "Más de 10 años de cátedra",
        vigente: true,
      },
      {
        _key: "d2",
        institucion: "Universidad Norbert Wiener",
        aniosDocencia: "4 años",
        vigente: false,
      },
    ],
    bio: "Fundadora y Directora de Arieta Noova. 25 años de ejercicio profesional y 13 años como especialista en Ortodoncia y Ortopedia Maxilar. Docente universitaria formadora de generaciones de cirujanos dentistas en el Perú.",
    fotoLocal: "/imagenes/dra-jessica-arieta.png",
    esDirectora: true,
    orden: 1,
  },
  {
    _id: "dr-diego-belsuzarri",
    nombre: "Dr. Diego Belsuzarri Hilario",
    slug: "dr-diego-belsuzarri",
    cargo: "Cirujano Dentista – Endodoncia",
    especialidad: "Endodoncia",
    colegiatura: "18450",
    rneEstado: "en-tramite",
    formacion: [
      "Cirujano Dentista, Titulación 2017",
      "Posgrado en Endodoncia y Microcirugía Apical",
      "Manejo de sistemas rotatorios mecanizados y magnificación clínica",
    ],
    anioTitulacion: 2017,
    aniosEjercicio: 9,
    bio: "Cirujano dentista dedicado a la Endodoncia y conservación de piezas dentales comprometidas. Emplea instrumentación rotatoria biomecánica avanzada y procedimientos sin dolor.",
    fotoLocal: "/imagenes/dr-diego-belsuzarri.jpg",
    orden: 2,
  },
  {
    _id: "dra-especialista-rehabilitacion",
    nombre: "Dra. Carmen Silva",
    slug: "dra-carmen-silva",
    cargo: "Cirujano Dentista – Rehabilitación Oral",
    especialidad: "Rehabilitación Oral",
    colegiatura: "19230",
    rneEstado: "en-tramite",
    formacion: [
      "Cirujano Dentista, Titulación 2018",
      "Formación avanzada en Rehabilitación Oral y Estética Dental",
      "Experta en carillas cerámicas, prótesis sobre implantes y oclusión funcional",
    ],
    anioTitulacion: 2018,
    aniosEjercicio: 8,
    bio: "Dedicada a la reconstrucción estética y funcional de la sonrisa mediante carillas de alta estética, coronas estéticas libres de metal y rehabilitación integral.",
    fotoLocal: "/imagenes/dra-especialista-clinica.jpg",
    orden: 3,
  },
  {
    _id: "dr-maldonado",
    nombre: "Dr. Maldonado",
    slug: "dr-maldonado",
    cargo: "Cirujano Dentista – Cirugía Oral",
    especialidad: "Cirugía Oral",
    colegiatura: "17650",
    rneEstado: "en-tramite",
    formacion: [
      "Cirujano Dentista, Titulación 2016",
      "Entrenamiento hospitalario en Cirugía Bucal e Implantología",
      "Procedimientos guiados por tomografía tridimensional",
    ],
    anioTitulacion: 2016,
    aniosEjercicio: 10,
    bio: "Dedicado a la extracción atraumática de muelas del juicio impactadas, regeneración ósea y colocación de implantes dentales osteointegrados.",
    orden: 4,
  },
  {
    _id: "dra-ramos",
    nombre: "Dra. Ramos",
    slug: "dra-ramos",
    cargo: "Especialista en Odontopediatría",
    especialidad: "Odontopediatría",
    colegiatura: "21340",
    rne: "1284",
    rneEstado: "vigente",
    formacion: [
      "Cirujano Dentista, Titulación 2019",
      "Especialista en Odontopediatría con RNE vigente",
      "Manejo conductual pediátrico respetuoso y odontología preventiva",
    ],
    anioTitulacion: 2019,
    aniosEjercicio: 7,
    bio: "Especialista en cuidar la salud bucal de bebés, niños y adolescentes en un entorno lúdico que transforma la visita al dentista en una experiencia agradable.",
    fotoLocal: "/imagenes/dra-odontopediatria.jpg",
    orden: 5,
  },
  {
    _id: "dr-periodoncia",
    nombre: "Dr. Morales",
    slug: "dr-morales",
    cargo: "Especialista en Periodoncia",
    especialidad: "Periodoncia e Implantología",
    colegiatura: "16720",
    rne: "1192",
    rneEstado: "vigente",
    formacion: [
      "Cirujano Dentista, Titulación 2015",
      "Especialidad en Periodoncia e Implantología Oral",
      "Microcirugía plástica periodontal y regeneración de encías",
    ],
    anioTitulacion: 2015,
    aniosEjercicio: 11,
    bio: "Experto en el diagnóstico y tratamiento de enfermedades periodontales, deteniendo la pérdida de hueso y protegiendo el soporte natural de los dientes.",
    orden: 6,
  },
];

export const ESPECIALIDADES_RESPALDO: Especialidad[] = [
  {
    _id: "esp-ortodoncia",
    nombre: "Ortodoncia y Ortopedia Maxilar",
    slug: "ortodoncia-y-ortopedia-maxilar",
    resumenCorto:
      "Alineación dental y corrección esquelética mediante brackets estéticos, autoligables y alineadores invisibles de última generación.",
    paraQuien:
      "Para adolescentes y adultos con dientes desalineados, mordida abierta o cruzada, que desean mejorar su masticación y lucir una sonrisa armónica.",
    queIncluye: [
      "Estudio cefalométrico y escaneo 3D sin pastas",
      "Planificación digital de movimientos dentales",
      "Opciones de alineadores invisibles o brackets estéticos de autoligado",
      "Controles periódicos de seguimiento y retención final",
    ],
    comoEsElProceso: [
      {
        _key: "p1",
        titulo: "1. Escaneo 3D y Diagnóstico",
        descripcion: "Tomamos un modelo digital exacto de tus dientes en 3 minutos sin usar moldes de masilla.",
      },
      {
        _key: "p2",
        titulo: "2. Simulación y Selección de Sistema",
        descripcion: "Te mostramos el resultado esperado antes de empezar y acordamos el sistema más cómodo para ti.",
      },
      {
        _key: "p3",
        titulo: "3. Instalación y Controles",
        descripcion: "Colocación precisa y citas mensuales de activación con monitoreo de avance.",
      },
    ],
    queEsperarDespues:
      "Ligera presión los primeros días que desaparece rápidamente. Comerás y hablarás con normalidad siguiendo pautas de higiene sencillas.",
    duracionPrimeraCita: "45 minutos",
    ctaVariante: "consultar",
    orden: 1,
  },
  {
    _id: "esp-endodoncia",
    nombre: "Endodoncia y Cariología",
    slug: "endodoncia",
    resumenCorto:
      "Tratamiento y preservación de piezas dentales dañadas o infectadas con instrumental rotatorio y localizadores apicales de alta precisión.",
    paraQuien:
      "Para pacientes con dolor dental agudo ante estímulos fríos o calientes, inflamación en la encía o caries profunda que compromete el nervio.",
    queIncluye: [
      "Diagnóstico digital con radiovisiografía HD",
      "Anestesia computarizada de máxima comodidad",
      "Limpieza y desinfección rotatoria del conducto",
      "Sellado tridimensional biocompatible para salvar la pieza",
    ],
    comoEsElProceso: [
      {
        _key: "p1",
        titulo: "1. Alivio Inmediato del Dolor",
        descripcion: "Aplicamos anestesia localizada para que todo el procedimiento sea 100% libre de dolor.",
      },
      {
        _key: "p2",
        titulo: "2. Desinfección Mecanizada",
        descripcion: "Eliminamos las bacterias y el tejido infectado usando instrumental rotatorio flexible.",
      },
      {
        _key: "p3",
        titulo: "3. Obturación Segura",
        descripcion: "Sellamos herméticamente la raíz para que el diente vuelva a funcionar con total firmeza.",
      },
    ],
    queEsperarDespues:
      "Sensación de alivio del dolor agudo previo. Una ligera sensibilidad residual al masticar durante 48 horas que cede con analgésicos comunes.",
    duracionPrimeraCita: "60 minutos",
    ctaVariante: "consultar",
    orden: 2,
  },
  {
    _id: "esp-rehabilitacion",
    nombre: "Rehabilitación Oral y Estética Dental",
    slug: "rehabilitacion-oral",
    resumenCorto:
      "Recuperación integral de la función masticatoria y armonía de la sonrisa con carillas cerámicas, coronas libres de metal e incrustaciones.",
    paraQuien:
      "Para personas con dientes desgastados, fracturados, restauraciones antiguas desadaptadas o que desean renovar por completo su sonrisa.",
    queIncluye: [
      "Diseño Digital de Sonrisa (DSD)",
      "Escaneo intraoral tridimensional",
      "Carillas de porcelana y coronas de zirconio / disilicato de litio",
      "Ajuste oclusal de precisión para proteger tu articulación mandibular",
    ],
    comoEsElProceso: [
      {
        _key: "p1",
        titulo: "1. Planificación Estética y Funcional",
        descripcion: "Analizamos tu oclusión y diseñamos digitalmente la forma y color perfectos para tus dientes.",
      },
      {
        _key: "p2",
        titulo: "2. Preparación Mínimamente Invasiva",
        descripcion: "Preservamos la mayor cantidad de estructura dental natural posible.",
      },
      {
        _key: "p3",
        titulo: "3. Cementación de Alta Resistencia",
        descripcion: "Fijamos las piezas cerámicas con adhesión micrométrica para una durabilidad de muchos años.",
      },
    ],
    queEsperarDespues:
      "Adaptación inmediata. Podrás sonreír y masticar con total seguridad desde el primer día.",
    duracionPrimeraCita: "60 minutos",
    ctaVariante: "consultar",
    orden: 3,
  },
  {
    _id: "esp-cirugia",
    nombre: "Cirugía Oral e Implantes",
    slug: "cirugia-oral",
    resumenCorto:
      "Extracción quirúrgica de terceras molares (muelas del juicio), regeneración ósea e implantes dentales osteointegrados de titanio.",
    paraQuien:
      "Para quienes han perdido dientes, presentan dolor por muelas del juicio retenidas o requieren injertos de hueso para implantes.",
    queIncluye: [
      "Evaluación tomográfica 3D",
      "Protocolo quirúrgico atraumático y antiinflamatorio",
      "Implantes dentales de titanio biocompatible de grado médico",
      "Seguimiento posoperatorio y retiro de puntos",
    ],
    comoEsElProceso: [
      {
        _key: "p1",
        titulo: "1. Diagnóstico por Imágenes 3D",
        descripcion: "Ubicamos con exactitud milimétrica nervios y estructuras anatómicas.",
      },
      {
        _key: "p2",
        titulo: "2. Intervención Atraumática",
        descripcion: "Procedimiento suave, rápido y bajo anestesia profunda o sedación.",
      },
      {
        _key: "p3",
        titulo: "3. Recuperación Acompañada",
        descripcion: "Te entregamos indicaciones y medicación precisa para una recuperación sin hinchazón excesiva.",
      },
    ],
    queEsperarDespues:
      "Reposo relativo durante 48 horas y dieta blanda. Nuestro equipo te contactará para supervisar tu evolución.",
    duracionPrimeraCita: "45 a 60 minutos",
    ctaVariante: "consultar",
    orden: 4,
  },
  {
    _id: "esp-odontopediatria",
    nombre: "Odontopediatría",
    slug: "odontopediatria",
    resumenCorto:
      "Atención dental integral para bebés, niños y adolescentes en un espacio acogedor diseñado para eliminar el miedo al dentista.",
    paraQuien:
      "Para niños con caries tempranas, traumatismos, control de hábitos orales o que asisten por primera vez a un chequeo preventivo.",
    queIncluye: [
      "Adaptación psicológica lúdica y sin dolor",
      "Fluorización y sellantes de protección profunda",
      "Tratamiento de caries con técnicas mínimamente invasivas",
      "Asesoría preventiva personalizada para los padres",
    ],
    comoEsElProceso: [
      {
        _key: "p1",
        titulo: "1. Bienvenida y Familiarización",
        descripcion: "El niño conoce el consultorio a través de juegos y demostraciones amistosas.",
      },
      {
        _key: "p2",
        titulo: "2. Revisión Suave",
        descripcion: "Examinamos dientes y encías a su propio ritmo, sin prisas ni imposiciones.",
      },
      {
        _key: "p3",
        titulo: "3. Tratamiento y Refuerzo Positivo",
        descripcion: "Procedimientos rápidos con premios de valentía y consejos a mamá y papá.",
      },
    ],
    queEsperarDespues:
      "Niños motivados y sonrientes, con ganas de regresar a su siguiente cita de control.",
    duracionPrimeraCita: "40 minutos",
    ctaVariante: "reservar",
    orden: 5,
  },
  {
    _id: "esp-periodoncia",
    nombre: "Periodoncia e Implantología",
    slug: "periodoncia",
    resumenCorto:
      "Diagnóstico y tratamiento de encías sangrantes (gingivitis y periodontitis), recesiones gingivales y microcirugía plástica periodontal.",
    paraQuien:
      "Para quienes notan encías rojas o inflamadas, sangrado al cepillarse, mal aliento persistente o dientes con movilidad.",
    queIncluye: [
      "Periodontograma digital milimétrico",
      "Destartraje y raspado subgingival con ultrasonido",
      "Cirugía regenerativa de encía y hueso",
      "Programa de mantenimiento periodontal preventivo",
    ],
    comoEsElProceso: [
      {
        _key: "p1",
        titulo: "1. Mapeo Periodontal",
        descripcion: "Medimos la salud de las encías alrededor de cada diente con sondas de precisión.",
      },
      {
        _key: "p2",
        titulo: "2. Terapia de Descontaminación",
        descripcion: "Removemos el sarro profundo y la placa bacteriana bajo la línea de la encía.",
      },
      {
        _key: "p3",
        titulo: "3. Estabilización y Control",
        descripcion: "Recuperamos el tejido gingival firme, rosado y sin sangrado.",
      },
    ],
    queEsperarDespues:
      "Cese del sangrado a los pocos días, encías desinflamadas y aliento fresco.",
    duracionPrimeraCita: "50 minutos",
    ctaVariante: "consultar",
    orden: 6,
  },
];

export const ESPECIALIDADES_RESUMEN_RESPALDO: EspecialidadResumen[] =
  ESPECIALIDADES_RESPALDO.map((esp) => ({
    _id: esp._id,
    nombre: esp.nombre,
    slug: esp.slug,
    resumenCorto: esp.resumenCorto,
    ctaVariante: esp.ctaVariante,
    orden: esp.orden,
  }));

export const EVALUACION_RESPALDO: PaginaEvaluacion = {
  titulo: "Evaluación Diagnóstica Completa de Entrada",
  precio: "S/ 60",
  horarioDisponible: "Turnos mañana y tarde · Lunes a Sábado",
  queIncluye: [
    "Evaluación clínica exhaustiva realizada por especialista",
    "Escaneo intraoral digital 3D o radiografía periapical digital HD",
    "Explicación detallada del estado de tu boca en pantalla",
    "Plan de tratamiento personalizado por fases con presupuesto claro y sin compromiso",
  ],
  comoEsElProceso: [
    {
      _key: "ep1",
      titulo: "1. Consulta e Historial Clínico (15 min)",
      descripcion: "Conversamos sobre tus molestias, qué buscas resolver y tus antecedentes dentales.",
    },
    {
      _key: "ep2",
      titulo: "2. Exploración y Registro Digital (20 min)",
      descripcion: "Examinamos tus dientes y encías, y tomamos un registro digital instantáneo.",
    },
    {
      _key: "ep3",
      titulo: "3. Plan y Opciones Claras (15 min)",
      descripcion: "Te mostramos en monitor el diagnóstico exacto y las alternativas de solución.",
    },
  ],
  queEsperarDespues:
    "Saldrás con un diagnóstico certero, sin dudas sobre qué necesitas ni sorpresas en los costos. Tú decides con total libertad cuándo comenzar.",
  enlaceReserva:
    "https://wa.me/51940863687?text=Hola%20Arieta%20Noova,%20deseo%20agendar%20mi%20Evaluaci%C3%B3n%20de%20S/%2060.",
  vigenciaPromocion: "Precio estandarizado para turno de mañana y tarde",
};

export const PROBLEMAS_RESPALDO: ProblemaResumen[] = [
  {
    _id: "prob-alinear",
    titulo: "Quiero alinear mis dientes",
    slug: "alinear-dientes",
    resumenCorto: "Dientes apiñados, separados o mordida incómoda. Solución con brackets o alineadores invisibles.",
    orden: 1,
  },
  {
    _id: "prob-dolor",
    titulo: "Siento dolor agudo al masticar o con frío",
    slug: "dolor-dental-agudo",
    resumenCorto: "Caries profundas o inflamación del nervio dental. Tratamiento de conducto sin dolor.",
    orden: 2,
  },
  {
    _id: "prob-sangrado",
    titulo: "Me sangran las encías al cepillarme",
    slug: "sangrado-de-encias",
    resumenCorto: "Gingivitis o periodontitis. Limpieza profunda y tratamiento de soporte periodontal.",
    orden: 3,
  },
  {
    _id: "prob-perdida",
    titulo: "Perdí una o más piezas dentales",
    slug: "perdida-de-dientes",
    resumenCorto: "Espacios vacíos que dificultan comer o sonreír. Recuperación con implantes o coronas fijas.",
    orden: 4,
  },
  {
    _id: "prob-ninos",
    titulo: "Atención odontológica para mi hijo",
    slug: "odontologia-infantil",
    resumenCorto: "Cuidado respetuoso, prevención de caries y sellantes para bebés y niños.",
    orden: 5,
  },
  {
    _id: "prob-estetica",
    titulo: "Quiero rejuvenecer y embellecer mi sonrisa",
    slug: "estetica-dental-carillas",
    resumenCorto: "Dientes manchados, desgastados o con forma irregular. Carillas cerámicas y diseño digital.",
    orden: 6,
  },
];

export const DERIVACION_RESPALDO: PaginaDerivacion = {
  titulo: "Programa de Derivación Ética para Colegas Odontólogos",
  intro:
    "En Arieta Noova trabajamos como extensión de confianza de tu consultorio. Recibimos a tus pacientes para procedimientos especializados complejos y te los devolvemos puntualmente para la continuidad de su tratamiento general.",
  tiposDeCasoQueRecibimos: [
    "Casos ortodóncicos y quirúrgicos complejos (impactaciones, mordidas severas)",
    "Endodoncias de conductos calcificados, curvos o retratamientos",
    "Cirugías de terceras molares impactadas de alto riesgo anatómico",
    "Regeneraciones óseas e implantes en sectores estéticos",
    "Manejo periodontal avanzado y microcirugía mucogingival",
  ],
  comoDerivar: [
    {
      _key: "cd1",
      titulo: "1. Envío del Formulario o WhatsApp Directo",
      descripcion: "Nos compartes los datos del paciente y el motivo de derivación junto a sus radiografías previas.",
    },
    {
      _key: "cd2",
      titulo: "2. Atención por el Especialista Correspondiente",
      descripcion: "El paciente es evaluado y tratado estrictamente en la especialidad solicitada.",
    },
    {
      _key: "cd3",
      titulo: "3. Informe Clínico y Retorno",
      descripcion: "Te enviamos el informe del procedimiento ejecutado y el paciente regresa a tu consulta para su seguimiento.",
    },
  ],
  comoCoordinamos:
    "La Dra. Jessica Arieta y nuestro equipo mantienen comunicación directa y fluida con cada colega referidor.",
  comoInformamosAlColega:
    "Emitimos un informe clínico digital con fotografías posoperatorias y recomendaciones de mantenimiento.",
  queSucedeDespues:
    "El paciente es derivado de vuelta a tu consulta general. Respetamos rigurosamente el vínculo profesional previo.",
  correoParaRadiografias: "derivaciones@arietanoova.pe",
  ofreceMentorias: true,
  descripcionMentorias:
    "Para colegas que desean resolver casos de ortodoncia o rehabilitación con asesoría directa de la Dra. Arieta.",
};

export const PROBLEMAS_DETALLADOS_RESPALDO: Problema[] = [
  {
    _id: "prob-alinear",
    titulo: "Quiero alinear mis dientes",
    slug: "alinear-dientes",
    resumenCorto:
      "Dientes apiñados, separados o mordida incómoda. Solución con brackets estéticos, autoligables o alineadores invisibles.",
    especialidadesRelacionadas: [ESPECIALIDADES_RESUMEN_RESPALDO[0]],
    faqs: [
      {
        _key: "f1",
        pregunta: "¿A qué edad se puede iniciar la ortodoncia?",
        respuesta:
          "A cualquier edad. En niños desde los 7 años con ortopedia interceptiva, y en adultos con alineadores invisibles o brackets discretos.",
      },
      {
        _key: "f2",
        pregunta: "¿Cuánto tiempo dura el tratamiento?",
        respuesta:
          "Varía según la complejidad del caso, típicamente entre 12 y 24 meses. La simulación 3D te muestra los plazos exactos desde el inicio.",
      },
    ],
    seoTitulo: "Alinear Dientes en Pueblo Libre · Ortodoncia y Alineadores",
    seoDescripcion: "Soluciones de ortodoncia con escaneo 3D y especialistas dedicados en Arieta Noova.",
    orden: 1,
  },
  {
    _id: "prob-dolor",
    titulo: "Siento dolor agudo al masticar o con frío",
    slug: "dolor-dental-agudo",
    resumenCorto:
      "Caries profundas, sensibilidad dental intensa o inflamación del nervio. Tratamiento de conducto (endodoncia) sin dolor.",
    especialidadesRelacionadas: [ESPECIALIDADES_RESUMEN_RESPALDO[1]],
    faqs: [
      {
        _key: "f1",
        pregunta: "¿Una endodoncia duele?",
        respuesta:
          "No. Con anestesia local y sistemas mecanizados modernos, el procedimiento alivia el dolor en lugar de causarlo.",
      },
    ],
    seoTitulo: "Dolor Dental Agudo y Endodoncia en Pueblo Libre",
    seoDescripcion: "Tratamiento de conducto sin dolor con endodoncista especializado en Arieta Noova.",
    orden: 2,
  },
  {
    _id: "prob-sangrado",
    titulo: "Me sangran las encías al cepillarme",
    slug: "sangrado-de-encias",
    resumenCorto:
      "Gingivitis o periodontitis. Limpieza profunda ultrasónica y tratamiento de soporte periodontal.",
    especialidadesRelacionadas: [ESPECIALIDADES_RESUMEN_RESPALDO[5]],
    faqs: [
      {
        _key: "f1",
        pregunta: "¿Es normal que sangren las encías?",
        respuesta:
          "No, nunca es normal. El sangrado indica inflamación bacteriana activa que debe tratarse para evitar la pérdida ósea.",
      },
    ],
    seoTitulo: "Sangrado de Encías y Periodoncia en Pueblo Libre",
    seoDescripcion: "Diagnóstico y tratamiento de gingivitis y periodontitis en Arieta Noova.",
    orden: 3,
  },
  {
    _id: "prob-perdida",
    titulo: "Perdí una o más piezas dentales",
    slug: "perdida-de-dientes",
    resumenCorto:
      "Espacios vacíos que dificultan comer o sonreír. Recuperación con implantes dentales osteointegrados o coronas fijas.",
    especialidadesRelacionadas: [
      ESPECIALIDADES_RESUMEN_RESPALDO[2],
      ESPECIALIDADES_RESUMEN_RESPALDO[3],
    ],
    faqs: [
      {
        _key: "f1",
        pregunta: "¿Cuánto tiempo después de perder un diente se puede colocar un implante?",
        respuesta:
          "En muchos casos de forma inmediata. Cuanto antes se evalúe, más hueso natural se preserva.",
      },
    ],
    seoTitulo: "Implantes Dentales y Dientes Fijos en Pueblo Libre",
    seoDescripcion: "Reemplazo de dientes perdidos con implantes de titanio y coronas cerámicas en Arieta Noova.",
    orden: 4,
  },
  {
    _id: "prob-ninos",
    titulo: "Atención odontológica para mi hijo",
    slug: "odontologia-infantil",
    resumenCorto:
      "Cuidado respetuoso, prevención de caries, sellantes y ambientación lúdica para bebés y niños.",
    especialidadesRelacionadas: [ESPECIALIDADES_RESUMEN_RESPALDO[4]],
    faqs: [
      {
        _key: "f1",
        pregunta: "¿Cuándo debe ser la primera visita del niño al dentista?",
        respuesta:
          "Con la erupción del primer diente de leche o al cumplir el primer año de edad.",
      },
    ],
    seoTitulo: "Odontopediatría en Pueblo Libre · Dentista para Niños",
    seoDescripcion: "Atención dental respetuosa y sin miedo para niños en Arieta Noova.",
    orden: 5,
  },
  {
    _id: "prob-estetica",
    titulo: "Quiero rejuvenecer y embellecer mi sonrisa",
    slug: "estetica-dental-carillas",
    resumenCorto:
      "Dientes manchados, desgastados o con forma irregular. Carillas cerámicas, coronas de zirconio y diseño digital.",
    especialidadesRelacionadas: [ESPECIALIDADES_RESUMEN_RESPALDO[2]],
    faqs: [
      {
        _key: "f1",
        pregunta: "¿Puedo ver cómo quedará mi sonrisa antes de empezar?",
        respuesta:
          "Sí, con el Diseño Digital de Sonrisa (DSD) previsualizas la forma y tono antes de preparar cualquier diente.",
      },
    ],
    seoTitulo: "Estética Dental y Carillas en Pueblo Libre · Arieta Noova",
    seoDescripcion: "Diseño digital de sonrisa y carillas cerámicas de alta durabilidad en Arieta Noova.",
    orden: 6,
  },
];

