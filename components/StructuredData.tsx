/**
 * StructuredData — inyecta el JSON-LD en la página.
 *
 * Los objetos los construyen las funciones de lib/jsonld.ts, que se
 * reexportan aquí para que las páginas importen de un solo sitio.
 */

import type { Json } from "@/lib/jsonld";

export {
  esquemaClinica,
  esquemaEspecialidad,
  esquemaFaq,
  esquemaMigas,
  esquemaPersona,
  esquemaProblema,
  esquemaSitio,
} from "@/lib/jsonld";

/**
 * Inyecta el JSON-LD en la página.
 *
 * `<` se escapa como la secuencia JSON de seis caracteres (barra invertida,
 * u, 0, 0, 3, c). Sin ese escape, un texto de Sanity que contuviera
 * `</script>` cerraría la etiqueta antes de tiempo y rompería la página.
 */
export function StructuredData({ datos }: { datos: Json | Json[] }) {
  const contenido = Array.isArray(datos) ? datos : [datos];
  if (contenido.length === 0) return null;

  const json = JSON.stringify(contenido.length === 1 ? contenido[0] : contenido);

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: json.replaceAll("<", "\\u003c") }}
    />
  );
}
