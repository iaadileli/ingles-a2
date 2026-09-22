// Valida datos/preguntas.json: formato, roles, duplicados, alternativas y avisos de orden.
// Uso: node preguntas/validar.mjs   (sale con código 1 si hay errores)
import fs from "node:fs";
import { preparar, TEMAS } from "./diagnostico.js";

const ruta = new URL("./datos/preguntas.json", import.meta.url);
const datos = JSON.parse(fs.readFileSync(ruta, "utf8"));
const errores = [], avisos = [];
const niveles = new Set(datos.niveles.map(n => n.n));
const ids = new Map(), frases = new Map();
const multiset = w => [...w.split(" ")].sort().join("\u0001");

let items = [];
for (const raw of datos.preguntas) {
  const donde = `[${raw.id || "sin id"}] ${raw.s}`;
  try {
    if (!raw.id) throw new Error("falta id");
    if (ids.has(raw.id)) throw new Error(`id repetido (también en «${ids.get(raw.id)}»)`);
    ids.set(raw.id, raw.s);
    if (!niveles.has(raw.nivel)) throw new Error(`nivel ${raw.nivel} no existe`);
    if (!raw.tip || !raw.tip.trim()) throw new Error("falta tip");
    if (raw.cefr !== undefined && !["A1", "A2", "B1"].includes(raw.cefr)) throw new Error(`cefr desconocido «${raw.cefr}»`);
    for (const t of raw.tags || []) if (!TEMAS[t]) throw new Error(`tag desconocida «${t}»`);
    const it = preparar(raw);
    if (/[A-Z]/.test(it.w[0]) && !/^I\b/.test(it.w)) avisos.push(`${donde}: empieza en mayúscula; el juego la pone sola`);
    if (/[?.!,]/.test(it.w)) throw new Error("no lleves signos de puntuación en s");
    const uniq = new Set(it.words);
    if (uniq.size < 2) throw new Error("no se puede desordenar (menos de 2 palabras distintas)");
    if (frases.has(it.w)) throw new Error(`frase repetida (también en ${frases.get(it.w)})`);
    frases.set(it.w, raw.id);
    for (const a of it.alt) {
      if (a === it.w) throw new Error(`alt igual a la principal: «${a}»`);
      if (multiset(a) !== multiset(it.w)) throw new Error(`alt con palabras distintas: «${a}»`);
      if (frases.has(a)) throw new Error(`alt repetida (también en ${frases.get(a)}): «${a}»`);
      frases.set(a, raw.id);
    }
    const roles = it.chunks.map(c => c.role);
    const q = roles.findIndex(r => r === "Q" || r === "QS");
    if (q > 0) avisos.push(`${donde}: el interrogativo no es el primer trozo`);
    if (roles.includes("P") && roles[roles.length - 1] !== "P") avisos.push(`${donde}: la preposición no es el último trozo`);
    if (roles.includes("I") && roles[roles.length - 1] !== "I") avisos.push(`${donde}: la parte indirecta no es el último trozo`);
    if (roles.includes("QS") && roles.some(r => ["A", "B", "M"].includes(r))) avisos.push(`${donde}: QS con auxiliar (¿seguro?)`);
    const s = roles.indexOf("S"), op = roles.findIndex(r => ["A", "B", "M"].includes(r));
    if (s >= 0 && op >= 0 && s < op) throw new Error("el sujeto va antes del auxiliar/be/modal en la respuesta correcta");
    if (roles.filter(r => r === "S").length > 1) throw new Error("más de un sujeto");
    if (roles.filter(r => r === "V").length > 1) throw new Error("más de un verbo (usa un solo trozo V con varias palabras)");
    items.push(it);
  } catch (e) { errores.push(`${donde}: ${e.message}`); }
}

const porNivel = {}, porTema = {};
for (const it of items) { porNivel[it.nivel] = (porNivel[it.nivel] || 0) + 1; for (const t of it.tags) porTema[t] = (porTema[t] || 0) + 1; }
console.log(`Preguntas válidas: ${items.length} de ${datos.preguntas.length} (marcadas B1: ${items.filter(i => i.cefr === "B1").length})`);
console.log("Por nivel: " + datos.niveles.map(n => `N${n.n}=${porNivel[n.n] || 0}`).join("  "));
console.log("Por tema:  " + Object.keys(TEMAS).map(t => `${t}=${porTema[t] || 0}`).join("  "));
if (avisos.length) { console.log(`\nAvisos (${avisos.length}):`); avisos.forEach(a => console.log("  ⚠ " + a)); }
if (errores.length) { console.log(`\nErrores (${errores.length}):`); errores.forEach(e => console.log("  ✗ " + e)); process.exit(1); }
console.log("\n✓ Sin errores");
