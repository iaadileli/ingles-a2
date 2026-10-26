# Inglés A2 · plan de progresión

Web con ejercicios de inglés para las clases de Adil (curso 2026-27, nivel A2).
Publicada en https://iaadileli.github.io/ingles-a2/ (repo `iaadileli/ingles-a2`).

## Historia
- **jun-2026**: nace como `iaadileli/verbos` (carpeta `verbos-juego`), un juego de
  verbos irregulares/regulares de una sola página.
- **22-sep-2026**: se renombra a `ingles-a2` y se convierte en un portal: portada
  (`index.html`) con una tarjeta por ejercicio; el juego de verbos pasa a `verbos/`.

## Estructura
```
index.html        portada con la lista de ejercicios (una tarjeta por carpeta)
verbos/           juego de verbos (150 verbos, modo escribir / pinchar, voz)
<tema>/           cada ejercicio nuevo va en su carpeta, con su index.html
PLAN.md           este fichero
```

## Normas
- Cada ejercicio es una página autocontenida (HTML + CSS + JS en un fichero),
  mismo estilo crema y tipografía que `verbos/`, enlace «← Inglés A2» arriba.
- Al añadir un ejercicio: crear su carpeta, añadir tarjeta en `index.html`,
  anotarlo aquí, commit + push a `main` (GitHub Pages sirve `main` en raíz).
- Adil prueba en la web desplegada desde el móvil; no decir «hecho» sin haberla
  abierto y comprobado.

## Ejercicios
| # | Carpeta   | Tema                              | Estado | Fecha       |
|---|-----------|-----------------------------------|--------|-------------|
| 1 | `verbos/` | Verbos irregulares y regulares    | ✅     | jun-2026    |
| 2 | `preguntas/` | Ordena la pregunta (orden de palabras) | ✅ fases 1 y 2, 300 preguntas | 22-sep-2026 |
| 3 | `modales/` | Verbos modales: chuleta + «elige el modal» (61) + «encuentra el error» (30) | ✅ | 28-sep-2026 |
| 4 | `presente-simple/` | Presente simple: chuleta + «elige la forma» (40) + «encuentra el error» (25) | ✅ | 26-oct-2026 |
| 5 | `presente-continuo/` | Presente continuo: chuleta (incl. verbos de estado y simple vs continuo) + «elige la forma» (40) + «encuentra el error» (25) | ✅ | 26-oct-2026 |

## PWA (22-sep-2026)
Todo el portal es instalable y funciona sin conexión: `manifest.webmanifest` + `sw.js`
(red primero, caché si no hay red) + `pwa.js` (registro y aviso «Hay una versión nueva»).
**Subir `CACHE` en `sw.js` en cada despliegue que toque html/js/json.**

## Ordena la pregunta (`preguntas/`) — brief de Adil del 21-sep-2026
Prototipo hecho por Adil con la app del móvil; brief completo en su zip (BRIEF.md).
- **Fase 1 (hecha 22-sep):** app sin build (HTML + módulos JS), motor `diagnostico.js`
  separado, datos en `datos/preguntas.json` (60 preguntas, 6 niveles, temas deducidos
  de los roles), inicio con filtros (niveles, temas, modo fijo/aleatorio/falladas,
  cuántas), progreso y sesión en localStorage (`preguntas.progreso.v1`), «continuar
  sesión», resumen final, botón Escuchar, modo oscuro, validador y 11 tests
  (`node --test preguntas/test/*.test.mjs`, incluidos los 6 fallos reales del brief).
- **Contenido (hecho 22-sep):** 300 preguntas (50 por nivel), todas pasan el validador; alternativas
  revisadas a mano en las que llevan expresión de tiempo.
- **Fase 2 (hecha 22-sep):** arrastrar fichas (ratón: arrastre directo; táctil: mantener
  pulsado ~0,2 s y arrastrar; tocar sigue siendo lo principal), repaso espaciado en modo
  aleatorio (peso por pregunta: fallada y no recuperada 4, nunca hecha 2, acertada hoy 0,3),
  tabla «Por tema (peor primero)» en el inicio, exportar/importar progreso en JSON.
  El arrastre táctil está verificado solo por lógica, no en un iPhone real.
- **Más adelante:** otros tipos de ejercicio con la misma arquitectura (completar el
  auxiliar, detectar el error, afirmación → pregunta). Pendiente de que Adil lo pida.

## Verbos modales (`modales/`) — 28-sep-2026
Nace de una duda de Adil en clase (ficha 1A «Student profile», *Where were you born?*).
Página única sin dependencias: pestaña **Chuleta** (3 reglas de oro, los 10 modales con
ejemplos y voz, los «casi modales» *have to / needn't / ought to / used to*, 6 trampas típicas)
y pestaña **Practicar** con dos juegos por interruptor: *elige el modal* (frase con hueco,
4 opciones, varias respuestas válidas admitidas, traducción y regla al responder) y
*encuentra el error* (frase mal escrita → elegir la correcta entre 3). Mazo barajado sin
repetir hasta agotar; marcador en localStorage (`modales_score`). Datos dentro del HTML
(`HUECOS`, `ERRORES`); al añadir frases, validar que ninguna trampa coincida con una respuesta válida.

## Presente simple y presente continuo (`presente-simple/`, `presente-continuo/`) — 26-oct-2026
Misma plantilla que `modales/` (mismo CSS y lógica de juego; datos `HUECOS`/`ERRORES` dentro del HTML,
listas de la chuleta en `LISTAS`). En los huecos la pista del verbo va entre paréntesis al final, p. ej.
`(work)`, y se quita al leer la frase completa. Marcador en localStorage `psimple_score` / `pcont_score`.
El continuo incluye frases de contraste con el simple (rutina vs ahora, verbos de estado).

## Revisión general — 26-oct-2026
Repaso de toda la web (gramática, opciones, traducciones, lógica). Corregido:
- **verbos/**: el 🔊 de *read* en pasado/participio suena «red»; al escribir se acepta «to be» y «was / were»;
  formas reales (*hanged, shined, betted, lied, quitted*) ya no salen como trampa; trampa «liing» → «lying».
- **preguntas/**: 10 ordenaciones válidas añadidas a `alt` (oración con *when* delante, etc.); n5-34 pasa a
  *How much did you pay for this?*; tips de n6-22, n2-39 y n5-23 afinados. Fichas en minúscula: se dejan (decisión de Adil).
- **modales/**: 3 trampas que en realidad eran válidas (*should rain*, *has to be*, *should like*); *could* ya no
  vale como hábito; textos de la chuleta precisados (respuesta corta a *Must I…?*, casi modales, *must* + futuro).
- **presente-simple/ y presente-continuo/**: trampa válida «is open» y «fly» sustituidas; regla de doblar
  consonante con su excepción (w, x, y).

## Pendiente
- Que Adil pruebe «Ordena la pregunta» en el iPhone (instalación, arrastre táctil, sin conexión).
- Nuevos ejercicios según vayan llegando de clase.
