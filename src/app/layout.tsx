import type { Metadata, Viewport } from "next";
import { Gabarito, Hanken_Grotesk } from "next/font/google";

import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";

const gabarito = Gabarito({
  variable: "--font-gabarito",
  subsets: ["latin"],
  display: "swap",
});

const hanken = Hanken_Grotesk({
  variable: "--font-hanken",
  subsets: ["latin"],
  display: "swap",
});

const sitioUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://fieltromania.cl";

export const metadata: Metadata = {
  metadataBase: new URL(sitioUrl),
  title: {
    default: "Fieltromanía · Libros de fieltro artesanales y personalizados",
    template: "%s · Fieltromanía",
  },
  description:
    "Libros de fieltro hechos a mano en Chile, personalizados con el nombre de tu hijo. Juegos educativos y sostenibles para niños de 1 a 7 años.",
  applicationName: "Fieltromanía",
  authors: [{ name: "Fieltromanía" }],
  creator: "Fieltromanía",
  keywords: [
    "libros de fieltro",
    "quiet book",
    "libro sensorial",
    "juguetes educativos",
    "hecho a mano Chile",
    "estimulación temprana",
    "juguetes personalizados",
    "material didáctico fieltro",
  ],
  openGraph: {
    type: "website",
    locale: "es_CL",
    siteName: "Fieltromanía",
    title: "Fieltromanía · Libros de fieltro artesanales y personalizados",
    description:
      "Libros de fieltro hechos a mano en Chile, personalizados con el nombre de tu hijo. Para niños de 1 a 7 años.",
    url: sitioUrl,
  },
  twitter: {
    card: "summary_large_image",
    title: "Fieltromanía · Libros de fieltro artesanales",
    description:
      "Libros de fieltro hechos a mano en Chile, personalizados para niños de 1 a 7 años.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  alternates: { canonical: "/" },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fbfafd" },
    { media: "(prefers-color-scheme: dark)", color: "#221f2c" },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es-CL"
      suppressHydrationWarning
      className={`${gabarito.variable} ${hanken.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-bg text-ink">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <a
            href="#contenido"
            className="sr-only rounded-control border-2 border-line bg-naranja px-4 py-2 font-semibold text-ink focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[var(--z-tooltip)]"
          >
            Saltar al contenido
          </a>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
