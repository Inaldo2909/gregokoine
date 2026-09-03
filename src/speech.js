// Fala em português do Brasil, preferindo voz feminina e de melhor qualidade.

const FEMININAS = [
  "luciana", "joana", "catarina", "fernanda", "francisca",
  "camila", "maria", "helena", "raquel", "ines", "inês", "female",
];
const MASCULINAS = /felipe|joaquim|eddy|reed|rocko|grandpa|male|daniel/i;
// vozes baixadas pelo usuário soam bem melhor que as compactas do sistema
const BOAS = /enhanced|premium|aprimorad|neural|siri/i;

let escolhida = null;

function escolher() {
  if (!("speechSynthesis" in window)) return;
  const todas = window.speechSynthesis.getVoices();
  const pt = todas.filter((v) => /^pt/i.test(v.lang));
  const br = pt.filter((v) => /br/i.test(v.lang));
  const pool = br.length ? br : pt;

  const nomeOk = (v) => FEMININAS.some((f) => v.name.toLowerCase().includes(f));
  const qualidade = (v) => BOAS.test(v.name) || BOAS.test(v.voiceURI || "");

  escolhida =
    pool.find((v) => nomeOk(v) && qualidade(v)) ||   // feminina e de alta qualidade
    pool.find((v) => qualidade(v)) ||                 // qualquer uma de alta qualidade
    pool.find(nomeOk) ||                              // feminina compacta
    pool.find((v) => !MASCULINAS.test(v.name)) ||
    pool[0] || null;
}

if (typeof window !== "undefined" && "speechSynthesis" in window) {
  escolher();
  window.speechSynthesis.onvoiceschanged = escolher;
}

export function temVoz() { return "speechSynthesis" in window; }
export function vozAtual() { return escolhida ? escolhida.name : null; }

export function falar(texto, ligada = true) {
  if (!ligada || !texto || !("speechSynthesis" in window)) return;
  try {
    const s = window.speechSynthesis;
    // cortar no meio de uma sílaba produz aquele estalo seco; só cancela se preciso
    if (s.speaking || s.pending) s.cancel();

    // uma palavra solta sai truncada e sem entoação; o ponto final dá a curva de queda
    const frase = /[.!?…]$/.test(texto.trim()) ? texto.trim() : texto.trim() + ".";

    const u = new SpeechSynthesisUtterance(frase);
    u.lang = "pt-BR";
    u.rate = 0.82;    // mais devagar, para a voz articular
    u.pitch = 1.0;    // tom natural; acima disso soa metálico
    u.volume = 1;
    if (escolhida) u.voice = escolhida;
    s.speak(u);
  } catch {
    /* áudio é um extra: nunca deve interromper a lição */
  }
}
