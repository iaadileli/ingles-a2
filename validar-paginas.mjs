// Validador de las páginas con HUECOS / ERRORES (modales, presente simple, presente continuo…).
// Uso: node validar-paginas.mjs   (revisa todas las carpetas cuyo index.html tenga const HUECOS)
// Comprueba la estructura de los datos; NO sustituye a la revisión gramatical (ver REVISION.md).
import fs from "fs";

const carpetas = fs.readdirSync(".").filter(d => fs.existsSync(`${d}/index.html`) &&
  fs.readFileSync(`${d}/index.html`, "utf8").includes("const HUECOS"));
let fallos = 0;
const mal = (c, m) => { console.log(`✗ ${c}: ${m}`); fallos++; };

for (const c of carpetas) {
  const html = fs.readFileSync(`${c}/index.html`, "utf8");
  const js = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)][0][1].split("/* ============ utilidades")[0];
  const { HUECOS, ERRORES } = new Function(js + "; return {HUECOS, ERRORES};")();
  HUECOS.forEach(h => {
    if ((h.s.match(/___/g) || []).length !== 1) mal(c, `hueco sin un único ___: ${h.s}`);
    if (h.no.length !== 3) mal(c, `no tiene 3 trampas: ${h.s}`);
    if (new Set([h.ok[0], ...h.no]).size !== 4) mal(c, `opciones repetidas: ${h.s}`);
    h.no.forEach(n => { if (h.ok.includes(n)) mal(c, `trampa que también es válida «${n}»: ${h.s}`); });
    if (!h.es || !h.tip) mal(c, `falta es o tip: ${h.s}`);
  });
  ERRORES.forEach(e => {
    if (e.no.length !== 2) mal(c, `no tiene 2 opciones malas: ${e.mal}`);
    if (new Set([e.mal, e.ok, ...e.no]).size !== 4) mal(c, `frases repetidas: ${e.mal}`);
    if (!e.es || !e.tip) mal(c, `falta es o tip: ${e.mal}`);
  });
  const dup = HUECOS.length - new Set(HUECOS.map(h => h.s)).size + ERRORES.length - new Set(ERRORES.map(e => e.mal)).size;
  if (dup) mal(c, `${dup} frases duplicadas`);
  console.log(`${c}: ${HUECOS.length} huecos, ${ERRORES.length} errores`);
}
console.log(fallos ? `\n${fallos} fallos` : "\n✓ Sin errores de estructura");
process.exit(fallos ? 1 : 0);
