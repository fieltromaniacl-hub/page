---
target: portada
total_score: 31
p0_count: 1
p1_count: 2
timestamp: 2026-08-29T04-23-42Z
slug: src-app-tienda-page-tsx
---
⚠️ DEGRADED: single-context (la sesión tiene instrucción permanente de no invocar sub-agentes sin petición explícita)

## Contexto al momento de la revisión

**La tienda no tenía ningún producto publicado.** La dueña todavía no había subido su
catálogo ni las fotos; la base tenía cero productos activos y tres ejemplos de prueba en
estado «sin publicar». La revisión se hizo sobre esa realidad, y eso condiciona parte de
lo que se ve, pero **no todo**. Conviene separarlo, porque de lo contrario un estado
temporal termina tapando defectos permanentes.

### Hallazgos que el catálogo vacío sí explica

- **Jordan abandona sin ver el producto.** Con el catálogo cargado, pulsar «Ver los
  libros» sí lleva a algo. Este riesgo desaparece solo.
- **La portada no muestra producto** — en parte. La ausencia de fotografía propia es
  consecuencia directa de que aún no hay fotos que mostrar.

### Hallazgos que el catálogo vacío NO explica

Estos siguen siendo defectos reales aunque mañana se carguen cincuenta productos:

- **[P0] `obtenerDestacados()` no lo llama nadie.** La casilla «Mostrar en la portada»
  del panel no haría nada tampoco con el catálogo lleno. No es que falten datos: falta
  el código que los consuma. Este hallazgo es independiente del contenido.
- **[P1] La portada no tiene dónde recibir una fotografía.** Aunque llegaran las fotos
  hoy, no hay ranura en el diseño para colocarlas. La ilustración está fija.
- **[P1] La banda de garantías** es andamiaje genérico con o sin productos.
- **[P2] Las tarjetas de edad prometen ser enlaces y no lo son.** Se levantan al pasar
  el cursor y no llevan a ninguna parte, con catálogo vacío o lleno.
- **[P2] Falta `aria-current` en el encabezado.**
- **[P2] En móvil la ilustración queda bajo los botones.**

### Qué revisar de nuevo cuando haya catálogo

El puntaje de 31/40 está deprimido sobre todo por las heurísticas 6 (reconocer en vez de
recordar) y 7 (flexibilidad), ambas puntuadas 2 porque no se ve producto. Con el catálogo
cargado y una sección de destacados funcionando, esas dos deberían subir solas. Vale la
pena volver a correr `/impeccable critique portada` en ese momento para medir el cambio
real en vez de suponerlo.


## Design Health Score

| # | Heurística | Puntaje | Hallazgo clave |
|---|-----------|:---:|---|
| 1 | Visibilidad del estado del sistema | 3 | El encabezado no marca la página activa: `aria-current` no aparece ni una vez |
| 2 | Correspondencia con el mundo real | 4 | «Se hace a pedido», «Es un encargo, no una compra al paso». El lenguaje es el de la clienta, no el del negocio |
| 3 | Control y libertad | 3 | Nada atrapa al usuario; tampoco hay mucho que deshacer |
| 4 | Consistencia y estándares | 4 | Un solo vocabulario de forma en toda la página |
| 5 | Prevención de errores | 3 | La copia anticipa la ansiedad del pago antes de que aparezca |
| 6 | Reconocer en vez de recordar | 2 | **La portada de una tienda no muestra ni un producto.** Hay que imaginar qué se vende |
| 7 | Flexibilidad y eficiencia | 2 | No existe ruta directa a un producto; todo pasa por el catálogo |
| 8 | Diseño estético y minimalista | 3 | Distintivo, pero la banda de garantías es andamiaje genérico |
| 9 | Recuperación de errores | 3 | No hay de qué recuperarse en esta página |
| 10 | Ayuda y documentación | 4 | Los tres pasos en la portada, más «Cómo funciona» y la columna de ayuda del pie |
| **Total** | | **31/40** | **Bueno — sólido en oficio, con una falla estructural** |

## Veredicto de anti-patrones

**Evaluación propia.** No parece hecho por IA. El lenguaje gráfico —trazo negro grueso, tres colores planos del logo, ilustración de fieltro dibujada a medida— es específico de esta marca y no se parece al catálogo de plantillas del rubro. Esquiva las cuatro anti-referencias declaradas y también el reflejo de segundo orden (el crema artesanal).

Con una excepción real: **la banda de garantías** (icono en cuadrado redondeado + título + texto, tres veces idénticas) es exactamente el patrón que la guía de marca marca como «grita plantilla». Es el único punto de la página donde el andamiaje se ve.

**Escaneo determinista.** `detect.mjs` sobre `src/app/(tienda)`, `src/components/tienda`, `layout`, `marca` y `ui`: **0 hallazgos**, código de salida 0.

**Detector en el navegador.** Inyectado sobre la página viva en localhost:3000. Consola: `[impeccable] No anti-patterns found`. Sin hallazgos de contraste calculado ni de patrones en el DOM.

Que ambos detectores estén limpios confirma el oficio, no la estrategia. Ninguno de los dos puede detectar que a una tienda le falten los productos.

## Impresión general

La página está bien hecha y mal enfocada. La artesanía visual es real: jerarquía tipográfica confiada, movimiento contenido con propósito, contraste verificado, cero desbordes en tres tamaños, lenguaje que suena a persona y no a comercio.

Y sin embargo **es una portada de tienda que no vende nada**. Se puede recorrer los 4.552 píxeles de alto en móvil sin ver un solo producto, un solo precio, una sola foto de un libro real. La página explica maravillosamente *cómo funciona comprar aquí* y nunca muestra *qué se compra*.

La mayor oportunidad no es estética: es poner producto sobre la mesa.

## Lo que funciona

**La copia hace el trabajo pesado.** «Es un encargo, no una compra al paso» resuelve en siete palabras la objeción más cara del negocio —por qué hay que esperar y por qué no se paga con tarjeta— y la convierte en señal de calidad en vez de excusa. «El pago y la entrega se coordinan contigo. Sin pagar nada por adelantado» está justo bajo el botón principal, donde nace la duda.

**La guía por edad es la arquitectura de información correcta.** No organiza por categoría de producto —que es como piensa el taller— sino por etapa del niño, que es como piensa quien compra. Un abuelo que no sabe qué regalar encuentra su respuesta sin saber qué es un quiet book.

**La ilustración del arcoíris se ganó su lugar.** Replica el lenguaje real del producto (lunares, franjas de fieltro, nube festoneada, puntada discontinua) en vez de recurrir a stock genérico. Es lo que impide que la página se vea como cualquier tienda.

## Problemas prioritarios

### [P0] El panel promete destacar productos en la portada, y la portada no puede cumplirlo

El formulario de producto tiene una casilla **«Mostrar en la portada»** que escribe `destacado = true` en la base. La función `obtenerDestacados()` existe en `src/lib/consultas.ts:64`. **Nadie la llama.** La portada hace cero consultas a la base de datos.

**Por qué importa:** no es una función faltante, es una mentira en la interfaz. La dueña puede marcar diez productos como destacados y no pasará nada nunca, sin ningún mensaje de error. Va a asumir que el sitio está roto —o peor, que hizo algo mal.

**Arreglo:** una sección de destacados en la portada que llame a `obtenerDestacados()`, con estado vacío honesto mientras no haya productos publicados. Si se decide no tenerla, hay que quitar la casilla del panel; una promesa sin cumplimiento es peor que no prometer.

**Comando sugerido:** `/impeccable craft sección de destacados en la portada`

### [P1] Cero fotografía de producto en toda la página

La guía de registro de marca es explícita: cero imágenes en un encargo que implica imágenes es un defecto, no una decisión de diseño. Una marca de objetos hechos a mano implica fotografía por definición.

**Por qué importa:** la visitante llega desde Facebook, donde acaba de ver fotos reales de libros de fieltro cosidos. Aterrizar en una ilustración es un retroceso: pierde la textura, el volumen del relleno, la puntada visible. Justo lo que justifica el precio.

**Arreglo:** la portada necesita al menos una fotografía real —idealmente manos de niño usando el libro, no el producto sobre fondo blanco— y la sección de destacados aporta el resto. Está bloqueado en que se carguen fotos, pero el diseño debe construirse ya para recibirlas.

**Comando sugerido:** `/impeccable craft portada con fotografía real`

### [P1] La banda de garantías es el único punto donde se ve el andamiaje

Tres ítems idénticos, icono en cuadrado redondeado + título + texto. Es el patrón que la guía marca como plantilla, y en una página que por lo demás tiene voz propia, canta.

**Por qué importa:** el contenido sí importa (hecho a mano, sin tóxicos, personalizado) pero la forma lo abarata. Son las tres razones para pagar más caro, presentadas como una fila de iconos de SaaS.

**Arreglo:** romper la simetría. Que las tres afirmaciones tengan pesos distintos —«Con su nombre» es la que diferencia y merece más espacio—, o integrarlas como texto dentro de la escena en vez de una banda aparte.

**Comando sugerido:** `/impeccable bolder banda de garantías`

### [P2] En móvil, la ilustración queda bajo los botones

El público compra en el teléfono. En 390px de ancho, el orden es: título, párrafo, dos botones, aviso legal, y recién ahí la imagen. Se pide decidir antes de mostrar.

**Arreglo:** subir la escena sobre los botones en móvil, o al menos sobre el párrafo. En escritorio el orden actual funciona porque van lado a lado.

**Comando sugerido:** `/impeccable adapt portada en móvil`

### [P2] El encabezado no indica dónde estás

`aria-current` aparece cero veces en `src/components/layout/encabezado.tsx`. Sí lo implementé en los filtros del catálogo y en la navegación del panel, así que es una inconsistencia interna, no un criterio.

**Por qué importa:** quien navega con teclado o lector de pantalla no recibe confirmación de en qué sección está. Visualmente tampoco hay estado activo.

**Comando sugerido:** `/impeccable audit encabezado`

## Banderas rojas por persona

**Jordan (primera vez, nunca compró fieltro artesanal).** Entra desde un enlace de Facebook. Lee «Un libro de fieltro con su nombre en la portada» y no sabe qué es un libro de fieltro: la página nunca se lo muestra. Tiene que hacer un acto de fe y pulsar «Ver los libros» para descubrir de qué se trata. Si el catálogo está vacío —hoy lo está— se va sin haber visto nunca el producto. **Abandona en el primer scroll.**

**Casey (teléfono, una mano, interrumpida).** 4.552 píxeles de scroll para llegar al pie. Los dos botones principales no ocupan el ancho completo, así que en un teléfono grande quedan lejos del pulgar. La imagen que la convencería está bajo el pliegue. Si la interrumpen a mitad de página, no se lleva ni una imagen del producto en la cabeza.

**La abuela que busca un regalo (persona propia del proyecto, de PRODUCT.md).** Es la que mejor la pasa: la guía por edad le responde exactamente su pregunta —«¿qué le sirve a un niño de tres años?»— sin exigirle vocabulario técnico. Su problema aparece después: al pulsar la etapa que le corresponde descubre que las tarjetas de edad **no son enlaces**. Informan y no llevan a ninguna parte. Tiene que volver arriba y buscar el catálogo por su cuenta.

## Observaciones menores

- Las tres tarjetas de etapa parecen accionables —tienen sombra al pasar el cursor y se levantan— pero no son enlaces. El gesto promete una interacción que no existe.
- El texto legal bajo los botones («El pago y la entrega se coordinan contigo…») usa el mismo tamaño y color que la ayuda de otros sitios, pero aquí es una promesa de venta. Merece más peso.
- La sección de cierre («¿Buscas un regalo que le dure años?») repite los mismos dos destinos que la portada superior. Al final de un scroll largo, una segunda oportunidad idéntica aporta poco.
- El alto del encabezado en móvil consume 64px fijos con `sticky`; con 4.552px de página, se justifica.

## Preguntas para pensar

- Si alguien ve **solo la primera pantalla** en su teléfono y nada más, ¿sabe qué vendes? Hoy sabe que vendes algo hecho a mano con un nombre bordado, pero no qué aspecto tiene.
- ¿La portada debería ser una página de marca con enlace al catálogo, o directamente el catálogo con una cabecera de marca? Para un taller con 20 productos, la segunda opción suele convertir mejor.
- Las tarjetas de edad son la mejor idea de la página. ¿Por qué no son el punto de entrada principal en vez de un botón genérico que dice «Ver los libros»?


---

## Seguimiento — correcciones aplicadas el 2026-08-29

Se arreglaron los seis hallazgos que no dependían del catálogo vacío. Los que sí
dependían quedan pendientes de que se carguen productos y fotos.

| Hallazgo | Estado |
|---|---|
| [P0] `obtenerDestacados()` sin llamador | **Resuelto.** La portada tiene sección de destacados. La consulta ahora ordena por destacado y rellena con lo más reciente, así la casilla del panel prioriza en vez de ser el único camino; una tienda con productos nunca muestra portada vacía por olvidar marcarlos. La casilla pasó a llamarse «Priorizar en la portada» con su explicación. |
| [P1] Sin dónde recibir fotografía | **Resuelto.** La sección de destacados muestra fotos reales de producto en cuanto se publique el catálogo. |
| [P1] Banda de garantías genérica | **Resuelto.** Se rompió la simetría: «Lleva su nombre» pasa a ser la afirmación grande, con las otras dos como lista compacta al costado. |
| [P2] Tarjetas de edad sin enlace | **Resuelto.** Enlazan a `/productos?edad=1-2`, etc. Se añadió filtro por rango con semántica de solape: un libro de 3-6 años ahora aparece en «5 a 7», que con la comprobación de edad puntual no aparecía. |
| [P2] Falta `aria-current` | **Resuelto.** Con estado visual además. De paso se quitó el enlace duplicado del menú: «Libros» y «Catálogo» iban al mismo destino. Ahora hay cuatro destinos distintos. |
| [P2] Ilustración bajo los botones en móvil | **Resuelto.** La escena va primero y se achicó a 17rem; el botón principal queda completo dentro de la primera pantalla y a ancho completo, al alcance del pulgar. |

También se atendieron dos observaciones menores: el aviso de «no se paga nada»
pasó de letra chica a bloque con trazo, y la sección de cierre dejó de repetir
los destinos de la portada — ahora ofrece una recomendación por WhatsApp.

**Pendiente, bloqueado en el catálogo:** fotografía propia en la primera
pantalla y la validación de que un visitante nuevo entienda el producto sin
tener que confiar. Conviene volver a correr la crítica cuando haya productos
publicados; las heurísticas 6 y 7 deberían subir de 2 a 3 o 4.
