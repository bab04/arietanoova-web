# ArietaNoova — web

Clínica dental de especialistas en Pueblo Libre, Lima.
Next.js 15 · TypeScript · Tailwind v4 · Sanity v3 · Vercel.

Este repositorio es el **Sprint 1**: toda la base que no depende del kit de
marca ni de los textos finales. Ambos llegan después.

---

## Arrancar

```bash
npm install
cp .env.example .env.local
npm run dev
```

**El proyecto arranca sin credenciales reales.** Sin Sanity, las secciones
muestran su estado vacío; sin Resend, los formularios validan y responden
bien pero el correo se registra en la consola en vez de enviarse. Es
deliberado: permite trabajar en la interfaz antes de que existan las cuentas.

---

## Las dos reglas del sprint

### 1. Cero valores visuales dentro de los componentes

Todo color, tipografía, radio y sombra sale de `app/globals.css`, bloque
`@theme`. Cuando llegue el kit de marca se cambian esos valores y el sitio
entero queda revestido, sin tocar un solo componente.

```bash
npm run verificar:tokens
```

Falla si encuentra un hexadecimal, un `rgb()` o una clase de la paleta por
defecto de Tailwind (`text-blue-600`) fuera de los dos archivos permitidos.

Las tipografías viven solo en `app/fonts.ts`. Cambiar de fuente es editar
ese archivo y nada más.

**Las dos excepciones**, ambas justificadas y ambas leen de `lib/tokens.ts`:

| Dónde | Por qué |
|---|---|
| `app/api/og/route.tsx` | `next/og` renderiza aislado y no lee la hoja de estilos. |
| `lib/correo.ts` | Los clientes de correo no entienden variables CSS. |

`lib/tokens.ts` es el espejo en TypeScript del `@theme`. Al aplicar el kit
de marca hay que actualizar los dos archivos; el verificador comprueba que
sigan sincronizados.

### 2. Cero contenido clínico inventado

No hay copy sobre tratamientos, beneficios ni especialidades en el código.
Todo viene de Sanity, y donde falta, el componente renderiza un estado
vacío controlado (`EstadoVacio` en `components/Seccion.tsx`).

Sí hay microcopy de interfaz: botones, etiquetas, mensajes de error,
estados vacíos. Eso es interfaz, no contenido.

---

## Verificar

```bash
npm run verificar          # tokens + regla del RNE + tipos
npm run verificar:tokens   # cero valores visuales sueltos
npm run verificar:rne      # la regla legal del RNE en trámite
npm run typecheck
npm run build
```

### La regla del RNE

Tres profesionales tienen el RNE en trámite. Mientras lo esté, la interfaz
debe mostrar **"Cirujano Dentista – [Especialidad]"** y **nunca** la palabra
"Especialista".

No es una preferencia de redacción: es una regla legal. Por eso vive en una
sola función (`tituloProfesional()` en `lib/equipo.ts`), la consumen todos
los componentes y el JSON-LD, y tiene prueba propia en
`scripts/verificar-rne.test.ts`. Ningún componente construye el título
profesional por su cuenta.

---

## Estructura

```
app/
  (sitio)/          las once rutas, con encabezado, pie y barras
  studio/           Sanity Studio embebido (fuera del layout del sitio)
  api/
    contacto/       formulario de pacientes (JSON)
    derivacion/     formulario de colegas (multipart, con adjuntos)
    track/          punto único de analítica de servidor
    og/             imágenes de Open Graph generadas
  globals.css       ← ÚNICA fuente de verdad visual
  fonts.ts          ← ÚNICO archivo de tipografía
  sitemap.ts        generado desde Sanity, no estático
  robots.ts

components/         todos los componentes, tipados
lib/
  equipo.ts         la regla del RNE
  jsonld.ts         constructores de datos estructurados (funciones puras)
  analitica.ts      eventos y etiquetado UTM
  validacion.ts     esquemas Zod compartidos cliente/servidor
  tokens.ts         espejo del @theme (ver excepciones arriba)

sanity/
  schemas/          los ocho esquemas
  queries.ts        consultas GROQ
  client.ts         cliente que degrada sin credenciales

scripts/
  verificar-tokens.mjs
  verificar-rne.test.ts
  sembrar-sanity.mjs
  generar-cuestionario.mjs
```

---

## Sanity

Los esquemas están en `sanity/schemas/`. El Studio se sirve en `/studio`.

**Los campos del esquema `especialidad` son el cuestionario de la doctora.**
Cada `description` está redactada como una pregunta dirigida a ella. El
cuestionario se genera desde ahí, para que esquema y cuestionario no puedan
divergir:

```bash
npm run cuestionario      # → CUESTIONARIO-DRA-ARIETA.md
```

### Poner en marcha el CMS

1. Crear el proyecto en [sanity.io/manage](https://sanity.io/manage).
2. Copiar el `projectId` a `NEXT_PUBLIC_SANITY_PROJECT_ID` en `.env.local`.
3. Generar un token con permiso de Editor → `SANITY_API_WRITE_TOKEN`.
4. Sembrar contenido de prueba:

```bash
npm run sanity:semilla              # crea documentos marcados [EJEMPLO]
npm run sanity:semilla -- --borrar  # los quita
```

Todo lo sembrado lleva el prefijo `[EJEMPLO]` para que sea imposible
confundirlo con contenido real y se pueda encontrar con una búsqueda.

### Consentimiento en los casos

Un `caso` sin `consentimientoFirmado` no se publica. La comprobación está
en dos sitios a propósito: la validación del esquema (no deja publicar) y
el filtro de la consulta GROQ (no se sirve aunque exista). Publicar la foto
de un paciente sin consentimiento no es un descuido recuperable.

---

## Analítica

GA4 vía `@next/third-parties/google`. Ningún componente llama a `gtag`
directamente: todo pasa por `registrarEvento()` en `lib/analitica.ts`.

Eventos: `clic_reservar`, `clic_whatsapp`, `clic_llamar`, `envio_contacto`,
`envio_derivacion`. Todos llevan `origen` y, donde aplica, `variante`.

Los enlaces de Doctocliq salen etiquetados con
`utm_source=web&utm_medium=cta&utm_campaign=<origen>`, respetando las UTM
que ya trajera el enlace pegado desde Doctocliq.

`app/api/track/route.ts` es el punto único de servidor. Hoy solo registra;
está ahí para que añadir un segundo destino sea tocar un archivo.

---

## Variables de entorno

Ver `.env.example`. Todas tienen respaldo en desarrollo.

| Variable | Sin ella |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | Usa `localhost:3000` y **bloquea la indexación**. |
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | El sitio arranca con contenido vacío. |
| `NEXT_PUBLIC_GA_ID` | No se carga GA4; los eventos van a la consola. |
| `RESEND_API_KEY` | Los formularios validan; el correo va a la consola. |

`robots.txt` bloquea la indexación completa mientras `NEXT_PUBLIC_SITE_URL`
no sea `https://`. Publicar en Google una versión de pruebas de una clínica
hace más daño que no estar. Se abre solo al apuntar al dominio real.

---

## Estado del sprint

| Criterio de verificación | Estado |
|---|---|
| Un cambio en `@theme` reviste el sitio; cero hex fuera de `globals.css` | ✅ `npm run verificar:tokens` |
| Cambiar la fuente en `app/fonts.ts` la cambia en todo el sitio | ✅ |
| Crear una especialidad en el Studio la hace aparecer en página, índice y sitemap | ✅ arquitectura lista, requiere proyecto de Sanity |
| `/sitemap.xml` y `/robots.txt` responden y reflejan Sanity | ✅ verificado |
| El JSON-LD es válido | ✅ estructura verificada; falta la prueba de Google con dominio real |
| `BookingCTA`: tres variantes, tres destinos, evento con origen | ✅ |
| Navegación con teclado, foco visible | ✅ |
| Los dos formularios envían y rechazan con mensaje claro en español | ✅ verificado de punta a punta |
| El proyecto arranca sin credenciales reales | ✅ |
| RNE en trámite nunca muestra "Especialista" | ✅ `npm run verificar:rne` |
| Lighthouse móvil ≥ 90 / 95 / 100 | ⏳ requiere contenido y despliegue |
| Despliegue en Vercel | ⏳ requiere autenticación |

---

## Fuera de alcance de este sprint

Diseño visual definitivo, textos reales, fotografías, enlaces reales de
Doctocliq, dominio de producción, blog, tienda, portal de pacientes,
versión en otro idioma.
