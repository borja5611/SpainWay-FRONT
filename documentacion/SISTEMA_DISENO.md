# Sistema de diseño

El sistema de diseño de SpainWay se apoya en **Tailwind CSS v4** configurado **por CSS**
(no existe `tailwind.config.js`). Los tokens de marca se declaran como variables CSS en
`src/styles/theme.css` y se exponen a Tailwind mediante el bloque `@theme inline`, de modo
que cada token genera automáticamente sus utilidades (`bg-coral`, `text-coral`, `shadow-card`…).

## Paleta y lenguaje visual

Estética limpia y *mobile-first*: fondo blanco, gris suave, texto oscuro, acento coral,
tarjetas blancas, sombras suaves y esquinas redondeadas.

| Rol | Valor (claro) | Token Tailwind |
|-----|---------------|----------------|
| Fondo | `#ffffff` | `bg-background` |
| Texto | `oklch(0.145 0 0)` | `text-foreground` |
| Tarjeta | `#ffffff` | `bg-card` |
| Silenciado | `#ececf0` / `#717182` | `bg-muted` / `text-muted-foreground` |
| **Marca (coral)** | `#ff5a36` | `bg-coral` / `text-coral` |

## El coral como token de primer nivel (mejora)

Antes el coral (`#ff5a36`) se escribía **inline** por toda la app, con deriva de tonos entre
pantallas. Ahora es un **token de marca de primer nivel** con toda su familia y variante de
modo oscuro, definido una sola vez:

```css
/* src/styles/theme.css — :root */
--coral: #ff5a36;
--coral-hover: #e8462a;
--coral-strong: #d83a1f;
--coral-soft: #fff1ee;
--coral-border: rgba(255, 90, 54, 0.22);
--coral-foreground: #ffffff;
```

```css
/* Variante en modo oscuro (.dark): se mantiene coherente */
--coral: #ff6a47;
--coral-soft: rgba(255, 90, 54, 0.16);
--coral-border: rgba(255, 90, 54, 0.32);
```

Y se publican como colores Tailwind dentro de `@theme inline`:

```css
@theme inline {
  --color-coral: var(--coral);
  --color-coral-hover: var(--coral-hover);
  --color-coral-strong: var(--coral-strong);
  --color-coral-soft: var(--coral-soft);
  --color-coral-border: var(--coral-border);
  --color-coral-foreground: var(--coral-foreground);
}
```

| Token | Utilidades que habilita | Uso típico |
|-------|-------------------------|-----------|
| `--color-coral` | `bg-coral`, `text-coral`, `border-coral` | Botones primarios, acentos, marcadores del mapa. |
| `--color-coral-hover` | `hover:bg-coral-hover` | Estado *hover* de botones coral. |
| `--color-coral-strong` | `text-coral-strong` | Texto sobre fondos coral suaves. |
| `--color-coral-soft` | `bg-coral-soft` | Fondos de chips, paneles de confianza. |
| `--color-coral-border` | `border-coral-border` | Bordes de tarjetas de tono coral. |
| `--color-coral-foreground` | `text-coral-foreground` | Texto sobre coral sólido. |

## Sombras y radios

Tres sombras de marca, también expuestas como utilidades (`shadow-card`, `shadow-card-hover`,
`shadow-premium`):

```css
@theme inline {
  --shadow-card:       0 1px 2px rgba(15,23,42,.04), 0 8px 24px rgba(15,23,42,.06);
  --shadow-card-hover: 0 2px 4px rgba(15,23,42,.06), 0 16px 40px rgba(15,23,42,.10);
  --shadow-premium:    0 14px 40px rgba(255,90,54,.18);
}
```

Radios derivados de `--radius: 0.625rem`: `--radius-sm/-md/-lg/-xl` → `rounded-sm … rounded-xl`.
Las primitivas usan además radios grandes literales (`rounded-2xl`, `rounded-3xl`) para el look
suave característico.

## Tipografía

Dos familias cargadas desde Google Fonts en `src/styles/fonts.css`:

| Familia | Variable | Uso |
|---------|----------|-----|
| **Inter** | `--font-family-base` | Texto base, controles, cuerpo. |
| **Playfair Display** | `--font-family-display` | Títulos y cabeceras "display". |

Los títulos de las primitivas aplican la display vía estilo inline:
`style={{ fontFamily: "var(--font-family-display)" }}` (p. ej. en `PageHeader`, `SectionHeader`,
`TrustPanel`, `ItineraryInsightCard`). Los estilos base de `h1..h4`, `p`, `label`, `button`,
`input` se definen en `@layer base`, por lo que cualquier utilidad Tailwind (`text-sm`, `text-lg`)
los sobrescribe sin conflicto.

## Modo oscuro

Se declara con `@custom-variant dark (&:is(.dark *));`. Añadiendo la clase `.dark` a un ancestro
se activan todos los overrides de `.dark { … }`, incluida la familia coral. Las utilidades
`dark:` funcionan de forma estándar.

## Helper `cn()`

Toda composición de clases pasa por `cn()` (`src/lib/cn.ts`), que combina **clsx**
(condicionales) y **tailwind-merge** (resolución de conflictos: gana la última utilidad del
mismo grupo).

```ts
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
```

```tsx
// Ejemplo: variantes + override del consumidor sin colisiones
cn(
  "rounded-3xl border p-5 shadow-card",
  tone === "coral" && "border-coral-border bg-coral-soft",
  interactive && "hover:-translate-y-1 hover:shadow-card-hover",
  className, // el consumidor siempre puede ganar
);
```

`cn("p-2", "p-4")` devuelve `"p-4"`: el conflicto de *padding* se resuelve a favor del último,
comportamiento cubierto por los tests (ver `TESTS_FRONTEND.md`).
