// ---------------------------------------------------------------------------
// Módulos genéricos (tudo menos o alfabeto, que tem motor próprio).
// Cada item: f = forma grega · a = resposta · n = nota ou exemplo
// Cada tarefa roda 4 lições: Conhecer, Reconhecer, Produzir, Revisar.
// ---------------------------------------------------------------------------

const shuffle = (a) => a.slice().sort(() => Math.random() - 0.5);
const pick = (a, n) => shuffle(a).slice(0, n);

export const MODULES = {
  substantivos: {
    name: "Substantivos",
    glyph: "λόγος",
    desc: "2ª declinação, os quatro casos e os artigos",
    unit: "Unidade II",
    tasks: [
      { name: "Os quatro casos", items: [
        { f: "λόγος", a: "Nominativo singular", n: "sujeito · ὁ λόγος = a palavra" },
        { f: "λόγου", a: "Genitivo singular", n: "posse · τοῦ λόγου = da palavra" },
        { f: "λόγῳ", a: "Dativo singular", n: "objeto indireto · τῷ λόγῳ = à palavra" },
        { f: "λόγον", a: "Acusativo singular", n: "objeto direto · τὸν λόγον = a palavra" },
      ]},
      { name: "O plural", items: [
        { f: "λόγοι", a: "Nominativo plural", n: "οἱ λόγοι = as palavras" },
        { f: "λόγων", a: "Genitivo plural", n: "τῶν λόγων = das palavras" },
        { f: "λόγοις", a: "Dativo plural", n: "τοῖς λόγοις = às palavras" },
        { f: "λόγους", a: "Acusativo plural", n: "τοὺς λόγους = as palavras" },
      ]},
      { name: "Os neutros", items: [
        { f: "βιβλίον", a: "Neutro — nominativo ou acusativo singular", n: "nos neutros as duas formas coincidem" },
        { f: "βιβλίου", a: "Neutro — genitivo singular", n: "τοῦ βιβλίου = do livro" },
        { f: "βιβλίῳ", a: "Neutro — dativo singular", n: "τῷ βιβλίῳ = ao livro" },
        { f: "βιβλία", a: "Neutro — nominativo ou acusativo plural", n: "τὰ βιβλία = os livros" },
        { f: "βιβλίων", a: "Neutro — genitivo plural", n: "τῶν βιβλίων = dos livros" },
        { f: "βιβλίοις", a: "Neutro — dativo plural", n: "τοῖς βιβλίοις = aos livros" },
      ]},
      { name: "Os artigos", items: [
        { f: "ὁ", a: "Artigo — nominativo masc. singular", n: "ὁ λόγος" },
        { f: "τοῦ", a: "Artigo — genitivo masc. singular", n: "τοῦ λόγου" },
        { f: "τῷ", a: "Artigo — dativo masc. singular", n: "τῷ λόγῳ" },
        { f: "τόν", a: "Artigo — acusativo masc. singular", n: "τὸν λόγον" },
        { f: "οἱ", a: "Artigo — nominativo masc. plural", n: "οἱ λόγοι" },
        { f: "τῶν", a: "Artigo — genitivo plural", n: "τῶν λόγων" },
        { f: "τοῖς", a: "Artigo — dativo plural", n: "τοῖς λόγοις" },
        { f: "τούς", a: "Artigo — acusativo masc. plural", n: "τοὺς λόγους" },
      ]},
    ],
  },

  verbos: {
    name: "Verbos",
    glyph: "λύω",
    desc: "presente do indicativo ativo",
    unit: "Complemento",
    tasks: [
      { name: "λύω — solto", items: [
        { f: "λύω", a: "1ª pessoa do singular — solto", n: "desinência -ω" },
        { f: "λύεις", a: "2ª pessoa do singular — soltas", n: "desinência -εις" },
        { f: "λύει", a: "3ª pessoa do singular — solta", n: "desinência -ει" },
        { f: "λύομεν", a: "1ª pessoa do plural — soltamos", n: "desinência -ομεν" },
        { f: "λύετε", a: "2ª pessoa do plural — soltais", n: "desinência -ετε" },
        { f: "λύουσι(ν)", a: "3ª pessoa do plural — soltam", n: "desinência -ουσι(ν)" },
      ]},
      { name: "εἰμί — sou", items: [
        { f: "εἰμί", a: "1ª pessoa do singular — sou", n: "verbo de ligação, irregular" },
        { f: "εἶ", a: "2ª pessoa do singular — és", n: "" },
        { f: "ἐστί(ν)", a: "3ª pessoa do singular — é", n: "Θεὸς ἦν ὁ λόγος" },
        { f: "ἐσμέν", a: "1ª pessoa do plural — somos", n: "" },
        { f: "ἐστέ", a: "2ª pessoa do plural — sois", n: "" },
        { f: "εἰσί(ν)", a: "3ª pessoa do plural — são", n: "" },
      ]},
      { name: "As desinências", items: [
        { f: "-ω", a: "Desinência de 1ª pessoa do singular", n: "λύω, λέγω, βλέπω" },
        { f: "-εις", a: "Desinência de 2ª pessoa do singular", n: "λύεις, λέγεις" },
        { f: "-ει", a: "Desinência de 3ª pessoa do singular", n: "λύει, λέγει" },
        { f: "-ομεν", a: "Desinência de 1ª pessoa do plural", n: "λύομεν, λέγομεν" },
        { f: "-ετε", a: "Desinência de 2ª pessoa do plural", n: "λύετε, λέγετε" },
        { f: "-ουσι(ν)", a: "Desinência de 3ª pessoa do plural", n: "λύουσι(ν), λέγουσι(ν)" },
      ]},
    ],
  },

  preposicoes: {
    name: "Preposições",
    glyph: "ἐν",
    desc: "o caso que cada uma rege",
    unit: "Unidade II",
    tasks: [
      { name: "Genitivo e dativo", items: [
        { f: "ἐν + dativo", a: "em, dentro de", n: "ἐν τῷ κόσμῳ = no mundo · 2713×" },
        { f: "ἐκ / ἐξ + genitivo", a: "de, para fora de", n: "ἐκ τοῦ θεοῦ = de Deus · 915×" },
        { f: "ἀπό + genitivo", a: "de, desde, afastado de", n: "ἀπὸ τοῦ κόσμου = do mundo · 645×" },
        { f: "σύν + dativo", a: "juntamente com", n: "σὺν Χριστῷ = com Cristo" },
        { f: "ἐπί + genitivo", a: "sobre, em cima de", n: "ἐπὶ τῆς γῆς = sobre a terra" },
      ]},
      { name: "Acusativo", items: [
        { f: "εἰς + acusativo", a: "para, para dentro de", n: "εἰς τὸν κόσμον = para o mundo · 1753×" },
        { f: "πρός + acusativo", a: "para, em direção a, junto de", n: "πρὸς τὸν θεόν = junto de Deus · 696×" },
        { f: "διά + acusativo", a: "por causa de", n: "διὰ τὸν λόγον = por causa da palavra" },
        { f: "μετά + acusativo", a: "depois de", n: "μετὰ ταῦτα = depois destas coisas" },
        { f: "ὑπό + acusativo", a: "debaixo de", n: "ὑπὸ νόμον = debaixo da lei" },
      ]},
      { name: "As que mudam de sentido", items: [
        { f: "διά + genitivo", a: "através de, por meio de", n: "διὰ τοῦ λόγου = por meio da palavra" },
        { f: "μετά + genitivo", a: "com", n: "μετὰ τοῦ κυρίου = com o Senhor" },
        { f: "ὑπό + genitivo", a: "por (agente)", n: "ὑπὸ τοῦ θεοῦ = por Deus" },
        { f: "κατά + genitivo", a: "contra, abaixo de", n: "κατὰ τοῦ διαβόλου = contra o diabo" },
        { f: "κατά + acusativo", a: "segundo, conforme", n: "κατὰ τὸν νόμον = segundo a lei" },
        { f: "περί + genitivo", a: "acerca de, a respeito de", n: "περὶ τοῦ λόγου = acerca da palavra" },
        { f: "παρά + dativo", a: "junto de, ao lado de", n: "παρὰ τῷ θεῷ = junto de Deus" },
      ]},
    ],
  },

  vocabulario: {
    name: "Vocabulário",
    glyph: "θεός",
    desc: "as quatro listas das aulas, com ocorrências no NT",
    unit: "Unidades I e II",
    tasks: [
      { name: "Vocabulário 1", items: [
        { f: "θεός", a: "Deus", n: "1314 ocorrências" },
        { f: "κύριος", a: "Senhor", n: "718 ocorrências" },
        { f: "Χριστός", a: "Cristo, ungido", n: "529 ocorrências" },
        { f: "υἱός", a: "filho", n: "375 ocorrências" },
        { f: "λόγος", a: "palavra", n: "331 ocorrências" },
        { f: "νόμος", a: "lei", n: "196 ocorrências" },
        { f: "κόσμος", a: "mundo", n: "185 ocorrências" },
        { f: "δοῦλος", a: "servo, escravo", n: "124 ocorrências" },
        { f: "ψυχή", a: "alma, vida", n: "102 ocorrências" },
        { f: "ἀπόστολος", a: "apóstolo", n: "79 ocorrências" },
        { f: "πρεσβύτερος", a: "ancião", n: "66 ocorrências" },
        { f: "διάβολος", a: "diabo", n: "37 ocorrências" },
      ]},
      { name: "Vocabulário 2", items: [
        { f: "ἄνθρωπος", a: "homem", n: "550 ocorrências" },
        { f: "πνεῦμα", a: "espírito, vento, fôlego", n: "379 ocorrências" },
        { f: "ἀρχή", a: "princípio", n: "ἐν ἀρχῇ = no princípio" },
        { f: "βιβλίον", a: "livro", n: "substantivo neutro" },
        { f: "φῶς", a: "luz", n: "τὸ φῶς τῶν ἀνθρώπων" },
        { f: "ζωή", a: "vida", n: "135 ocorrências" },
        { f: "σῶμα", a: "corpo", n: "142 ocorrências" },
        { f: "διδάσκαλος", a: "professor, mestre", n: "" },
        { f: "διάκονος", a: "diácono, servidor", n: "" },
        { f: "ἀδελφός", a: "irmão", n: "" },
        { f: "λέγει", a: "ele fala, ele diz", n: "3ª pessoa de λέγω" },
        { f: "βλέπει", a: "ele vê", n: "3ª pessoa de βλέπω" },
      ]},
      { name: "Vocabulário 3", items: [
        { f: "οὐρανός", a: "céu", n: "" },
        { f: "γῆ", a: "terra", n: "ἐπὶ τῆς γῆς = sobre a terra" },
        { f: "δόξα", a: "glória", n: "165 ocorrências" },
        { f: "δύναμις", a: "poder", n: "" },
        { f: "ὁδός", a: "caminho", n: "ἐγώ εἰμι ἡ ὁδός" },
        { f: "ἀλήθεια", a: "verdade", n: "" },
        { f: "αἰών", a: "eternidade, século", n: "εἰς τοὺς αἰῶνας" },
        { f: "βασιλεία", a: "reino", n: "162 ocorrências" },
        { f: "θέλημα", a: "vontade", n: "" },
        { f: "ὅτι", a: "que, porque", n: "1235 ocorrências" },
        { f: "μή", a: "não (negação enfática)", n: "nega ordens e usos não indicativos" },
        { f: "εἰ", a: "se (condição)", n: "" },
      ]},
      { name: "Vocabulário 4 — neutros", items: [
        { f: "ἔργον", a: "obra, trabalho", n: "169 ocorrências" },
        { f: "εὐαγγέλιον", a: "evangelho", n: "" },
        { f: "τέκνον", a: "filho, criança", n: "" },
        { f: "παιδίον", a: "criança", n: "" },
        { f: "σημεῖον", a: "sinal", n: "" },
        { f: "πρόβατον", a: "ovelha", n: "" },
        { f: "πρόσωπον", a: "rosto, pessoa", n: "" },
        { f: "ἱερόν", a: "templo", n: "" },
        { f: "σάββατον", a: "sábado", n: "" },
        { f: "δαιμόνιον", a: "demônio", n: "" },
        { f: "μαρτύριον", a: "testemunho, prova", n: "" },
      ]},
      { name: "As 10 mais frequentes", items: [
        { f: "ὁ, ἡ, τό", a: "artigo definido", n: "19.734 ocorrências — a palavra mais comum do NT" },
        { f: "καί", a: "e, também", n: "8.947 ocorrências" },
        { f: "αὐτός", a: "ele, o mesmo", n: "5.534 ocorrências" },
        { f: "δέ", a: "mas, e", n: "2.771 ocorrências" },
        { f: "ἐν", a: "em, dentro de", n: "2.713 ocorrências" },
        { f: "εἰμί", a: "ser, estar", n: "2.450 ocorrências" },
        { f: "ὑμεῖς", a: "vós", n: "1.830 ocorrências" },
        { f: "εἰς", a: "para, para dentro", n: "1.753 ocorrências" },
        { f: "ἐγώ", a: "eu", n: "1.713 ocorrências" },
        { f: "σύ", a: "tu", n: "1.619 ocorrências" },
      ]},
      { name: "Verbos mais frequentes", items: [
        { f: "λέγω", a: "falo, digo", n: "1318 ocorrências" },
        { f: "εἶπον", a: "falei (aoristo)", n: "925 ocorrências" },
        { f: "ἔχω", a: "tenho", n: "708 ocorrências" },
        { f: "γίνομαι", a: "torno-me, venho a ser", n: "667 ocorrências" },
        { f: "ἔρχομαι", a: "venho, vou", n: "631 ocorrências" },
        { f: "ἀκούω", a: "ouço", n: "427 ocorrências" },
        { f: "δίδωμι", a: "dou", n: "416 ocorrências" },
        { f: "πιστεύω", a: "creio", n: "241 ocorrências" },
        { f: "ἀποκρίνομαι", a: "respondo", n: "231 ocorrências" },
        { f: "γινώσκω", a: "conheço", n: "221 ocorrências" },
        { f: "ἀγαπάω", a: "amo", n: "141 ocorrências" },
        { f: "βλέπω", a: "vejo", n: "133 ocorrências" },
      ]},
      { name: "Partículas mais frequentes", items: [
        { f: "οὐ / οὐκ / οὐχ", a: "não", n: "1619× · οὐ antes de consoante, οὐκ antes de vogal, οὐχ antes de aspiração áspera" },
        { f: "οὗτος", a: "este", n: "1388 ocorrências" },
        { f: "πᾶς", a: "todo, cada", n: "1226 ocorrências" },
        { f: "γάρ", a: "porque, pois", n: "1036 ocorrências" },
        { f: "ἀλλά", a: "mas", n: "635 ocorrências" },
        { f: "νῦν", a: "agora", n: "166 ocorrências" },
        { f: "ἄλλος", a: "outro", n: "155 ocorrências" },
      ]},
    ],
  },
};

export const MODULE_LESSONS = [
  { n: "Conhecer",   d: "apresentação item por item" },
  { n: "Reconhecer", d: "forma → significado" },
  { n: "Produzir",   d: "significado → forma" },
  { n: "Revisar",    d: "mistura, com o que já veio antes" },
];

function distract(pool, item, campo, n = 3) {
  const valores = [...new Set(pool.map((x) => x[campo]))].filter((v) => v !== item[campo]);
  return pick(valores, n);
}

export function buildModuleLesson(moduleId, t, l) {
  const mod = MODULES[moduleId];
  const cur = mod.tasks[t].items;
  const anteriores = mod.tasks.slice(0, t + 1).flatMap((x) => x.items);
  const todos = mod.tasks.flatMap((x) => x.items);
  const q = [];

  if (l === 0) return cur.map((it) => ({ k: "gintro", it }));

  if (l === 1)
    cur.forEach((it) =>
      q.push({ k: "mc", ask: "O que significa esta forma?", show: it.f, a: it.a,
        nota: it.n, opts: shuffle([it.a, ...distract(todos, it, "a")]) }));

  if (l === 2)
    cur.forEach((it) =>
      q.push({ k: "mc", ask: "Qual forma corresponde?", txt: it.a, a: it.f,
        nota: it.n, greekOpts: true,
        opts: shuffle([it.f, ...distract(todos, it, "f")]) }));

  if (l === 3) {
    cur.forEach((it) =>
      q.push({ k: "mc", ask: "O que significa esta forma?", show: it.f, a: it.a,
        nota: it.n, opts: shuffle([it.a, ...distract(todos, it, "a")]) }));
    pick(anteriores, Math.min(5, anteriores.length)).forEach((it) =>
      q.push({ k: "mc", ask: "Qual forma corresponde?", txt: it.a, a: it.f,
        nota: it.n, greekOpts: true,
        opts: shuffle([it.f, ...distract(todos, it, "f")]) }));
  }

  return shuffle(q);
}

export const moduleTaskCount = (id) => MODULES[id].tasks.length;
