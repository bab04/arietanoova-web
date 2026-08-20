import { cx } from "@/lib/clases";
import type { BloquePortable } from "@/types/contenido";

/**
 * Renderizador de Portable Text.
 *
 * Se escribe a mano en vez de traer @portabletext/react porque el esquema
 * `problema` solo permite párrafos, dos niveles de subtítulo, listas,
 * negrita, cursiva y enlaces. Traer una dependencia para eso no se paga.
 *
 * Si en Fase 2 el contenido crece (imágenes intercaladas, citas, tablas),
 * este es el punto donde conviene cambiar a la librería.
 */
export function TextoPortable({
  bloques,
  className,
}: {
  bloques?: BloquePortable[];
  className?: string;
}) {
  if (!bloques || bloques.length === 0) return null;

  const elementos: React.ReactNode[] = [];
  let listaAbierta: { tipo: string; elementos: React.ReactNode[] } | null = null;

  function cerrarLista() {
    if (!listaAbierta) return;
    const Etiqueta = listaAbierta.tipo === "number" ? "ol" : "ul";
    elementos.push(
      <Etiqueta
        key={`lista-${elementos.length}`}
        className={cx(
          "my-4 space-y-2 pl-5 font-cuerpo text-base leading-relaxed text-tinta",
          Etiqueta === "ol" ? "list-decimal" : "list-disc",
        )}
      >
        {listaAbierta.elementos}
      </Etiqueta>,
    );
    listaAbierta = null;
  }

  bloques.forEach((bloque, indice) => {
    if (bloque._type !== "block") return;

    const contenido = <Hijos bloque={bloque} />;

    if (bloque.listItem) {
      if (listaAbierta && listaAbierta.tipo !== bloque.listItem) cerrarLista();
      if (!listaAbierta) listaAbierta = { tipo: bloque.listItem, elementos: [] };
      listaAbierta.elementos.push(<li key={bloque._key ?? indice}>{contenido}</li>);
      return;
    }

    cerrarLista();

    const clave = bloque._key ?? indice;

    if (bloque.style === "h2") {
      elementos.push(
        <h2 key={clave} className="mt-10 font-display text-2xl font-semibold">
          {contenido}
        </h2>,
      );
      return;
    }

    if (bloque.style === "h3") {
      elementos.push(
        <h3 key={clave} className="mt-8 font-display text-xl font-semibold">
          {contenido}
        </h3>,
      );
      return;
    }

    elementos.push(
      <p key={clave} className="my-4 font-cuerpo text-base leading-relaxed text-tinta">
        {contenido}
      </p>,
    );
  });

  cerrarLista();

  return <div className={className}>{elementos}</div>;
}

function Hijos({ bloque }: { bloque: BloquePortable }) {
  const enlaces = new Map(
    (bloque.markDefs ?? []).map((def) => [def._key ?? "", def.href ?? ""]),
  );

  return (
    <>
      {(bloque.children ?? []).map((hijo, i) => {
        let nodo: React.ReactNode = hijo.text ?? "";

        for (const marca of hijo.marks ?? []) {
          if (marca === "strong") {
            nodo = <strong className="font-semibold">{nodo}</strong>;
          } else if (marca === "em") {
            nodo = <em className="italic">{nodo}</em>;
          } else if (enlaces.has(marca)) {
            const href = enlaces.get(marca) ?? "";
            const externo = /^https?:\/\//.test(href);
            nodo = (
              <a
                href={href}
                className="text-marca-700 underline underline-offset-4 hover:text-marca-900"
                {...(externo ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              >
                {nodo}
              </a>
            );
          }
        }

        return <span key={hijo._key ?? i}>{nodo}</span>;
      })}
    </>
  );
}
