// Pronúncia figurada: reescreve a palavra grega na ortografia do português,
// seguindo a pronúncia do grego clássico adotada nas fichas.
// O texto gerado é o que vai para a voz em pt-BR — e aparece na tela, para o
// aluno julgar por si o que está ouvindo.

const DITONGOS = {
  αι: "ai", ει: "ei", οι: "oi", υι: "ui",
  αυ: "au", ευ: "eu", ηυ: "eu", ου: "u",
};
const TONICA = { a: "á", e: "é", i: "í", o: "ó", u: "ú", ê: "é", ô: "ó" };
const VOGAIS = "αεηιουω";
const PALATAL = "ειη";              // diante destas, γ vira "gu" e κ/χ viram "qu"

export function pronuncia(palavra) {
  const d = palavra.normalize("NFD");
  let aspera = false, base = "", acentoEm = -1;

  for (const ch of d) {
    if (ch === "\u0314") { aspera = true; continue; }
    if (ch === "\u0301" || ch === "\u0300" || ch === "\u0342") { acentoEm = base.length - 1; continue; }
    if (ch >= "\u0300" && ch <= "\u036f") continue;
    base += ch;
  }
  base = base.toLowerCase();

  const vogal = (c) => c !== "" && VOGAIS.includes(c);
  let out = "", idxTonica = -1;

  for (let i = 0; i < base.length; i++) {
    const c = base[i], prox = base[i + 1] || "", ant = base[i - 1] || "";
    const inicio = i === 0;
    const par = c + prox;
    const ehDitongo = !!DITONGOS[par];
    const marcar = i === acentoEm || (ehDitongo && i + 1 === acentoEm);

    let peca;
    if (ehDitongo) { peca = DITONGOS[par]; i++; }
    else switch (c) {
      case "α": peca = "a"; break;
      case "β": peca = "b"; break;
      case "γ": peca = "γκχξ".includes(prox) ? "n" : (PALATAL.includes(prox) ? "gu" : "g"); break;
      case "δ": peca = "d"; break;
      case "ε": peca = "e"; break;
      case "ζ": peca = inicio ? "z" : "dz"; break;
      case "η": peca = "ê"; break;
      case "θ": peca = "t"; break;
      case "ι": peca = "i"; break;
      case "κ": peca = PALATAL.includes(prox) ? "qu" : "c"; break;
      case "λ": peca = "l"; break;
      case "μ": peca = "m"; break;
      case "ν": peca = "n"; break;
      case "ξ": peca = "cs"; break;
      case "ο": peca = "o"; break;
      case "π": peca = "p"; break;
      case "ρ": peca = inicio ? "rr" : "r"; break;
      case "σ": case "ς": peca = (vogal(ant) && vogal(prox)) ? "ss" : "s"; break;
      case "τ": peca = "t"; break;
      case "υ": peca = "u"; break;
      case "φ": peca = "f"; break;
      case "χ": peca = PALATAL.includes(prox) ? "qu" : "c"; break;
      case "ψ": peca = "ps"; break;
      case "ω": peca = "ô"; break;
      default: peca = "";
    }

    if (marcar && idxTonica < 0) idxTonica = out.length;
    out += peca;
  }

  // o acento entra antes de qualquer simplificação, senão a posição se desloca
  if (idxTonica >= 0) {
    for (let k = idxTonica; k < out.length; k++) {
      if (TONICA[out[k]]) { out = out.slice(0, k) + TONICA[out[k]] + out.slice(k + 1); break; }
    }
  }

  // consoantes geminadas não existem na ortografia do português (salvo "ss" e "rr")
  out = out.replace(/([cptlmngbdf])\1/g, "$1");

  if (aspera && !out.startsWith("rr")) out = "r" + out;
  return out;
}
