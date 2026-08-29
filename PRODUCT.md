# Product

## Register

brand

## Users

**Primario — madres y padres jóvenes (25-40), Chile.** Compran para su propio hijo de 1 a 7 años.
Llegan desde Facebook e Instagram, casi siempre en el teléfono, muchas veces de noche después de
acostar a los niños. No están comparando precios: ya vieron el producto en redes y quieren saber
si existe, cuánto cuesta y cómo lo consiguen. Su trabajo por hacer es *elegir el libro correcto
para la etapa de su hijo y pedirlo sin fricción*.

**Secundario — quien compra de regalo (abuelos, tíos, amigos).** Cumpleaños, bautizos, nacimientos.
No conocen al niño tan de cerca y necesitan que el sitio les responda "¿qué le sirve a un niño de
tres años?". Menos alfabetizados digitalmente, más sensibles a señales de confianza: quién está
detrás, cuánto demora, cómo se paga.

Ambos necesitan entender rápido que el producto es **hecho a mano y personalizado**, y por lo tanto
que no es una compra instantánea sino un encargo con conversación de por medio.

**Interna — la dueña del taller, administrando.** Es la tercera usuaria y la que más horas pasa en
el sitio. Carga productos entre puntada y puntada, muchas veces desde el teléfono y con las manos
ocupadas. No es diseñadora ni programadora: el panel tiene que explicarse solo, no perder lo que
escribió si algo falla, y no obligarla a recordar en qué orden hacer las cosas.

Su trabajo por hacer es doble: *publicar un producto sin fricción* y *atender un pedido sin tener
que pedirle datos al cliente por mensaje*. Todo lo que el panel no capture bien se convierte
después en una conversación de WhatsApp que ella tiene que sostener.

## Product Purpose

Fieltromanía vende libros de fieltro artesanales y personalizados para niños de 1 a 7 años, además
de letreros personalizados, sujeta cortinas y recuerdos para eventos. Hecho a mano en Chile con
materiales sostenibles.

Hoy la marca tiene 6.500 seguidores en Facebook pero ninguna vitrina propia: cada venta nace de un
mensaje privado, y el catálogo vive disperso en publicaciones antiguas. El sitio existe para
convertir esa audiencia ya ganada en pedidos ordenados, y para ser encontrable fuera de las redes
sociales — por buscadores y por asistentes de IA.

El pago y la entrega se coordinan por contacto directo. El sitio no cobra: **recoge el pedido
completo, con los datos de personalización, y abre la conversación con el cliente.**

Éxito es: un pedido que llega con todo lo necesario para empezar a fabricar sin tener que
preguntar nada por WhatsApp.

El producto tiene **dos superficies con reglas distintas**. La tienda pública comunica: ahí el
diseño es el producto y puede tomar riesgos. El panel de administración sirve a una tarea: ahí el
diseño debe desaparecer detrás del trabajo. El registro declarado arriba es el de la superficie
principal; el panel se diseña con el registro contrario y DESIGN.md documenta cómo se separan.

## Brand Personality

Alegre, artesanal, precisa. La voz de alguien que cose a mano y sabe exactamente por qué esa
página del libro trabaja la motricidad fina.

Habla en español de Chile, cercano pero sin diminutivos ni infantilización del adulto. Al comprador
se le trata como madre o padre inteligente, no como niño. El encanto lo pone el producto; el texto
aporta claridad y criterio pedagógico.

Emociones objetivo: **ternura y confianza**. Ternura por el objeto; confianza en que llega, en que
está bien hecho, y en que hay una persona real detrás.

## Anti-references

Las cuatro rechazadas explícitamente por la dueña de la marca:

- **Tienda genérica de plantilla.** El look Shopify/WooCommerce por defecto. Un producto hecho a mano
  no puede venderse en una vitrina que se ve igual que mil otras.
- **Chillón tipo juguete de plástico.** Colores primarios saturados, globos, tipografía "divertida".
  Abarata un producto artesanal de precio alto.
- **Minimalista frío de startup.** Blanco, gris, azul, mucho aire vacío. Elegante pero sin alma;
  contradice "hecho a mano por una persona".
- **Recargado tipo feria artesanal.** Texturas de papel envejecido, tipografía manuscrita, fondos de
  madera, sombras exageradas. Lee como amateur.

Añado una quinta por criterio propio:

- **El fondo crema/beige de emprendimiento artesanal.** Es el reflejo automático para este rubro y
  ya está saturado. La calidez la ponen el color de marca y las fotos, no un fondo tostado.

## Design Principles

1. **El logo ya era el sistema.** Tres colores planos que ordenan todo el sitio, en vez de
   inventar una identidad paralela. El logo se redujo a las tres estrellas el 2026-08-30; el
   trazo negro grueso sigue siendo la firma del sitio, ahora como decisión propia del sistema
   visual y no como herencia del logotipo.

2. **La foto del fieltro es el color.** El producto es intensamente colorido y texturado. La
   interfaz se mantiene gráfica y plana para no competir con él; el color de marca estructura, las
   fotos deslumbran.

3. **Personalizar es el producto, no una casilla extra.** Elegir el nombre a bordar y los colores
   es el momento emocional de la compra. Merece ser el centro de la ficha de producto, no una nota
   al pie del carrito.

4. **Decir la verdad sobre los plazos.** Hecho a mano significa espera. Anticipar el tiempo de
   confección y el pago por acuerdo genera más confianza que ocultarlo hasta el final.

5. **Legible para máquinas.** Buscadores y asistentes de IA son un canal de adquisición, no un
   trámite técnico. Contenido en el HTML, datos estructurados en cada producto, texto alternativo
   que describe de verdad.

6. **Nunca perder trabajo de nadie.** Un formulario que se vacía al fallar la validación, un pedido
   que se pierde porque falló el correo, una foto que se sube pero no se registra: todos son la
   misma falta. El trabajo de la clienta y el de la dueña se conservan aunque algo más se rompa.

## Accessibility & Inclusion

**WCAG 2.2 nivel AA** como piso, verificado y no asumido.

- Contraste ≥4.5:1 en texto de cuerpo y marcadores de posición; ≥3:1 en texto grande y en bordes de
  controles. Se verifica en **ambos temas**, claro y oscuro.
- El color nunca es el único portador de información: los estados de stock ("Disponible", "Por
  encargo", "Agotado") llevan siempre etiqueta de texto, no solo un punto de color.
- La paleta se revisa contra deuteranopía y protanopía. Verde y naranja no pueden ser el único par
  que distinga dos estados.
- Navegación completa por teclado con foco visible y grueso, coherente con el trazo negro de la
  marca. Enlace de salto al contenido.
- `prefers-reduced-motion` respetado en toda animación, con alternativa de fundido o transición
  instantánea.
- Objetivos táctiles ≥44px: el público compra en el teléfono, muchas veces con una mano y un niño
  en la otra.
- Idioma declarado `es-CL`. Formato de precio en pesos chilenos sin decimales.
