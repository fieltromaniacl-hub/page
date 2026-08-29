# Design

Sistema visual de Fieltromanía. Derivado del logo existente: un libro abierto en trazo negro
grueso con tres estrellas planas — morada, verde y naranja.

## Theme

**Lane estético: libro infantil gráfico moderno.** La gramática de Dick Bruna (Miffy) y del cartel
holandés de mediados de siglo — contorno negro grueso, color plano y confiado, formas geométricas
simples, mucho aire. Precisión de diseñador adulto aplicada a un mundo infantil.

Es la única salida del cuadrante que dejan las anti-referencias: colorida sin ser chillona (el
color es plano y controlado, no saturado y brillante), gráfica sin ser fría (hay color y forma, no
solo aire blanco), artesanal sin ser kitsch (geometría precisa en lugar de texturas y manuscritas),
y distintiva sin ser plantilla.

**El trazo negro es la firma.** Bordes de 2-3px en negro tinta sobre tarjetas, botones, campos de
formulario y contenedores de imagen. No es decoración: es lo que hace que el sitio se lea como el
logo. Reemplaza a las sombras suaves, que quedan prohibidas.

**Tema por defecto: claro.** Escena: una madre en el sofá a las 22:30, teléfono en mano, el living
a media luz, mirando fotos de un libro de fieltro que vio en Facebook. Necesita que las fotos del
producto se vean fieles y luminosas — un fondo oscuro las apaga y falsea los colores del fieltro.
El tema oscuro existe porque esa misma escena ocurre a oscuras y el sitio no debe encandilar, pero
es la alternativa, no el punto de partida.

## Color

**Estrategia: paleta completa (full palette).** Tres roles nombrados, cada uno con trabajo asignado.
No es exceso: es el logo. Espacio de color OKLCH en todo el sistema.

### Roles de marca

| Rol | Token | Trabajo |
|---|---|---|
| **Morado** (estrella grande) | `--violeta` | Color primario. Identidad, encabezados de sección, enlaces, elemento activo. |
| **Verde** (estrella derecha) | `--verde` | Confianza y naturaleza. Disponibilidad, materiales sostenibles, confirmaciones. |
| **Naranja** (estrella chica) | `--naranja` | Acento y acción. Llamados a la acción, destacados, badges. El más escaso, el más ruidoso. |
| **Tinta** | `--ink` | El trazo del logo. Texto, bordes, contornos. Negro cálido violáceo, nunca #000. |

El morado es primario porque es la estrella dominante del logo y porque el reflejo del rubro es
rojo-amarillo-azul o salvia-crema. Ninguno de los dos aparece aquí.

### Fondo

Blanco con el tinte lila más leve posible (chroma 0.004 hacia el matiz de marca), **nunca crema ni
beige**. En oscuro, ciruela profundo — no negro puro, no gris neutro.

### Reglas de contraste

Cada color de marca tiene dos versiones: la **plana** (fondos, formas grandes, superficies) y la
**fuerte** (texto y enlaces sobre fondo claro, donde la plana no alcanza 4.5:1). Nunca usar la
versión plana para texto de cuerpo sobre blanco.

El botón primario es **naranja plano con texto tinta y borde tinta**, no naranja con texto blanco:
más contraste, y es el movimiento del lane.

Verde y naranja jamás distinguen dos estados por sí solos — siempre con etiqueta de texto, por
daltonismo.

## Typography

**Display: Gabarito** (700, 800). Geométrica con curvas cálidas y algo de rareza en la `a` y la
`g`. Armoniza con el trazo redondo del logotipo sin imitarlo.

**Cuerpo: Hanken Grotesk** (400, 500, 600). Humanista, altura de x generosa, excelente con tildes y
eñes. Aporta la calidez y legibilidad que la display no tiene que cargar.

Emparejadas en eje de contraste (geométrica + humanista), no dos grotescas parecidas.

Rechazadas por reflejo: Nunito, Poppins, Baloo, Fredoka — la respuesta automática de "marca
infantil amable". También Fraunces y Playfair: la respuesta automática de "artesanal cálido".

Escala modular de razón 1.25, fluida con `clamp()`. Techo de display 4.5rem. Cuerpo tope 68ch.
`text-wrap: balance` en h1-h3, `pretty` en prosa.

## Shape & Space

- **Radios generosos y consistentes**: 12px en controles, 20px en tarjetas, 999px en píldoras. La
  redondez viene del logo; los cuadrados duros contradicen la marca.
- **Sin sombras suaves.** La elevación se expresa con el trazo negro y con desplazamiento sólido
  (un borde negro desplazado 3px) en los elementos que lo merecen.
- Escala de espaciado en múltiplos de 4px, fluida con `clamp()` en separaciones de sección.
- Grillas sin puntos de quiebre donde se pueda: `repeat(auto-fit, minmax(280px, 1fr))`.

## Motion

Discreta y funcional. Curvas `ease-out` exponenciales, sin rebote ni elástico. Las transiciones
sirven a la orientación (abrir el carrito, cambiar de tema, confirmar que algo se agregó), no a la
decoración.

Un solo gesto con personalidad: los elementos con trazo negro desplazan su sombra sólida al pasar
el cursor, como si el papel se levantara. Nada más.

`prefers-reduced-motion: reduce` sustituye todo movimiento por fundido o cambio instantáneo.

## Layers

Escala semántica de `z-index`: `dropdown` → `sticky` → `modal-backdrop` → `modal` → `toast` →
`tooltip`. Nunca valores arbitrarios.
