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
| 2 | —         | (ejercicio hecho en el móvil, pendiente de recibir) | ⏳ | 22-sep-2026 |

## Pendiente
- Recibir el ejercicio que Adil hizo ayer (21-sep) con la app del móvil e integrarlo.
- Valorar si merece la pena un `manifest.webmanifest` + service worker para
  instalarla como PWA en el móvil (como `ingles-eoi`).
