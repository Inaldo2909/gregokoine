// Fala apenas o nome da letra, em português do Brasil, preferindo voz feminina.

const FEMININAS = [
  "luciana", "joana", "catarina", "fernanda", "francisca",
  "camila", "maria", "helena", "raquel", "ines", "inês", "female",
];
const MASCULINAS = /felipe|joaquim|eddy|reed|rocko|grandpa|male|daniel/i;

let escolhida = null;

function escolher() {
  if (!("speechSynthesis" in window)) return;
  const todas = window.speechSynthesis.getVoices();
  const pt = todas.filter((v) => /^pt/i.test(v.lang));
  const br = pt.filter((v) => /br/i.test(v.lang));
  const pool = br.length ? br : pt;
  escolhida =
    pool.find((v) => FEMININAS.some((f) => v.name.toLowerCase().includes(f))) ||
    pool.find((v) => !MASCULINAS.test(v.name)) ||
    pool[0] ||
    null;
}

if (typeof window !== "undefined" && "speechSynthesis" in window) {
  escolher();
  window.speechSynthesis.onvoiceschanged = escolher;
}

export function temVoz() {
  return "speechSynthesis" in window;
}

export function falar(texto, ligada = true) {
  if (!ligada || !texto || !("speechSynthesis" in window)) return;
  try {
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(texto);
    u.lang = "pt-BR";
    u.rate = 0.9;
    u.pitch = 1.1;
    if (escolhida) u.voice = escolhida;
    window.speechSynthesis.speak(u);
  } catch {
    /* silencioso: áudio é um extra, nunca deve quebrar a lição */
  }
}
