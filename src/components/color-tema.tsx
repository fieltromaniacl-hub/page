"use client";

import { useTheme } from "next-themes";
import { useEffect } from "react";

/**
 * Equivalentes en hex de `--bg` en cada tema. La barra del navegador no
 * entiende tokens CSS, así que estos dos valores son la única copia de la
 * paleta que vive fuera de `globals.css`: si `--bg` cambia, cambian aquí.
 *
 * Medidos desde los tokens: oklch(0.985 0.004 292) y oklch(0.185 0.022 292).
 */
const COLOR_DE_BARRA = {
  light: "#fafafd",
  dark: "#13111c",
} as const;

/**
 * Mantiene `<meta name="theme-color">` en sintonía con el tema que se está
 * viendo.
 *
 * No basta con declararlo en `viewport`: esa vía solo admite
 * `prefers-color-scheme`, que sigue al sistema operativo, mientras que el sitio
 * conmuta por clase y arranca en claro. Un teléfono con el sistema en oscuro
 * pintaba la barra oscura sobre una página clara, y el conmutador de tema no
 * la movía nunca.
 *
 * Es un efecto sobre el DOM, no sincronización de estado: la regla de
 * DESIGN.md contra `useEffect` apunta a lo segundo.
 */
export function ColorDeTema() {
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    const color = COLOR_DE_BARRA[resolvedTheme === "dark" ? "dark" : "light"];
    let meta = document.querySelector<HTMLMetaElement>(
      'meta[name="theme-color"]',
    );

    if (!meta) {
      meta = document.createElement("meta");
      meta.name = "theme-color";
      document.head.appendChild(meta);
    }

    meta.content = color;
  }, [resolvedTheme]);

  return null;
}
