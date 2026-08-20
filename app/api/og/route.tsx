import { ImageResponse } from "next/og";

import { tokens } from "@/lib/tokens";

/**
 * GET /api/og?titulo=...&etiqueta=...
 *
 * Genera la imagen de Open Graph de cada página a partir de su título.
 *
 * Los colores salen de lib/tokens.ts y no de clases de Tailwind: este
 * renderizador es aislado y no lee la hoja de estilos del sitio. Es el
 * único lugar, junto a la plantilla de correo, donde eso ocurre — y por
 * eso los tokens tienen un espejo en TypeScript.
 *
 * PROVISIONAL: cuando llegue el kit de marca, esta imagen debería llevar
 * el logotipo. Hasta entonces se resuelve solo con tipografía.
 */

export const runtime = "edge";

const ANCHO = 1200;
const ALTO = 630;

export async function GET(peticion: Request) {
  const { searchParams } = new URL(peticion.url);

  const titulo = (searchParams.get("titulo") ?? "Arieta Noova").slice(0, 120);
  const etiqueta = searchParams.get("etiqueta")?.slice(0, 60);

  // El título largo baja de tamaño para que nunca se desborde el lienzo.
  const tamanoTitulo = titulo.length > 60 ? 56 : titulo.length > 35 ? 68 : 84;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "80px",
          backgroundColor: tokens.fondo,
          // Franja de acento a la izquierda: identifica la marca sin logotipo.
          borderLeft: `24px solid ${tokens.marca700}`,
        }}
      >
        {etiqueta ? (
          <div
            style={{
              display: "flex",
              fontSize: 26,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: tokens.marca500,
              fontWeight: 600,
            }}
          >
            {etiqueta}
          </div>
        ) : (
          <div style={{ display: "flex" }} />
        )}

        <div
          style={{
            display: "flex",
            fontSize: tamanoTitulo,
            lineHeight: 1.1,
            color: tokens.marca900,
            fontWeight: 700,
            maxWidth: "900px",
          }}
        >
          {titulo}
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontSize: 28,
            color: tokens.suave,
          }}
        >
          <span style={{ color: tokens.tinta, fontWeight: 600 }}>Arieta Noova</span>
          <span>Pueblo Libre, Lima</span>
        </div>
      </div>
    ),
    {
      width: ANCHO,
      height: ALTO,
      headers: {
        // Un año: la imagen solo cambia si cambia el título, y el título
        // viaja en la propia URL.
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    },
  );
}
