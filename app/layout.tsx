import type { Metadata, Viewport } from "next";
import { GoogleAnalytics } from "@next/third-parties/google";

import { clasesDeFuentes } from "@/app/fonts";
import { IDIOMA, URL_SITIO } from "@/lib/sitio";

import "./globals.css";

/**
 * Layout raíz.
 *
 * Solo monta <html>, <body>, las fuentes y la analítica. El encabezado, el
 * pie y las barras viven en app/(sitio)/layout.tsx, para que el Studio de
 * Sanity (/studio) no los herede.
 */

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

export const metadata: Metadata = {
  metadataBase: new URL(URL_SITIO),
  title: {
    // PROVISIONAL: el eslogan definitivo llega con los textos finales.
    default: "Arieta Noova",
    template: "%s · Arieta Noova",
  },
  alternates: { canonical: "/" },
  robots: {
    // Sin dominio de producción definido, el sitio no debe indexarse todavía.
    index: URL_SITIO.startsWith("https://"),
    follow: URL_SITIO.startsWith("https://"),
  },
  formatDetection: { telephone: true, address: false, email: false },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  // La marca no está definida: se deja que el navegador use el fondo real.
  colorScheme: "light",
};

export default function LayoutRaiz({ children }: { children: React.ReactNode }) {
  return (
    <html lang={IDIOMA} className={clasesDeFuentes}>
      <body className="bg-fondo font-cuerpo text-tinta antialiased">
        {children}
        {GA_ID ? <GoogleAnalytics gaId={GA_ID} /> : null}
      </body>
    </html>
  );
}
