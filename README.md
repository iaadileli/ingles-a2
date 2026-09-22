# Inglés A2

Portal de ejercicios de inglés para las clases de la EOI. Web estática sin build,
publicada con GitHub Pages en <https://iaadileli.github.io/ingles-a2/>.
Es una PWA: en Safari de iPhone, «Compartir → Añadir a pantalla de inicio», y funciona sin conexión.

## Estructura

```
index.html                 portada: una tarjeta por ejercicio
verbos/                    juego de verbos irregulares y regulares
preguntas/                 «Ordena la pregunta» (orden de las palabras en las preguntas)
  index.html               la app (inicio + juego + resumen), sin dependencias
  diagnostico.js           motor: parseo de roles, temas y diagnóstico del error (sin DOM)
  datos/preguntas.json     banco de preguntas
  validar.mjs              validador del banco
  test/                    tests del diagnóstico (runner de Node)
manifest.webmanifest, sw.js, pwa.js, icon-*.png   PWA
PLAN.md                    plan y estado del proyecto
```

## Añadir preguntas

Edita `preguntas/datos/preguntas.json`. Cada pregunta:

```json
{ "id": "n3-11", "nivel": 3, "s": "Q:what time|A:does|S:their flight|V:arrive",
  "alt": [], "tags": [], "tip": "<b>What time</b> va junto…" }
```

- `s`: la frase correcta en minúsculas y sin signos, troceada por función gramatical con `|`.
  Roles: `Q` interrogativo · `QS` interrogativo que es el sujeto · `A` auxiliar (do/does/did/have/has/didn't)
  · `B` verbo *be* · `M` modal · `S` sujeto · `V` verbo · `R` resto (puede haber varios) · `P` preposición final
  · `I` parte indirecta. Un trozo de varias palabras se juega como bloque que va junto.
- `alt`: otras ordenaciones válidas completas (mismas palabras). Si una expresión de tiempo o un adverbio
  admite dos sitios, ponlos aquí o cambia la frase.
- `tags` (opcional): temas extra. Los temas normales (be, do, modal, wh, sujeto, prep, perfect, continuo,
  indirecta, negativa, sino) se deducen solos de los roles.
- `tip`: la regla, en español, HTML permitido.
- `id` único y `nivel` existente en `niveles`.
- `cefr` (opcional): `"B1"` si la pregunta se sale de A2 (indirectas, condicionales, negativas, pasado
  continuo, *used to*, present perfect continuo…). En el juego sale con un sello rojo «B1 · difícil».

Después:

```
node preguntas/validar.mjs      # formato, roles, duplicados, alternativas, avisos de orden
node --test preguntas/test/*.test.mjs
```

## Progreso

Se guarda en el móvil (`localStorage`, clave `preguntas.progreso.v1`). Para no perderlo al cambiar de
móvil: en el inicio, «Exportar progreso» descarga un JSON; «Importar progreso» lo carga en el otro.

## Desplegar

1. Si has tocado ficheros que se cachean (cualquier html/js/json), sube el número de `CACHE` en `sw.js`
   (`ingles-a2-v1` → `v2`). Si no, los móviles con la app instalada no verán el cambio.
2. `git commit` y `git push origin main`. GitHub Pages publica la rama `main` en la raíz en un minuto.
3. Al abrir la app, sale un aviso «Hay una versión nueva · Actualizar».

Para probar en local: `python3 -m http.server 8765` y abrir <http://localhost:8765/>
(los módulos JS no cargan abriendo el fichero directamente).
