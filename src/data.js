// ---------------------------------------------------------------------------
// Conteúdo das sete fichas de Grego Instrumental
// ---------------------------------------------------------------------------

export const A = [
  ["Α","α","Alfa","a",["a"],"“a” aberto, como em casa","ἀγάπη","amor"],
  ["Β","β","Beta","b",["b"],"“b” de bola","βιβλίον","livro"],
  ["Γ","γ","Gama","g",["g"],"“g” gutural de gato","γινώσκω","conheço"],
  ["Δ","δ","Delta","d",["d"],"“d” de dado","δόξα","glória"],
  ["Ε","ε","Épsilon","e",["e"],"“e” breve e fechado","ἐκκλησία","igreja"],
  ["Ζ","ζ","Dzeta","z",["z","dz"],"“dz”","ζωή","vida"],
  ["Η","η","Eta","ē",["e","ē"],"“e” longo e aberto","ἡμέρα","dia"],
  ["Θ","θ","Theta","th",["th"],"“t” aspirado","θεός","Deus"],
  ["Ι","ι","Iota","i",["i"],"“i” de vida","Ἰησοῦς","Jesus"],
  ["Κ","κ","Kapa","k",["k","c"],"“k” de casa","κόσμος","mundo"],
  ["Λ","λ","Lambda","l",["l"],"“l” de lua","λόγος","palavra"],
  ["Μ","μ","My","m",["m"],"“m” de mão","μαθητής","discípulo"],
  ["Ν","ν","Ny","n",["n"],"“n” de nada","νόμος","lei"],
  ["Ξ","ξ","Ksi","x",["x","ks"],"“ks”, dupla κ+σ","ξύλον","madeira"],
  ["Ο","ο","Ómicron","o",["o"],"“o” breve e fechado","ὁδός","caminho"],
  ["Π","π","Pi","p",["p"],"“p” de pão","πνεῦμα","espírito"],
  ["Ρ","ρ","Rho","r",["r","rh"],"“r” vibrante; inicial leva aspiração","ῥῆμα","palavra dita"],
  ["Σ","σ","Sigma","s",["s"],"“s” de saber; ς só no fim da palavra","σωτήρ","salvador"],
  ["Τ","τ","Tau","t",["t"],"“t” de tudo","τέκνον","filho, criança"],
  ["Υ","υ","Ypsilon","y",["y","u"],"“u” francês","υἱός","filho"],
  ["Φ","φ","Phi","ph",["ph","f"],"“p” aspirado, como f","φωνή","voz"],
  ["Χ","χ","Chi","ch",["ch","kh"],"“k” aspirado, gutural","Χριστός","Cristo"],
  ["Ψ","ψ","Psi","ps",["ps"],"“ps”, dupla π+σ","ψυχή","alma"],
  ["Ω","ω","Omega","ō",["o","ō"],"“o” longo e aberto","ὥρα","hora"],
].map(([u, l, n, t, alt, som, ex, exT], i) => ({ i, u, l, n, t, alt, som, ex, exT }));

// Grafia fonética enviada ao sintetizador de voz em português
const SPK = {
  My: "Mi", Ny: "Ni", Phi: "Fi", Chi: "Qui", Rho: "Rô",
  Theta: "Têta", Ypsilon: "Ípsilon", Beta: "Bêta", Eta: "Êta",
  // /ks/, /ps/ e /dz/ não existem em início de sílaba no português: sem uma
  // vogal de apoio o sintetizador desiste e soletra ("C-S-I").
  Ksi: "Quissi", Psi: "Pissi", Dzeta: "Dizeta",
};
export const spoken = (L) => SPK[L.n] || L.n;

// Grafias alternativas aceitas ao escrever o nome da letra
export const NAMEALT = {
  "Alfa": ["alfa", "alpha"], "Beta": ["beta"], "Gama": ["gama", "gamma"],
  "Delta": ["delta"], "Épsilon": ["epsilon"], "Dzeta": ["dzeta", "zeta"],
  "Eta": ["eta"], "Theta": ["theta", "teta"], "Iota": ["iota"],
  "Kapa": ["kapa", "kappa"], "Lambda": ["lambda", "lamda"], "My": ["my", "mi", "mu"],
  "Ny": ["ny", "ni", "nu"], "Ksi": ["ksi", "csi", "xi"], "Ómicron": ["omicron"],
  "Pi": ["pi"], "Rho": ["rho", "ro"], "Sigma": ["sigma"], "Tau": ["tau"],
  "Ypsilon": ["ypsilon", "upsilon", "ipsilon"], "Phi": ["phi", "fi"],
  "Chi": ["chi", "qui", "khi"], "Psi": ["psi"], "Omega": ["omega"],
};

export const norm = (s) =>
  s.toLowerCase().trim().normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z]/g, "");

export const DIPS = [
  ["αι","ai"],["ει","ei"],["οι","oi"],["υι","ui"],
  ["αυ","au"],["ευ","eu"],["ηυ","ēu"],["ου","u"],
];

export const PREPS = [
  ["ἐν","Dativo","em, dentro de",2713,"ἐν τῷ κόσμῳ = no mundo"],
  ["ἐκ / ἐξ","Genitivo","de, para fora de",915,"ἐκ τοῦ θεοῦ = de Deus"],
  ["ἀπό","Genitivo","de, desde",645,"ἀπὸ τοῦ κόσμου = do mundo"],
  ["διά","Genitivo","por meio de",666,"διὰ τοῦ λόγου = por meio da palavra"],
  ["διά","Acusativo","por causa de",666,"διὰ τὸν λόγον = por causa da palavra"],
  ["εἰς","Acusativo","para dentro de",1753,"εἰς τὸν κόσμον = para o mundo"],
  ["πρός","Acusativo","junto de, em direção a",696,"πρὸς τὸν θεόν = junto de Deus"],
  ["μετά","Genitivo","com",1226,"μετὰ τοῦ κυρίου = com o Senhor"],
  ["μετά","Acusativo","depois de",1226,"μετὰ ταῦτα = depois destas coisas"],
  ["ὑπέρ","Genitivo","em favor de",null,"ὑπὲρ ἡμῶν = por nós"],
  ["ὑπό","Genitivo","por (agente)",217,"ὑπὸ τοῦ θεοῦ = por Deus"],
  ["ὑπό","Acusativo","debaixo de",217,"ὑπὸ νόμον = debaixo da lei"],
  ["κατά","Genitivo","contra",471,"κατὰ τοῦ διαβόλου = contra o diabo"],
  ["κατά","Acusativo","segundo, conforme",471,"κατὰ τὸν νόμον = segundo a lei"],
  ["περί","Genitivo","acerca de",null,"περὶ τοῦ λόγου = acerca da palavra"],
  ["παρά","Dativo","junto de",null,"παρὰ τῷ θεῷ = junto de Deus"],
  ["σύν","Dativo","juntamente com",null,"σὺν Χριστῷ = com Cristo"],
  ["ἐπί","Genitivo","sobre",null,"ἐπὶ τῆς γῆς = sobre a terra"],
];

export const VOCAB = [
  ["ὁ, ἡ, τό","artigo definido",19734,"n"],["καί","e, também",8947,"n"],
  ["αὐτός","ele, o mesmo",5534,"n"],["δέ","mas, e",2771,"n"],
  ["ἐν","em, dentro de",2713,"n"],["εἰμί","ser, estar",2450,"n"],
  ["ὑμεῖς","vós",1830,"n"],["εἰς","para, para dentro",1753,"n"],
  ["ἐγώ","eu",1713,"n"],["σύ","tu",1619,"n"],
  ["θεός","Deus",1314,"d"],["κύριος","Senhor",718,"d"],
  ["Χριστός","Cristo",529,"d"],["πατήρ","pai",415,"d"],
  ["πνεῦμα","espírito",379,"d"],["ἄγγελος","mensageiro, anjo",175,"d"],
  ["οὐ / οὐκ / οὐχ","não",1619,"p"],["οὗτος","este",1388,"p"],
  ["ὅτι","que, porque",1235,"p"],["πᾶς","todo, cada",1226,"p"],
  ["γάρ","porque",1036,"p"],["ἀλλά","mas",635,"p"],
  ["νῦν","agora",166,"p"],["ἄλλος","outro",155,"p"],
  ["ἄνθρωπος","homem",550,"c"],["ἡμέρα","dia",388,"c"],
  ["λόγος","palavra",331,"c"],["μαθητής","discípulo",262,"c"],
  ["κόσμος","mundo",185,"c"],["ἁμαρτία","pecado",173,"c"],
  ["ἔργον","obra",169,"c"],["δόξα","glória",165,"c"],
  ["βασιλεία","reino",162,"c"],["καρδία","coração",156,"c"],
  ["ἐκκλησία","igreja",144,"c"],["φωνή","voz",137,"c"],
  ["ζωή","vida",135,"c"],["ἀγάπη","amor",116,"c"],["ὥρα","hora",106,"c"],
  ["λέγω","falo",1318,"v"],["ἔχω","tenho",708,"v"],["γίνομαι","torno-me",667,"v"],
  ["ἔρχομαι","venho",631,"v"],["ἀκούω","ouço",427,"v"],["δίδωμι","dou",416,"v"],
  ["πιστεύω","creio",241,"v"],["ἀποκρίνομαι","respondo",231,"v"],
  ["γινώσκω","conheço",221,"v"],["ἀγαπάω","amo",141,"v"],["βλέπω","vejo",133,"v"],
];

// ---------------------------------------------------------------------------
// Trilha: 8 tarefas de 3 letras, 5 lições por tarefa
// ---------------------------------------------------------------------------

export const TASKS = Array.from({ length: 8 }, (_, t) => ({
  i: t,
  letters: A.slice(t * 3, t * 3 + 3),
}));

export const LESSONS = [
  { n: "Conhecer",   d: "as três letras, com som" },
  { n: "Reconhecer", d: "letra → nome" },
  { n: "Nomear",     d: "letra → latim e nome escrito" },
  { n: "Ouvir",      d: "escute e identifique" },
  { n: "Revisar",    d: "tudo o que você já viu" },
];

const shuffle = (a) => a.slice().sort(() => Math.random() - 0.5);
const pick = (a, n) => shuffle(a).slice(0, n);

function distractors(pool, x, f, n = 3) {
  return pick(pool.filter((y) => f(y) !== f(x)), n).map(f);
}

export function buildLesson(t, l) {
  const cur = TASKS[t].letters;
  const seen = A.slice(0, t * 3 + 3);
  const other = A.filter((x) => !cur.includes(x));
  const q = [];

  if (l === 0) cur.forEach((L) => q.push({ k: "intro", L }));

  if (l === 1)
    shuffle([...cur, ...cur]).forEach((L) =>
      q.push({ k: "mc", L, ask: "Qual é o nome desta letra?", show: L.l, a: L.n,
        opts: shuffle([L.n, ...distractors(A, L, (x) => x.n)]) }));

  if (l === 2) {
    cur.forEach((L) =>
      q.push({ k: "mc", L, ask: "Como se translitera?", show: L.l, a: L.t,
        opts: shuffle([L.t, ...distractors(A, L, (x) => x.t)]) }));
    cur.forEach((L) =>
      q.push({ k: "type", L, ask: "Escreva o nome desta letra", show: L.l, a: L.n }));
  }

  if (l === 3)
    shuffle([...cur, ...cur]).forEach((L) =>
      q.push({ k: "hear", L, ask: "Qual letra você ouviu?", a: L.l,
        opts: shuffle([L.l, ...distractors(A, L, (x) => x.l)]) }));

  if (l === 4) {
    cur.forEach((L) =>
      q.push({ k: "mc", L, ask: "Qual é o nome desta letra?", show: L.l, a: L.n,
        opts: shuffle([L.n, ...distractors(A, L, (x) => x.n)]) }));
    cur.forEach((L) =>
      q.push({ k: "type", L, ask: "Escreva o nome desta letra", show: L.l, a: L.n }));
    pick(seen, Math.min(3, seen.length)).forEach((L) =>
      q.push({ k: "hear", L, ask: "Qual letra você ouviu?", a: L.l,
        opts: shuffle([L.l, ...distractors(A, L, (x) => x.l)]) }));
    pick(seen, Math.min(2, seen.length)).forEach((L) =>
      q.push({ k: "word", L, ask: "Qual palavra do NT usa esta letra?", show: L.l,
        a: `${L.ex} — ${L.exT}`,
        opts: shuffle([`${L.ex} — ${L.exT}`,
          ...distractors(other, L, (x) => `${x.ex} — ${x.exT}`)]) }));
  }

  return l === 0 ? q : shuffle(q);
}

// ---------------------------------------------------------------------------
// Revisão geral: rodada avulsa, repetível, com tudo o que o aluno já viu.
// O sorteio é ponderado pelo histórico de erros — quem erra mais, aparece mais.
// ---------------------------------------------------------------------------

export function seenLetters(done) {
  let last = -1;
  for (let t = 0; t < 8; t++)
    for (let l = 0; l < 5; l++) if (done[`${t}-${l}`]) last = Math.max(last, t);
  return last < 0 ? [] : A.slice(0, (last + 1) * 3);
}

function weightedPick(pool, stats, n) {
  const bag = [];
  pool.forEach((L) => {
    const st = stats[L.i] || { seen: 0, wrong: 0 };
    // peso base 1, mais 2 por erro acumulado, teto em 7 para não virar obsessão
    const w = Math.min(7, 1 + st.wrong * 2);
    for (let k = 0; k < w; k++) bag.push(L);
  });
  const out = [];
  const usadas = new Map();
  let guard = 0;
  while (out.length < n && guard++ < n * 40) {
    const L = bag[Math.floor(Math.random() * bag.length)];
    const c = usadas.get(L.i) || 0;
    if (c >= 3) continue;            // nenhuma letra domina a rodada
    usadas.set(L.i, c + 1);
    out.push(L);
  }
  return out;
}

export function buildReview(pool, stats = {}, n = 12, itens = []) {
  if (!pool.length && !itens.length) return [];
  const fatia = itens.length ? Math.ceil(n / 2) : n;
  const letras = pool.length ? weightedPick(pool, stats, Math.min(fatia, pool.length * 3)) : [];
  const outras = (L) => A.filter((x) => x.i !== L.i);
  const tipos = ["nome", "translit", "ouvir", "escrever"];

  // palavras dos módulos já estudados entram na mesma rodada
  const pesoItem = (it) => {
    const st = stats["M:" + it.f] || { wrong: 0 };
    return Math.min(7, 1 + st.wrong * 2);
  };
  const sacola = [];
  itens.forEach((it) => { for (let k = 0; k < pesoItem(it); k++) sacola.push(it); });
  const escolhidos = [];
  const usados = new Set();
  let guarda = 0;
  while (escolhidos.length < n - letras.length && sacola.length && guarda++ < n * 40) {
    const it = sacola[Math.floor(Math.random() * sacola.length)];
    if (usados.has(it.f)) continue;
    usados.add(it.f);
    escolhidos.push(it);
  }
  const doVocab = escolhidos.map((it) => ({
    k: "mc", it, ask: "O que significa esta palavra?", show: it.f, a: it.a, nota: it.n,
    opts: shuffle([it.a, ...pick(itens.filter((x) => x.a !== it.a), 3).map((x) => x.a)]),
  }));

  const daLetra = letras.map((L, k) => {
    const tipo = tipos[k % tipos.length];
    if (tipo === "nome")
      return { k: "mc", L, ask: "Qual é o nome desta letra?", show: L.l, a: L.n,
        opts: shuffle([L.n, ...distractors(outras(L), L, (x) => x.n)]) };
    if (tipo === "translit")
      return { k: "mc", L, ask: "Como se translitera?", show: L.l, a: L.t,
        opts: shuffle([L.t, ...distractors(outras(L), L, (x) => x.t)]) };
    if (tipo === "ouvir")
      return { k: "hear", L, ask: "Qual letra você ouviu?", a: L.l,
        opts: shuffle([L.l, ...distractors(outras(L), L, (x) => x.l)]) };
    return { k: "type", L, ask: "Escreva o nome desta letra", show: L.l, a: L.n };
  });

  return [...daLetra, ...doVocab].sort(() => Math.random() - 0.5);
}

// ---------------------------------------------------------------------------
// Decifrar: palavras em português escritas com letras gregas.
// Exercício usado em aula (Unidade I, "Treinamento") — força a leitura do
// alfabeto sem depender de saber grego.
// ---------------------------------------------------------------------------

export const PTWORDS = [
  // formadas só com as letras das primeiras tarefas (α…μ)
  ["καμα","cama"], ["μαλα","mala"], ["βαλα","bala"], ["λαμα","lama"],
  ["καλμα","calma"], ["δια","dia"], ["μελ","mel"], ["μεδιδα","medida"],
  ["καμαδα","camada"], ["καβιδε","cabide"], ["γεμα","gema"], ["λιμα","lima"],
  ["βελα","vela"], ["ιδεια","ideia"], ["αλδεια","aldeia"], ["μαγια","magia"],
  ["βαλε","vale"], ["καλδα","calda"],
  // a partir da tarefa 5, com ν ξ ο
  ["μοδα","moda"], ["βολα","bola"], ["γολο","golo"], ["λιμαο","limão"],
  ["μενινα","menina"], ["κανela",""], ["ανel",""], ["μολδε","molde"],
  ["δομινο","dominó"], ["μοεδα","moeda"], ["κανοa",""], ["βαγον","vagão"],
  // tarefas 6 a 8, com π ρ σ τ υ φ χ ψ ω
  ["πατο","pato"], ["γατο","gato"], ["δαδο","dado"], ["μεσα","mesa"],
  ["κασα","casa"], ["ροσα","rosa"], ["δεδο","dedo"], ["μοτο","moto"],
  ["φοτο","foto"], ["σοπα","sopa"], ["ρατο","rato"], ["σολ","sol"],
  ["μαρ","mar"], ["παπελ","papel"], ["τοματε","tomate"], ["σινεμα","cinema"],
  ["τελεφονε","telefone"], ["σαπατο","sapato"], ["ελεφαντε","elefante"],
  ["λιβρο","livro"], ["βασο","vaso"], ["πεντε","pente"], ["ναριζ","nariz"],
  ["σινο","sino"], ["μαπα","mapa"], ["πιανο","piano"], ["καφε","café"],
  ["πιποκα","pipoca"], ["καμισα","camisa"], ["ταπετε","tapete"],
  ["φακα","faca"], ["βαρκο","barco"], ["πορτα","porta"], ["κανετα","caneta"],
  ["εσκολα","escola"], ["σαλα","sala"], ["μουσικα","música"],
  ["παλαβρα","palavra"], ["βανανα","banana"],
].filter(([, pt]) => pt);

// índice de cada letra grega em A, para saber quais letras uma palavra exige
const IDX = {};
A.forEach((L) => { IDX[L.l] = L.i; });
IDX["ς"] = 17;  // sigma final

export function wordLetters(grego) {
  return [...new Set([...grego].map((c) => IDX[c]).filter((x) => x !== undefined))];
}

// só entram palavras cujas letras o aluno já viu na trilha
export function decodable(pool) {
  const vistos = new Set(pool.map((L) => L.i));
  return PTWORDS.filter(([g]) => wordLetters(g).every((i) => vistos.has(i)));
}

export function buildDecode(pool, n = 10) {
  const disponiveis = decodable(pool);
  return shuffle(disponiveis).slice(0, n).map(([g, pt]) => ({
    k: "dec", show: g, a: pt, ask: "Que palavra está escrita aqui?",
  }));
}
