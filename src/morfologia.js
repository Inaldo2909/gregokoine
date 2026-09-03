// Decodifica os códigos do MorphGNT e translitera o grego para o alfabeto latino.

const CLASSE = {
  "N-": "substantivo", "A-": "adjetivo", "RA": "artigo definido",
  "RD": "pronome demonstrativo", "RI": "pronome interrogativo ou indefinido",
  "RP": "pronome pessoal", "RR": "pronome relativo", "C-": "conjunção",
  "D-": "advérbio", "I-": "interjeição", "P-": "preposição", "V-": "verbo",
  "X-": "partícula",
};
const PESSOA = { 1: "1ª pessoa", 2: "2ª pessoa", 3: "3ª pessoa" };
const TEMPO  = { P: "presente", I: "imperfeito", F: "futuro", A: "aoristo",
                 X: "perfeito", Y: "mais-que-perfeito" };
const VOZ    = { A: "voz ativa", M: "voz média", P: "voz passiva" };
const MODO   = { I: "indicativo", D: "imperativo", S: "subjuntivo",
                 O: "optativo", N: "infinitivo", P: "particípio" };
const CASO   = { N: "nominativo", G: "genitivo", D: "dativo", A: "acusativo" };
const NUMERO = { S: "singular", P: "plural" };
const GENERO = { M: "masculino", F: "feminino", N: "neutro" };
const GRAU   = { C: "comparativo", S: "superlativo" };

// código = 2 caracteres de classe + 8 de análise
export function analisar(codigo) {
  const cls = codigo.slice(0, 2);
  const p = codigo.slice(2);
  const partes = [CLASSE[cls] || cls];
  const add = (mapa, i) => { const v = mapa[p[i]]; if (v) partes.push(v); };
  add(PESSOA, 0); add(TEMPO, 1); add(VOZ, 2); add(MODO, 3);
  add(CASO, 4); add(NUMERO, 5); add(GENERO, 6); add(GRAU, 7);
  return partes;
}

// --- transliteração ---------------------------------------------------------
const SIMPLES = {
  α:"a", β:"b", γ:"g", δ:"d", ε:"e", ζ:"z", η:"ē", θ:"th", ι:"i", κ:"k",
  λ:"l", μ:"m", ν:"n", ξ:"x", ο:"o", π:"p", ρ:"r", σ:"s", ς:"s", τ:"t",
  υ:"y", φ:"ph", χ:"ch", ψ:"ps", ω:"ō",
};
const DITONGOS = { αι:"ai", ει:"ei", οι:"oi", υι:"yi", αυ:"au", ευ:"eu", ηυ:"ēu", ου:"ou" };
const VOGAIS = "αεηιουω";

export function translit(palavra) {
  // separa os diacríticos para detectar a aspiração áspera
  const d = palavra.normalize("NFD");
  let aspera = false;
  let base = "";
  for (const ch of d) {
    if (ch === "\u0314") { aspera = true; continue; }   // espírito rude
    if (ch >= "\u0300" && ch <= "\u036f") continue;      // demais acentos
    base += ch;
  }
  base = base.toLowerCase();

  let out = "";
  for (let i = 0; i < base.length; i++) {
    const par = base.slice(i, i + 2);
    if (DITONGOS[par]) { out += DITONGOS[par]; i++; continue; }
    const c = base[i];
    if (c === "γ" && "γκχξ".includes(base[i + 1] || "")) { out += "n"; continue; }
    out += SIMPLES[c] ?? c;
  }

  if (aspera) out = base[0] === "ρ" ? "rh" + out.slice(1) : "h" + out;
  return out;
}
