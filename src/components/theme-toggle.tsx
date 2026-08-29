"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

/**
 * Conmutador de tema sin estado de montaje.
 *
 * next-themes escribe la clase `dark` en <html> antes del primer pintado, así
 * que qué icono mostrar lo decide CSS, no JavaScript: no hay desajuste de
 * hidratación, no hay parpadeo y el botón ocupa su tamaño desde el primer
 * cuadro. La etiqueta accesible es independiente del estado para no requerir
 * un valor que el servidor no puede conocer.
 */
export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      aria-label="Cambiar entre tema claro y oscuro"
      title="Cambiar entre tema claro y oscuro"
      className="grid size-11 shrink-0 place-items-center rounded-pill border-2 border-line bg-surface text-ink transition-[background-color,box-shadow,translate] duration-200 ease-[var(--ease-salida)] hover:-translate-y-0.5 hover:bg-violeta-tenue hover:shadow-solida active:translate-y-0 active:shadow-none motion-reduce:hover:translate-y-0"
    >
      <Moon
        className="size-5 dark:hidden"
        strokeWidth={2.5}
        aria-hidden="true"
      />
      <Sun
        className="hidden size-5 dark:block"
        strokeWidth={2.5}
        aria-hidden="true"
      />
    </button>
  );
}
