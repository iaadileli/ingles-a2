import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { preparar, diagnose, esCorrecta, trocear, temas } from "../diagnostico.js";

const datos = JSON.parse(fs.readFileSync(new URL("../datos/preguntas.json", import.meta.url), "utf8"));
const ITEMS = datos.preguntas.map(preparar);
const porFrase = w => { const it = ITEMS.find(i => i.w === w); assert.ok(it, `no existe la pregunta «${w}»`); return it; };
const limpio = html => html.replace(/<[^>]+>/g, "");
const mensajes = (correcta, respuesta) => diagnose(porFrase(correcta), respuesta.split(" ")).map(limpio);
const alguno = (ms, re) => assert.ok(ms.some(m => re.test(m)), `ningún mensaje cumple ${re}:\n  ${ms.join("\n  ")}`);

test("bloque separado + verbo antes del sujeto", () => {
  const ms = mensajes("what time does their flight arrive", "what does time arrive their flight");
  alguno(ms, /Has separado «what time»/);
  alguno(ms, /El verbo «arrive» va después del sujeto «their flight»/);
});
test("bloque separado (how often)", () => {
  alguno(mensajes("how often does he phone you", "how does often he phone you"), /Has separado «how often»/);
});
test("inversión con modal", () => {
  alguno(mensajes("how many languages can you speak", "how many languages you can speak"), /antes de «can».*can you/);
});
test("inversión con be", () => {
  alguno(mensajes("is your girlfriend from Brazil", "your girlfriend is from Brazil"), /antes de «is».*is your girlfriend/);
});
test("interrogativo no va primero + preposición final", () => {
  const ms = mensajes("who are you talking to", "to who are you talking");
  alguno(ms, /«who» tiene que ir la primera/);
  alguno(ms, /La preposición «to» se queda al final/);
});
test("pregunta indirecta", () => {
  alguno(mensajes("could you tell me where the station is", "could you tell me where is the station"), /pregunta indirecta/);
});
test("interrogativo sujeto: no lleva auxiliar y el verbo va detrás", () => {
  alguno(mensajes("who lives in that house", "who in that house lives"), /«who» es el sujeto.*«lives» va justo detrás/);
});
test("nunca más de 3 mensajes y siempre al menos 1", () => {
  for (const it of ITEMS) {
    const rev = [...it.words].reverse();
    if (rev.join(" ") === it.w) continue;
    const ms = diagnose(it, rev);
    assert.ok(ms.length >= 1 && ms.length <= 3, it.id);
  }
});
test("esCorrecta acepta la principal y las alternativas", () => {
  const it = porFrase("where were you at ten o'clock last night");
  assert.equal(esCorrecta(it, it.words), true);
  assert.equal(esCorrecta(it, "where were you last night at ten o'clock".split(" ")), true);
  assert.equal(esCorrecta(it, "were where you at ten o'clock last night".split(" ")), false);
});
test("trocear rechaza roles desconocidos y trozos vacíos", () => {
  assert.throws(() => trocear("X:what|A:do"), /Rol desconocido/);
  assert.throws(() => trocear("Q:|A:do"), /mal formado|vacío/);
});
test("temas se deducen de los roles", () => {
  assert.deepEqual(temas(trocear("Q:who|B:are|S:you|V:talking|P:to")).sort(), ["be", "continuo", "prep"]);
  assert.deepEqual(temas(trocear("A:didn't|S:you|V:come")).sort(), ["do", "negativa", "sino"]);
  assert.deepEqual(temas(trocear("QS:how many people|V:came|R:to your party")).sort(), ["sujeto", "wh"]);
});
