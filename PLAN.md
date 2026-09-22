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
| 2 | `preguntas/` | Ordena la pregunta (orden de palabras) | ✅ fase 1 | 22-sep-2026 |

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
- **Contenido (pendiente):** ampliar a ≥300 preguntas por nivel y tema pasando la validación.
- **Fase 2 (pendiente):** arrastrar fichas, repaso espaciado, estadísticas por tema,
  exportar/importar progreso; más adelante otros tipos de ejercicio.

## Pendiente
- Contenido a 300 preguntas → fase 2 (ver arriba).
