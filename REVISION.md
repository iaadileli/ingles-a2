# Revisión obligatoria antes de publicar

Esta web es para **aprender**: Adil confía en que todo lo que sale es correcto. Un error de gramática,
una traducción mala o una opción «incorrecta» que en realidad es válida le enseña algo falso.
Por eso **nada se publica sin pasar estos pasos**, sea un ejercicio nuevo o un cambio pequeño.

Origen: 26-oct-2026, la revisión general encontró unos 30 fallos en contenido ya publicado
(sobre todo trampas que eran respuestas válidas). No puede repetirse.

## Pasos (en orden, todos)

1. **Validadores automáticos** — `npm run comprobar` (estructura de datos + tests + banco de preguntas).
2. **Dos revisiones independientes del contenido**, con agentes distintos que solo leen y no se ven entre sí:
   - A: gramática y naturalidad del inglés (británico), explicaciones de la chuleta y de los tips.
   - B: «abogado del diablo» de las opciones: por cada trampa, ¿hay algún contexto en que sea correcta?
     Por cada `ok`, ¿es dudosa? En «encuentra el error», ¿la frase mala tiene error de verdad?
     Traducciones y ortografía española (tildes, ¿¡).
   Cada una devuelve hallazgos con ERROR SEGURO / DISCUTIBLE.
3. **Yo verifico cada hallazgo** y corrijo. Ante la duda, se cambia la frase o la trampa por otra
   inequívoca (mejor quitar que dejar algo discutible). Si hubo cambios de contenido, **repetir el paso 2**
   sobre lo cambiado hasta que salga limpio.
4. **Prueba en navegador** (Playwright, móvil 390 px): todas las rondas de los juegos, sin errores JS.
5. **Sello**: commit, y luego `npm run revisado`. El hook `hooks/pre-push` **bloquea el push** si el
   contenido del commit no es exactamente el sellado. Prohibido saltárselo con `--no-verify`.
6. Tras desplegar: misma prueba sobre la web publicada.
7. Contarle a Adil qué se revisó y qué quedó como discutible (si algo).
