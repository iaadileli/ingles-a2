// Motor de «Ordena la pregunta». No toca el DOM: lo usan la web y los tests.
// Formato de una pregunta: s = "ROL:palabras|ROL:palabras…"

export const LABEL = {
  Q: "Interrogativo", QS: "Interrogativo (es el sujeto)", A: "Auxiliar", B: "Verbo be", M: "Modal",
  S: "Sujeto", V: "Verbo", R: "Resto", P: "Preposición", I: "Pregunta indirecta",
};
export const ROLES = Object.keys(LABEL);

// Temas gramaticales. Se deducen de los roles (ver temas()), y una pregunta puede añadir más en "tags".
export const TEMAS = {
  be: "Preguntas con be", do: "do / does / did", modal: "Modales: can, will, would…",
  wh: "Interrogativo de varias palabras", sujeto: "Who / what como sujeto", prep: "Preposición al final",
  perfect: "Present perfect", continuo: "-ing y going to", indirecta: "Preguntas indirectas",
  negativa: "Preguntas negativas", sino: "Sí o no (sin interrogativo)",
};

export const cap = s => s.charAt(0).toUpperCase() + s.slice(1);
export const sentence = w => cap(w) + "?";

// Divide "ROL:palabras|…" en trozos con su rol y su rango de fichas.
export function trocear(s) {
  let pos = 0;
  return s.split("|").map(part => {
    const m = part.match(/^([A-Z]+):(.+)$/);
    if (!m) throw new Error(`Trozo mal formado: «${part}»`);
    const [, role, raw] = m;
    if (!LABEL[role]) throw new Error(`Rol desconocido «${role}» en «${part}»`);
    const text = raw.trim();
    if (!text || /\s{2,}/.test(text)) throw new Error(`Texto vacío o con espacios dobles en «${part}»`);
    const n = text.split(" ").length;
    const c = { role, text, from: pos, to: pos + n };
    pos += n;
    return c;
  });
}

export function temas(chunks, extra = []) {
  const t = new Set(extra);
  const find = r => chunks.find(c => c.role === r);
  const q = chunks.find(c => c.role === "Q" || c.role === "QS");
  const a = find("A"), b = find("B"), m = find("M"), v = find("V");
  if (b) t.add("be");
  if (a) {
    if (/^(do|does|did|don't|doesn't|didn't)$/.test(a.text)) t.add("do");
    if (/^(have|has|had|haven't|hasn't|hadn't)$/.test(a.text)) t.add("perfect");
  }
  if (m) t.add("modal");
  if ([a, b, m].some(c => c && /n't$/.test(c.text))) t.add("negativa");
  if (q && q.text.includes(" ")) t.add("wh");
  if (find("QS")) t.add("sujeto");
  if (find("P")) t.add("prep");
  if (find("I")) t.add("indirecta");
  if (b && v && /ing$/.test(v.text.split(" ")[0])) t.add("continuo");
  if (!q) t.add("sino");
  return [...t];
}

// Convierte la pregunta del JSON en el objeto que usa el juego.
export function preparar(raw) {
  const chunks = trocear(raw.s);
  const w = chunks.map(c => c.text).join(" ");
  return { ...raw, alt: raw.alt || [], chunks, w, words: w.split(" "), tags: temas(chunks, raw.tags) };
}

export function esCorrecta(item, placed) {
  const got = placed.join(" ");
  return got === item.w || item.alt.includes(got);
}

// Devuelve hasta 3 mensajes (HTML) explicando qué ha fallado en el orden dado.
export function diagnose(item, placed) {
  const words = item.words, chunks = item.chunks, used = new Set();
  const ids = placed.map(t => { for (let k = 0; k < words.length; k++) if (words[k] === t && !used.has(k)) { used.add(k); return k; } });
  const hc = ids.map(k => chunks.findIndex(c => k >= c.from && k < c.to));
  const first = ci => hc.indexOf(ci);
  const together = ci => { const ps = []; hc.forEach((c, k) => { if (c === ci) ps.push(k); }); return ps.every((p, j) => j === 0 || (p === ps[j - 1] + 1 && ids[p] > ids[ps[j - 1]])); };
  const T = ci => `<b>«${chunks[ci].text}»</b>`;
  const find = f => chunks.findIndex(f);
  const q = find(c => c.role === "Q" || c.role === "QS"), op = find(c => ["A", "B", "M"].includes(c.role)),
    s = find(c => c.role === "S"), v = find(c => c.role === "V"), p = find(c => c.role === "P"), ind = find(c => c.role === "I");
  const m = []; let inv = false;
  if (q === 0 && hc[0] !== q) m.push(`${T(q)} tiene que ir la primera: en inglés la palabra interrogativa siempre abre la pregunta.`);
  if (q >= 0 && chunks[q].text.includes(" ") && !together(q)) m.push(`Has separado ${T(q)}. Es un bloque: esas palabras van juntas y en ese orden, nunca con otra palabra en medio.`);
  if (q < 0 && op === 0 && hc[0] !== op) m.push(`Es una pregunta de sí o no, así que empieza por ${T(op)}.`);
  if (op >= 0 && s >= 0 && first(s) < first(op)) {
    inv = true;
    const r = chunks[op].role;
    if (r === "B") m.push(`Has puesto el sujeto ${T(s)} antes de ${T(op)}. Eso es el orden de una afirmación. En la pregunta se les da la vuelta: <b>${chunks[op].text} ${chunks[s].text}</b>.`);
    else if (r === "M") m.push(`Has puesto el sujeto ${T(s)} antes de ${T(op)}. Con <i>can, will, would, could</i> se invierte igual que con <i>be</i>: <b>${chunks[op].text} ${chunks[s].text}</b>, y sin añadir <i>do</i>.`);
    else m.push(`Has puesto el sujeto ${T(s)} antes del auxiliar ${T(op)}. En las preguntas va primero el auxiliar y después el sujeto: <b>${chunks[op].text} ${chunks[s].text}</b>.`);
  }
  if (v >= 0 && s >= 0 && first(v) < first(s) && !inv) m.push(`El verbo ${T(v)} va después del sujeto ${T(s)}, no antes. El orden es auxiliar + sujeto + verbo.`);
  else if (v >= 0 && op >= 0 && first(v) < first(op) && !inv) m.push(`${T(op)} va antes que el verbo ${T(v)}.`);
  if (q >= 0 && chunks[q].role === "QS" && hc[0] === q && v >= 0 && first(v) !== chunks[q].text.split(" ").length) m.push(`Aquí ${T(q)} es el sujeto, así que el verbo ${T(v)} va justo detrás, sin auxiliar.`);
  if (p >= 0 && hc[hc.length - 1] !== p) m.push(`La preposición ${T(p)} se queda al final de la pregunta, aunque en español vaya delante (<i>¿con quién…?, ¿de dónde…?</i>).`);
  if (ind >= 0 && !together(ind)) m.push(`${T(ind)} es una pregunta indirecta: va en orden de frase normal (sujeto + verbo), sin darle la vuelta y sin <i>do/does</i>.`);
  chunks.forEach((c, ci) => { if (ci !== q && ci !== ind && c.text.includes(" ") && !together(ci))
    m.push(`${c.role === "S" ? "El sujeto " : c.role === "V" ? "El verbo " : ""}${T(ci)} va junto y en ese orden.`); });
  if (!m.length) { for (let ci = 1; ci < chunks.length; ci++) if (first(ci) < first(ci - 1)) { m.push(`${T(ci)} va después de ${T(ci - 1)}.`); break; } }
  if (!m.length) m.push(`Revisa las palabras marcadas en rojo: están fuera de su sitio.`);
  return m.slice(0, 3);
}
