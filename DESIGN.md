# Design

Sistema visual de Fieltromanía, documentado desde el código que corre.
Derivado del logo existente: un libro abierto en trazo negro grueso con tres
estrellas planas — morada, verde y naranja.

**Fuente de verdad: `src/app/globals.css`.** Este documento describe lo que hay
ahí; si difieren, gana el CSS.

## Dos registros, un solo sistema de color

El proyecto tiene dos superficies con reglas opuestas y tokens compartidos.
Confundirlas es el error más fácil de cometer aquí.

| | **Tienda** (`src/app/(tienda)`) | **Panel** (`src/app/admin`) |
|---|---|---|
| Rol | El diseño **es** el producto | El diseño **sirve** a la tarea |
| Trazo | `border-2` / `border-[3px] border-line` | `border border-line-soft` (1px) |
| Elevación | `shadow-solida` (desplazamiento sólido) | Ninguna |
| Tipografía | `font-display` en títulos y botones | Solo `font-sans`, nunca display |
| Escala | Fluida con `clamp()` | Fija en rem |
| Color | Paleta completa, tres roles activos | Sobrio; morado solo en acción y selección |
| Movimiento | 200 ms, con desplazamiento | 150 ms, solo color |

Verificación vigente: `font-display` aparece **0 veces** bajo `src/components/panel`
y `src/app/admin`. Si esa cuenta sube, el panel se está contaminando de la tienda.

## Theme

**Lane estético: libro infantil gráfico moderno.** La gramática de Dick Bruna
(Miffy) y del cartel holandés de mediados de siglo — contorno negro grueso,
color plano y confiado, formas geométricas simples, mucho aire.

Es la única salida del cuadrante que dejan las anti-referencias de PRODUCT.md:
colorida sin ser chillona (color plano y controlado, no saturado y brillante),
gráfica sin ser fría (hay color y forma, no solo aire blanco), artesanal sin ser
kitsch (geometría precisa en vez de texturas y manuscritas), y distintiva sin
ser plantilla.

**El trazo negro es la firma.** En la tienda reemplaza a las sombras suaves, que
quedan prohibidas. Es lo que hace que el sitio se lea como el logo.

**Tema por defecto: claro.** Escena: una madre en el sofá a las 22:30, teléfono
en mano, el living a media luz, mirando fotos de un libro de fieltro que vio en
Facebook. Necesita que los colores del fieltro se vean fieles; un fondo oscuro
los apaga. El tema oscuro existe porque esa misma escena ocurre a oscuras, pero
es la alternativa, no el punto de partida.

El conmutador vive en `src/components/theme-toggle.tsx` y decide el icono **por
CSS, no por estado de React**: next-themes escribe la clase en `<html>` antes
del primer pintado, así que no hay parpadeo ni desajuste de hidratación.

## Color

**Estrategia: paleta completa.** Tres roles nombrados, cada uno con trabajo
asignado. No es exceso: es el logo. Todo en OKLCH.

Cada color de marca tiene tres variantes, y elegir mal es el error de contraste
más común del proyecto:

| Sufijo | Para qué | Nunca |
|---|---|---|
| *(ninguno)* | Rellenos, formas grandes, superficies | Texto sobre fondo claro |
| `-txt` | Texto y enlaces sobre `--bg` | Fondos grandes |
| `-tenue` | Fondos suaves de insignias y tarjetas | Texto |

### Tokens

```
Superficies   --bg  --surface  --surface-2
Tinta         --ink  --ink-muted  --line  --line-soft
Morado        --violeta  --violeta-txt  --violeta-tenue
Verde         --verde  --verde-txt  --verde-tenue
Naranja       --naranja  --naranja-txt  --naranja-tenue
Alerta        --alerta  --alerta-tenue
```

- **Morado** — primario. Estrella grande del logo. Identidad, enlaces, elemento
  activo, botón primario del panel.
- **Verde** — confianza y naturaleza. Disponibilidad, materiales sostenibles,
  confirmaciones, WhatsApp.
- **Naranja** — acento y acción. Llamados a la acción de la tienda. El más
  escaso, el más ruidoso.
- **Alerta** — rojo, solo errores y agotado. Fuera de la paleta de marca a
  propósito.

El morado es primario porque es la estrella dominante del logo y porque el
reflejo del rubro es rojo-amarillo-azul o salvia-crema. Ninguno aparece aquí.

### Reglas duras

- **El fondo es blanco con tinte lila mínimo** (`chroma 0.004`), nunca crema ni
  beige. En oscuro, ciruela profundo; no negro puro, no gris neutro.
- **En oscuro el trazo se invierte**: `--line` pasa de tinta a casi blanco. La
  firma gráfica se conserva sin repintar componentes.
- **Sobre superficies teñidas (`-tenue`) el texto de cuerpo usa `--ink`, no
  `--ink-muted`.** El gris sobre color queda lavado y no alcanza 4.5:1. Se
  detectó midiendo, no estimando.
- **El botón primario de la tienda es naranja plano con texto tinta y borde
  tinta**, no naranja con texto blanco: más contraste, y es el movimiento del
  lane.
- **Verde y naranja jamás distinguen dos estados por sí solos.** Todo estado
  lleva etiqueta de texto — ver `insignias.tsx` en tienda y panel.

## Typography

**Display: Gabarito** (700, 800). Geométrica con curvas cálidas y algo de rareza
en la `a` y la `g`. Armoniza con el trazo redondo del logotipo sin imitarlo.
**Solo en la tienda.**

**Cuerpo: Hanken Grotesk** (400, 500, 600). Humanista, altura de x generosa,
excelente con tildes y eñes. Es la única familia del panel.

Emparejadas en eje de contraste (geométrica + humanista), no dos grotescas
parecidas.

Rechazadas por reflejo: Nunito, Poppins, Baloo, Fredoka — la respuesta
automática de "marca infantil amable". También Fraunces y Playfair: la
respuesta automática de "artesanal cálido".

### Escala

Fluida solo en la tienda, con `clamp()` y razón 1.25:

```
--text-display   clamp(2.5rem, 1.4rem + 5.5vw, 4.5rem)
--text-titulo    clamp(1.95rem, 1.2rem + 3.2vw, 3rem)
--text-seccion   clamp(1.5rem, 1.15rem + 1.6vw, 2rem)
--text-sub       clamp(1.2rem, 1.05rem + 0.7vw, 1.5rem)
```

El panel usa la escala fija de Tailwind: `text-xl` en títulos de página,
`text-base` en títulos de sección, `text-sm` en etiquetas y datos.

`text-wrap: balance` en h1–h3, `pretty` en prosa. Cuerpo tope 65–75ch; las
páginas de contenido se limitan a `max-w-[46rem]`.

## Shape & Space

- **Radios**: `--radius-control` 12px en controles, `--radius-card` 20px en
  tarjetas, `--radius-pill` 999px en píldoras. La redondez viene del logo.
- **Sin sombras difusas en ningún registro.** La tienda eleva con
  `--shadow-solida` (3px 3px 0) y `--shadow-solida-lg` (6px 6px 0), que es el
  trazo negro desplazado, como papel recortado. El panel no eleva.
- Ancho de contenido: `max-w-[76rem]` en tienda, `max-w-6xl`/`max-w-3xl` en
  panel según densidad.
- Grillas sin puntos de quiebre: `[grid-template-columns:repeat(auto-fit,minmax(min(280px,100%),1fr))]`.
  El `min()` interior evita el desborde en móvil que produce `minmax(280px,1fr)` a secas.
- Objetivos táctiles ≥44px (`min-h-11`) en todo control.

## Motion

Curvas exponenciales sin rebote: `--ease-salida` (0.22, 1, 0.36, 1) y
`--ease-salida-fuerte`.

**Un solo gesto con personalidad**, y solo en la tienda: los elementos con trazo
negro se levantan y su sombra sólida crece al pasar el cursor. Tarjetas de
producto, botones, píldoras de filtro, iconos de redes. Nada más.

El panel solo transiciona color, 150 ms.

`prefers-reduced-motion: reduce` anula toda animación en `globals.css`, y cada
componente con desplazamiento lleva además su `motion-reduce:` explícito para
que el elemento no quede a medio camino.

## Layers

Escala semántica, nunca valores arbitrarios:

```
--z-dropdown 10 · --z-sticky 20 · --z-backdrop 30
--z-modal 40 · --z-toast 50 · --z-tooltip 60
```

## Components

### Tienda — `src/components/tienda/`

| Componente | Qué resuelve |
|---|---|
| `tarjeta-producto.tsx` | Tarjeta de catálogo con portada, edad, precio y disponibilidad |
| `galeria.tsx` | Galería con miniaturas, cliente |
| `formulario-personalizacion.tsx` | Los campos que define el panel, con muestras de color y contador |
| `pagina-carrito.tsx` | Carrito, formulario de pedido y confirmación en una pantalla |
| `insignias.tsx` | Disponibilidad de cara al cliente, siempre con texto |
| `boton-carrito.tsx` | Contador del encabezado |
| `enlace-whatsapp.tsx` | Enlace con mensaje escrito; devuelve `null` sin número configurado |
| `enlaces-sociales.tsx` | Iconos de redes con etiqueta accesible propia |
| `pagina-contenido.tsx` | Envoltorio de las páginas de texto |

### Panel — `src/components/panel/`

| Componente | Qué resuelve |
|---|---|
| `boton-panel.tsx` | Botón sobrio, cuatro variantes, estados completos |
| `campos.tsx` | `Campo` (etiqueta + ayuda + error), `Entrada`, `AreaTexto`, `Seleccion` |
| `insignias.tsx` | Estado de producto, stock y pedido |
| `formulario-producto.tsx` | Formulario largo por secciones |
| `gestor-imagenes.tsx` | Subida, orden, portada y texto alternativo |
| `gestor-campos.tsx` | Editor de la personalización por producto |
| `navegacion.tsx` | Barra lateral, colapsa a fila en móvil |

### Marca — `src/components/marca/`

`logo.tsx` (isotipo y logotipo, SVG que responde al tema), `escena-fieltro.tsx`
(ilustración del arcoíris de la portada), `iconos-redes.tsx` (SVG propios:
lucide retiró los logotipos de terceros).

## Convenciones

- **Todo el código se nombra en español**: componentes, props, variables,
  tokens. Es el idioma del negocio y de quien lo administra.
- **Formularios con acciones de servidor**: React 19 reinicia el DOM del
  formulario al terminar una acción. Toda acción devuelve los valores enviados
  para repoblar los campos, y los formularios con `select` controlado se montan
  con una clave única por intento (`sello`) para no quedar desincronizados.
- **Nada de `useEffect` para sincronizar estado.** Se ajusta durante el
  renderizado; la regla `react-hooks/set-state-in-effect` está activa y el lint
  corre con `--max-warnings=0`.
