// ---------------------------------------------------------------------------
// Revisão para a prova — João 1:1-10, conforme a análise do professor
// (input/resumo.pdf). Cada palavra carrega a análise dada no documento; os
// exercícios saem dela, somados às perguntas de regra escritas à mão (MANUAIS).
//
// Palavra:  f = forma · cl = classe · lema · an = análise · c = caso (N G D A)
//           fn = função na oração · gl = tradução ali · t / pn = tempo e pessoa
//           rege = caso pedido pela preposição · nota = explicação do professor
// ---------------------------------------------------------------------------

function shuffle(a) {
  const b = a.slice();
  for (let i = b.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [b[i], b[j]] = [b[j], b[i]];
  }
  return b;
}
const pick = (a, n) => shuffle(a).slice(0, n);
const um = (a) => a[Math.floor(Math.random() * a.length)];

const C = { N: "nominativo", G: "genitivo", D: "dativo", A: "acusativo" };
const cap = (s) => s[0].toUpperCase() + s.slice(1);
const CASOS4 = ["Nominativo", "Genitivo", "Dativo", "Acusativo"];
const DICA_CASO = {
  N: "o caso do sujeito",
  G: "o caso da posse — o “de”",
  D: "o caso do objeto indireto; no singular costuma trazer iota subscrito",
  A: "o caso do objeto direto",
};

const SUJ = "Sujeito", PRED = "Predicativo do sujeito", OD = "Objeto direto",
      OP = "Complemento da preposição", POSSE = "Genitivo de posse",
      DPOSSE = "Dativo de posse";
const FUNCOES = [SUJ, PRED, OD, OP, POSSE, DPOSSE, "Objeto indireto"];

const IMPF = "Imperfeito do indicativo ativo", AOR = "Aoristo do indicativo ativo",
      AOR2 = "2º aoristo do indicativo", PRES = "Presente do indicativo ativo",
      PERF = "Perfeito do indicativo ativo", AORS = "Aoristo do subjuntivo ativo";
const TEMPOS = [IMPF, AOR, PRES, PERF, AORS, "Futuro do indicativo ativo"];
const P3S = "3ª pessoa do singular", P3P = "3ª pessoa do plural";
const PESSOAS = [P3S, P3P, "1ª pessoa do singular", "2ª pessoa do singular"];

// --- construtores de palavra ------------------------------------------------
const art = (f, genero, c, num, fn) => ({
  f, cl: "art", lema: "ὁ", c, fn,
  an: `Artigo definido${genero ? " " + genero : ""} — ${C[c]} ${num}`,
});
const sub = (f, lema, desc, c, num, gl, extra = {}) => ({
  f, cl: "subst", lema, c, gl, an: `Substantivo ${desc} — ${C[c]} ${num}`, ...extra,
});
const pron = (f, lema, tipo, c, num, gl, extra = {}) => ({
  f, cl: "pron", lema, c, gl, an: `Pronome ${tipo} — ${C[c]} ${num}`, ...extra,
});
const prep = (f, lema, rege, gl, extra = {}) => ({
  f, cl: "prep", lema, rege, gl, an: `Preposição que pede ${C[rege]}`, ...extra,
});
const vb = (f, lema, t, pn, gl, extra = {}) => ({
  f, cl: "verbo", lema, t, pn, gl,
  an: `Verbo ${extra.dep ? "depoente " : ""}${lema} — ${t.toLowerCase()}, ${pn}`, ...extra,
});

// --- palavras que se repetem ------------------------------------------------
const M2 = "masculino da 2ª declinação", F1 = "feminino da 1ª declinação",
      N3 = "neutro da 3ª declinação";

const KAI = () => ({ f: "καὶ", cl: "conj", lema: "καί", gl: "e", an: "Conjunção aditiva" });
const INA = () => ({ f: "ἵνα", cl: "conj", lema: "ἵνα", gl: "para que", an: "Conjunção final",
  nota: "ἵνα introduz oração subordinada final (de finalidade)." });
const OUK = (f) => ({ f, cl: "adv", lema: "οὐ", gl: "não", an: "Advérbio de negação" });
const EN = (f = "ἐν") => prep(f, "ἐν", "D", "em, dentro de");
const PROS = () => prep("πρὸς", "πρός", "A", "junto de, em direção a, com");
const DIA = () => prep("δι᾽", "διά", "G", "por meio de, através de",
  { nota: "δι᾽ é διά com elisão da vogal final." });
const EIS = () => prep("εἰς", "εἰς", "A", "para");
const PERI = () => prep("περὶ", "περί", "G", "acerca de, a respeito de");
const HN = (gl, f = "ἦν") => vb(f, "εἰμί", IMPF, P3S, gl,
  { nota: "O imperfeito indica ação contínua ou estado permanente no passado." });
const EGENETO = (gl, f = "ἐγένετο") => vb(f, "γίνομαι", AOR2, P3S, gl,
  { dep: true, nota: "γίνομαι é depoente: forma média/passiva, mas significado ativo (Unidade V)." });
const HO = () => art("ὁ", "masculino", "N", "singular", SUJ);
const LOGOS = () => sub("λόγος", "λόγος", M2, "N", "singular", "Verbo, Palavra",
  { fn: SUJ, nota: "2ª declinação em -ος." });
const TON = () => art("τὸν", "masculino", "A", "singular", OP);
const THEON = () => sub("Θεόν", "θεός", M2, "A", "singular", "Deus",
  { fn: OP, nota: "πρὸς τὸν Θεόν = “com Deus”." });
const ARCHE = () => sub("ἀρχῇ", "ἀρχή", F1, "D", "singular", "princípio",
  { fn: OP, nota: "O iota subscrito (ῃ) marca o dativo singular: ἐν ἀρχῇ = “no princípio”." });
const HOUTOS = () => pron("Οὗτος", "οὗτος", "demonstrativo masculino", "N", "singular", "este", { fn: SUJ });
const AUTOU = () => pron("αὐτοῦ", "αὐτός", "pessoal masculino", "G", "singular", "dele", { fn: OP });
const TO = (fn) => art("τὸ", "neutro", "N", "singular", fn);
const PHOS = (fn) => sub("φῶς", "φῶς", N3, "N", "singular", "luz", { fn });
const TOU = () => art("τοῦ", "neutro", "G", "singular", OP);
const PHOTOS = () => sub("φωτός", "φῶς", N3, "G", "singular", "da luz",
  { fn: OP, nota: "περὶ τοῦ φωτός = “a respeito da luz”." });
const MARTYRESE = () => vb("μαρτυρήσῃ", "μαρτυρέω", AORS, P3S, "testificasse, desse testemunho",
  { nota: "Em aula só foi dado o aoristo do indicativo, não o do subjuntivo." });
const KOSMOS = () => sub("κόσμος", "κόσμος", M2, "N", "singular", "mundo", { fn: SUJ });

// --- o texto ----------------------------------------------------------------
export const VERSOS = [
  { n: 1,
    gr: "Ἐν ἀρχῇ ἦν ὁ λόγος, καὶ ὁ λόγος ἦν πρὸς τὸν Θεόν, καὶ Θεὸς ἦν ὁ λόγος.",
    pt: "No princípio era o Verbo, e o Verbo estava com Deus, e o Verbo era Deus.",
    o: [
      { pt: "No princípio era o Verbo,",
        w: [EN("Ἐν"), ARCHE(), HN("era"), HO(), LOGOS()] },
      { pt: "e o Verbo estava com Deus,",
        w: [KAI(), HO(), LOGOS(), HN("estava"), PROS(), TON(), THEON()] },
      { pt: "e o Verbo era Deus.",
        w: [KAI(),
            sub("Θεὸς", "θεός", M2, "N", "singular", "Deus", { fn: PRED,
              nota: "Dois nominativos ligados por εἰμί: o que tem artigo é o sujeito (ὁ λόγος); o sem artigo é o predicativo (Θεὸς)." }),
            HN("era"), HO(), LOGOS()] },
    ] },

  { n: 2,
    gr: "Οὗτος ἦν ἐν ἀρχῇ πρὸς τὸν Θεόν.",
    pt: "Este estava no princípio com Deus.",
    o: [
      { pt: "Este estava no princípio com Deus.",
        w: [HOUTOS(), HN("estava"), EN(), ARCHE(), PROS(), TON(), THEON()] },
    ] },

  { n: 3,
    gr: "Πάντα δι᾽ αὐτοῦ ἐγένετο, καὶ χωρὶς αὐτοῦ ἐγένετο οὐδὲ ἓν ὃ γέγονεν.",
    pt: "Todas as coisas foram feitas por meio dele, e sem ele nada do que foi feito se fez.",
    o: [
      { pt: "Todas as coisas foram feitas por meio dele,",
        w: [{ f: "Πάντα", cl: "adj", lema: "πᾶς", c: "N", fn: SUJ, gl: "todas as coisas",
              an: "Adjetivo/substantivo neutro de πᾶς — nominativo plural" },
            DIA(), AUTOU(), EGENETO("foram feitas")] },
      { pt: "e sem ele nada do que foi feito se fez;",
        grT: "καὶ χωρὶς αὐτοῦ ἐγένετο οὐδὲ ἓν ὃ γέγονεν",
        w: [KAI(), prep("χωρὶς", "χωρίς", "G", "sem"), AUTOU(), EGENETO("foi feito"),
            { f: "οὐδὲ", ex: "οὐδὲ ἓν", cl: "expr", lema: "οὐδὲ ἕν", gl: "nem uma só coisa, nada",
              an: "Expressão de negação" },
            { f: "ἓν", ex: "οὐδὲ ἓν", cl: "expr", lema: "οὐδὲ ἕν", gl: "nem uma só coisa, nada",
              an: "Expressão de negação" }] },
      { pt: null,
        w: [pron("ὃ", "ὅς", "relativo neutro", "N", "singular", "o qual, que",
              { fn: SUJ, nota: "Sujeito da oração relativa." }),
            vb("γέγονεν", "γίνομαι", PERF, P3S, "veio a existir, tem sido feito")] },
    ] },

  { n: 4,
    gr: "Ἐν αὐτῷ ζωὴ ἦν, καὶ ἡ ζωὴ ἦν τὸ φῶς τῶν ἀνθρώπων,",
    pt: "Nele estava a vida, e a vida era a luz dos homens;",
    o: [
      { pt: "Nele estava a vida,",
        w: [EN("Ἐν"),
            pron("αὐτῷ", "αὐτός", "pessoal masculino", "D", "singular", "ele (ἐν αὐτῷ = “nele”)",
              { fn: OP, nota: "ἐν pede dativo; o iota subscrito (ῳ) marca o dativo singular." }),
            sub("ζωὴ", "ζωή", F1, "N", "singular", "vida", { fn: SUJ, nota: "1ª declinação em -η." }),
            HN("estava, havia")] },
      { pt: "e a vida era a luz dos homens;",
        w: [KAI(), art("ἡ", "feminino", "N", "singular", SUJ),
            sub("ζωὴ", "ζωή", F1, "N", "singular", "vida", { fn: SUJ, nota: "1ª declinação em -η." }),
            HN("era"), TO(), PHOS(),
            art("τῶν", "", "G", "plural", POSSE),
            sub("ἀνθρώπων", "ἄνθρωπος", M2, "G", "plural", "dos homens",
              { fn: POSSE, nota: "Genitivo possessivo: τὸ φῶς τῶν ἀνθρώπων = “a luz dos homens”." })] },
    ] },

  { n: 5,
    gr: "καὶ τὸ φῶς ἐν τῇ σκοτίᾳ φαίνει, καὶ ἡ σκοτία αὐτὸ οὐ κατέλαβεν.",
    pt: "e a luz resplandece nas trevas, e as trevas não a prevaleceram.",
    o: [
      { pt: "e a luz resplandece nas trevas,",
        w: [KAI(), TO(SUJ), PHOS(SUJ), EN(),
            art("τῇ", "feminino", "D", "singular", OP),
            sub("σκοτίᾳ", "σκοτία", F1, "D", "singular", "trevas",
              { fn: OP, nota: "1ª declinação em -α; o iota subscrito (ᾳ) marca o dativo: ἐν τῇ σκοτίᾳ = “nas trevas”." }),
            vb("φαίνει", "φαίνω", PRES, P3S, "resplandece, brilha",
              { nota: "O presente transmite ação contínua (Unidade III)." })] },
      { pt: "e as trevas não a prevaleceram.",
        w: [KAI(), art("ἡ", "feminino", "N", "singular", SUJ),
            sub("σκοτία", "σκοτία", F1, "N", "singular", "trevas", { fn: SUJ }),
            pron("αὐτὸ", "αὐτός", "pessoal neutro", "A", "singular", "a ela (a luz)",
              { fn: OD, nota: "Está no neutro porque retoma τὸ φῶς." }),
            OUK("οὐ"),
            vb("κατέλαβεν", "καταλαμβάνω", AOR, P3S, "prevaleceu contra, compreendeu, derrotou",
              { nota: "Verbo composto: κατά + λαμβάνω, com fusão de vogais no aoristo. Ação pontual concluída no passado." })] },
    ] },

  { n: 6,
    gr: "Ἐγένετο ἄνθρωπος ἀπεσταλμένος παρὰ Θεοῦ, ὄνομα αὐτῷ Ἰωάννης.",
    pt: "Surgiu um homem enviado da parte de Deus, cujo nome era João.",
    o: [
      { pt: "Surgiu um homem enviado da parte de Deus,",
        w: [EGENETO("surgiu, apareceu, houve", "Ἐγένετο"),
            sub("ἄνθρωπος", "ἄνθρωπος", M2, "N", "singular", "um homem", { fn: SUJ }),
            { f: "ἀπεσταλμένος", cl: "part", lema: "ἀποστέλλω", c: "N", gl: "enviado",
              an: "Particípio — nominativo masculino singular",
              nota: "Do verbo composto ἀποστέλλω." },
            prep("παρὰ", "παρά", "G", "da parte de"),
            sub("Θεοῦ", "θεός", M2, "G", "singular", "de Deus",
              { fn: OP, nota: "παρὰ Θεοῦ: complemento de origem/agente — “da parte de Deus”." })] },
      { pt: "cujo nome era João.",
        w: [sub("ὄνομα", "ὄνομα", "neutro", "N", "singular", "nome", { fn: SUJ }),
            pron("αὐτῷ", "αὐτός", "pessoal masculino", "D", "singular", "dele, para ele",
              { fn: DPOSSE, nota: "Dativo de posse: ὄνομα αὐτῷ = “o nome dele”." }),
            sub("Ἰωάννης", "Ἰωάννης", "masculino da 1ª declinação em -ης", "N", "singular", "João")] },
    ] },

  { n: 7,
    gr: "Οὗτος ἦλθεν εἰς μαρτυρίαν, ἵνα μαρτυρήσῃ περὶ τοῦ φωτός, ἵνα πάντες πιστεύσωσι δι᾽ αὐτοῦ.",
    pt: "Este veio para testemunho, a fim de testificar a respeito da luz, para que todos cressem por meio dele.",
    o: [
      { pt: "Este veio para testemunho,",
        w: [HOUTOS(),
            vb("ἦλθεν", "ἔρχομαι", AOR, P3S, "veio",
              { dep: true, nota: "ἔρχομαι (“ir, vir”) é depoente e tem aoristo irregular; o significado é ativo." }),
            EIS(),
            sub("μαρτυρίαν", "μαρτυρία", F1, "A", "singular", "testemunho",
              { fn: OP, nota: "εἰς μαρτυρίαν: objeto de finalidade — “para testemunho”." })] },
      { pt: "a fim de testificar a respeito da luz,",
        w: [INA(), MARTYRESE(), PERI(), TOU(), PHOTOS()] },
      { pt: "para que todos cressem por meio dele.",
        w: [INA(),
            { f: "πάντες", cl: "adj", lema: "πᾶς", c: "N", fn: SUJ, gl: "todos",
              an: "Adjetivo masculino de πᾶς — nominativo plural" },
            vb("πιστεύσωσι", "πιστεύω", AORS, P3P, "cressem",
              { nota: "Em aula só foi dado o aoristo do indicativo, não o do subjuntivo." }),
            DIA(), AUTOU()] },
    ] },

  { n: 8,
    gr: "Οὐκ ἦν ἐκεῖνος τὸ φῶς, ἀλλ᾽ ἵνα μαρτυρήσῃ περὶ τοῦ φωτός.",
    pt: "Ele não era a luz, mas veio para que testificasse a respeito da luz.",
    o: [
      { pt: "Ele não era a luz,",
        w: [OUK("Οὐκ"), HN("era"),
            pron("ἐκεῖνος", "ἐκεῖνος", "demonstrativo masculino", "N", "singular", "ele, aquele", { fn: SUJ }),
            TO(), PHOS()] },
      { pt: "mas veio para que testificasse a respeito da luz.",
        w: [{ f: "ἀλλ᾽", cl: "conj", lema: "ἀλλά", gl: "mas", an: "Conjunção adversativa",
              nota: "ἀλλ᾽ é ἀλλά com elisão da vogal final." },
            INA(), MARTYRESE(), PERI(), TOU(), PHOTOS()] },
    ] },

  { n: 9,
    gr: "Ἦν τὸ φῶς τὸ ἀληθινόν, ὃ φωτίζει πάντα ἄνθρωπον ἐρχόμενον εἰς τὸν κόσμον.",
    pt: "Ali estava a luz verdadeira, que ilumina a todo homem que vem ao mundo.",
    o: [
      { pt: "Ali estava a luz verdadeira,",
        w: [HN("estava, era", "Ἦν"), TO(SUJ), PHOS(SUJ), TO(),
            { f: "ἀληθινόν", cl: "adj", lema: "ἀληθινός", c: "N", gl: "verdadeira",
              an: "Adjetivo neutro — nominativo singular",
              nota: "De ἀληθινός; concorda com τὸ φῶς." }] },
      { pt: "que ilumina a todo homem que vem ao mundo.",
        w: [pron("ὃ", "ὅς", "relativo neutro", "N", "singular", "que",
              { fn: SUJ, nota: "Retoma τὸ φῶς e é o sujeito da oração relativa." }),
            vb("φωτίζει", "φωτίζω", PRES, P3S, "ilumina"),
            { f: "πάντα", cl: "adj", lema: "πᾶς", c: "A", fn: OD, gl: "todo",
              an: "Adjetivo masculino de πᾶς — acusativo singular" },
            sub("ἄνθρωπον", "ἄνθρωπος", M2, "A", "singular", "homem", { fn: OD }),
            { f: "ἐρχόμενον", cl: "part", lema: "ἔρχομαι", c: "A", gl: "que vem, vindo",
              an: "Particípio — acusativo masculino singular",
              nota: "Concorda com ἄνθρωπον." },
            EIS(), TON(),
            sub("κόσμον", "κόσμος", M2, "A", "singular", "mundo",
              { fn: OP, nota: "εἰς τὸν κόσμον = “ao mundo”." })] },
    ] },

  { n: 10,
    gr: "Ἐν τῷ κόσμῳ ἦν, καὶ ὁ κόσμος δι᾽ αὐτοῦ ἐγένετο, καὶ ὁ κόσμος αὐτὸν οὐκ ἔγνω.",
    pt: "Ele estava no mundo, e o mundo foi feito por meio dele, e o mundo não o conheceu.",
    o: [
      { pt: "Ele estava no mundo,",
        w: [EN("Ἐν"), art("τῷ", "masculino", "D", "singular", OP),
            sub("κόσμῳ", "κόσμος", M2, "D", "singular", "mundo",
              { fn: OP, nota: "Ἐν τῷ κόσμῳ: locução de lugar — “no mundo”." }),
            HN("estava")] },
      { pt: "e o mundo foi feito por meio dele,",
        w: [KAI(), HO(), KOSMOS(), DIA(), AUTOU(), EGENETO("foi feito")] },
      { pt: "e o mundo não o conheceu.",
        w: [KAI(), HO(), KOSMOS(),
            pron("αὐτὸν", "αὐτός", "pessoal masculino", "A", "singular", "a ele, o",
              { fn: OD, nota: "Refere-se ao Logos." }),
            OUK("οὐκ"),
            vb("ἔγνω", "γινώσκω", AOR, P3S, "conheceu",
              { nota: "Aoristo irregular de γινώσκω: ação pontual concluída no passado." })] },
    ] },
];

// vocabulário do texto, na forma de dicionário
const LEXICO = [
  ["ἐν", "em, dentro de"], ["ἀρχή", "princípio"], ["εἰμί", "ser, estar"],
  ["λόγος", "palavra, verbo"], ["καί", "e"], ["πρός", "junto de, em direção a, com"],
  ["θεός", "Deus"], ["οὗτος", "este"], ["πᾶς", "todo; no plural, todos"],
  ["διά", "por meio de, através de"], ["αὐτός", "ele"],
  ["γίνομαι", "tornar-se, vir a ser, ser feito"], ["χωρίς", "sem"],
  ["οὐδὲ ἕν", "nem uma só coisa, nada"], ["ὅς", "o qual, que"], ["ζωή", "vida"],
  ["φῶς", "luz"], ["ἄνθρωπος", "homem"], ["σκοτία", "trevas"],
  ["φαίνω", "resplandecer, brilhar"], ["οὐ / οὐκ", "não"],
  ["καταλαμβάνω", "prevalecer contra, compreender"], ["ἀποστέλλω", "enviar"],
  ["παρά", "da parte de"], ["ὄνομα", "nome"], ["Ἰωάννης", "João"],
  ["ἔρχομαι", "ir, vir"], ["εἰς", "para"], ["μαρτυρία", "testemunho"],
  ["ἵνα", "para que"], ["μαρτυρέω", "testificar, dar testemunho"],
  ["περί", "acerca de, a respeito de"], ["πιστεύω", "crer"],
  ["ἐκεῖνος", "aquele"], ["ἀλλά", "mas"], ["ἀληθινός", "verdadeiro"],
  ["φωτίζω", "iluminar"], ["κόσμος", "mundo"], ["γινώσκω", "conhecer"],
];

// locuções com preposição que aparecem no texto
const LOCUCOES = [
  ["ἐν ἀρχῇ", "ἐν", "D", "no princípio", 1],
  ["πρὸς τὸν Θεόν", "πρός", "A", "com Deus", 1],
  ["δι᾽ αὐτοῦ", "διά", "G", "por meio dele", 3],
  ["χωρὶς αὐτοῦ", "χωρίς", "G", "sem ele", 3],
  ["Ἐν αὐτῷ", "ἐν", "D", "nele", 4],
  ["ἐν τῇ σκοτίᾳ", "ἐν", "D", "nas trevas", 5],
  ["παρὰ Θεοῦ", "παρά", "G", "da parte de Deus", 6],
  ["εἰς μαρτυρίαν", "εἰς", "A", "para testemunho", 7],
  ["περὶ τοῦ φωτός", "περί", "G", "a respeito da luz", 7],
  ["εἰς τὸν κόσμον", "εἰς", "A", "ao mundo", 9],
  ["Ἐν τῷ κόσμῳ", "ἐν", "D", "no mundo", 10],
];

// --- perguntas escritas à mão ------------------------------------------------
// v = versículo (0 = regra geral) · temas = seções temáticas em que entra
const m = (v, temas, ask, a, d, nota = "", extra = {}) => ({ v, temas, ask, a, d, nota, ...extra });

const MANUAIS = [
  // os quatro passos da análise
  m(0, ["regras"], "Ao analisar um texto grego, qual é o primeiro passo?",
    "Localizar o verbo principal e identificar sua forma",
    ["Traduzir palavra por palavra, na ordem em que aparecem",
     "Procurar o sujeito na primeira posição da frase",
     "Separar os artigos dos substantivos"],
    "O verbo indica a ação central da oração."),
  m(0, ["regras", "verbos"], "O que se determina ao identificar uma forma verbal?",
    "Tempo, modo, voz, pessoa e número",
    ["Caso, gênero e número", "Declinação, caso e gênero", "Apenas pessoa e número"]),
  m(0, ["regras", "casos"], "Como se identifica o sujeito de uma oração grega?",
    "Pela terminação de caso (nominativo), não pela posição",
    ["Pela posição: é sempre a primeira palavra",
     "Por vir imediatamente antes do verbo",
     "Por vir acompanhado de preposição"],
    "A ordem das palavras no grego é flexível (Unidade II)."),
  m(0, ["regras", "casos"], "Que palavras podem estar no nominativo como sujeito?",
    "Substantivos, pronomes ou adjetivos",
    ["Somente substantivos", "Verbos e advérbios", "Preposições e conjunções"],
    "No texto: ὁ λόγος (substantivo), Οὗτος (pronome), Πάντα (adjetivo)."),
  m(0, ["regras", "casos"], "Qual caso marca o sujeito?", "Nominativo",
    ["Genitivo", "Dativo", "Acusativo"]),
  m(0, ["regras", "casos"], "Qual caso marca o objeto direto da ação verbal?", "Acusativo",
    ["Nominativo", "Genitivo", "Dativo"], "Ex.: ὁ κόσμος αὐτὸν οὐκ ἔγνω."),
  m(0, ["regras", "casos"], "Qual caso marca o objeto indireto?", "Dativo",
    ["Nominativo", "Genitivo", "Acusativo"]),
  m(0, ["regras", "casos"], "Qual caso indica posse e costuma ser traduzido com “de”?", "Genitivo",
    ["Nominativo", "Dativo", "Acusativo"], "Ex.: τὸ φῶς τῶν ἀνθρώπων = “a luz dos homens”."),
  m(0, ["regras", "casos"], "Que sinal frequentemente marca o dativo singular?",
    "O iota subscrito (ᾳ, ῃ, ῳ)",
    ["O espírito áspero", "O acento circunflexo", "O sigma final (ς)"],
    "No texto: ἀρχῇ, σκοτίᾳ, αὐτῷ, κόσμῳ."),
  m(0, ["regras", "prep"], "O que é preciso verificar em cada preposição?",
    "O caso que ela rege, para delimitar seu significado",
    ["O gênero do substantivo anterior", "O tempo do verbo principal",
     "Se ela concorda em número com o sujeito"]),
  m(0, ["regras", "prep"], "Cada preposição exige sempre…",
    "Um caso específico: genitivo, dativo ou acusativo",
    ["O nominativo", "O mesmo caso do sujeito", "Qualquer caso, sem mudar o sentido"]),

  // observações finais
  m(0, ["regras", "verbos"], "Uma palavra termina em -ει (φαίνει, φωτίζει). Do que desconfiar?",
    "De um verbo na 3ª pessoa",
    ["De um substantivo no dativo", "De um artigo no plural", "De uma preposição que pede genitivo"]),
  m(0, ["regras", "verbos"], "O que o imperfeito expressa?",
    "Ação contínua ou estado duradouro no passado",
    ["Ação pontual no tempo", "Ação contínua no presente", "Ação concluída cujo efeito permanece"],
    "Ex.: ἦν — o Logos continuava sendo e estando com Deus."),
  m(0, ["regras", "verbos"], "O que o aoristo expressa?",
    "Uma ação pontual no tempo",
    ["Ação contínua ou estado duradouro no passado", "Ação contínua no presente",
     "Uma ação que ainda vai acontecer"],
    "Ex.: ἐγένετο, ἦλθεν, ἔγνω."),
  m(0, ["regras", "verbos"], "Quais verbos têm o aoristo irregular destacado pelo professor?",
    "γίνομαι, ἔρχομαι e γινώσκω",
    ["λύω, πιστεύω e μαρτυρέω", "εἰμί, φαίνω e φωτίζω", "λέγω, βλέπω e γράφω"],
    "ἐγένετο, ἦλθεν e ἔγνω."),
  m(0, ["regras", "verbos"], "Por que João usa ἦν (imperfeito) para o Logos nos versículos 1 e 2?",
    "Porque o Logos continuava sendo e estando com Deus",
    ["Porque foi um fato único e pontual", "Porque a ação ainda vai acontecer",
     "Porque é uma ordem"],
    "O imperfeito expressa estado duradouro no passado."),
  m(0, ["regras", "verbos"], "O que caracteriza um verbo depoente?",
    "Forma média ou passiva, mas significado ativo",
    ["Forma ativa, mas significado passivo", "Não tem aoristo", "Só existe no particípio"],
    "Unidades IV e V."),
  m(0, ["regras", "verbos"], "Quais verbos depoentes aparecem em João 1:1-10?",
    "γίνομαι e ἔρχομαι",
    ["εἰμί e φαίνω", "πιστεύω e μαρτυρέω", "φωτίζω e γινώσκω"],
    "Formas: ἐγένετο e ἦλθεν."),
  m(0, ["regras", "verbos"], "Como traduzir ἐγένετο e ἦλθεν, formas de verbos depoentes?",
    "Com sentido ativo: “veio a ser”, “veio”",
    ["Com sentido reflexivo: “fez a si mesmo”", "Sempre com sentido passivo",
     "Como presente contínuo"],
    "Na tradução não se deve buscar sentido reflexivo ou passivo para essas formas."),
  m(0, ["regras", "autos"], "Que pronome o professor manda estudar em todos os casos, por ser muito usado no NT?",
    "αὐτός (ele)", ["οὗτος (este)", "ἐκεῖνος (aquele)", "ὅς (o qual)"],
    "Possessivo, objeto direto e objeto indireto."),

  // João 1:1
  m(1, ["casos"], "Em Θεὸς ἦν ὁ λόγος há dois nominativos ligados por εἰμί. Qual é o sujeito?",
    "ὁ λόγος — o que vem com artigo definido",
    ["Θεὸς — por vir primeiro na oração", "Θεὸς — por não ter artigo",
     "Os dois formam um sujeito composto"],
    "Regra da Unidade III: o substantivo com artigo é o sujeito; o sem artigo é o predicativo do sujeito."),
  m(1, [], "Qual é a tradução correta de καὶ Θεὸς ἦν ὁ λόγος?",
    "e o Verbo era Deus",
    ["e Deus era o Verbo", "e o Verbo era um deus", "e o Verbo estava com Deus"],
    "Afirma a natureza divina do Logos: ὁ λόγος é o sujeito, Θεὸς o predicativo."),
  m(1, ["casos"], "O que o iota subscrito de ἀρχῇ indica?",
    "Dativo singular", ["Genitivo singular", "Acusativo singular", "Nominativo plural"],
    "ἐν pede dativo: ἐν ἀρχῇ = “no princípio”."),

  // João 1:3
  m(3, ["prep"], "O que acontece com διά em δι᾽ αὐτοῦ?",
    "Elisão: a vogal final cai",
    ["Crase com o artigo", "Contração com o verbo", "Recebe o aumento do aoristo"],
    "δι᾽ = διά, que pede genitivo: “por meio de”."),
  m(3, ["verbos"], "Em João 1:3, qual é a diferença entre ἐγένετο e γέγονεν?",
    "ἐγένετο é 2º aoristo; γέγονεν é perfeito",
    ["ἐγένετο é imperfeito; γέγονεν é aoristo", "ἐγένετο é presente; γέγονεν é imperfeito",
     "São o mesmo tempo, em pessoas diferentes"],
    "Ambos vêm de γίνομαι: “foi feito” e “tem sido feito / veio a existir”."),
  m(3, ["verbos"], "ἐγένετο tem forma média/passiva. Como deve ser entendido?",
    "Com significado ativo, porque γίνομαι é depoente",
    ["Como passivo, obrigatoriamente", "Como reflexivo", "Como imperativo"],
    "Regra da Unidade V."),

  // João 1:4
  m(4, [], "A que declinação pertence φῶς?",
    "3ª declinação (neutro)",
    ["1ª declinação (feminino)", "2ª declinação (masculino)", "2ª declinação (neutro)"],
    "τὸ φῶς; no genitivo, τοῦ φωτός."),
  m(4, ["casos"], "Em τὸ φῶς τῶν ἀνθρώπων, o que o genitivo expressa?",
    "Posse: “a luz dos homens”",
    ["Lugar: “a luz nos homens”", "Objeto direto: “ilumina os homens”",
     "Direção: “a luz para os homens”"]),

  // João 1:5
  m(5, ["verbos", "prep"], "κατέλαβεν é um verbo composto. De quê?",
    "Preposição κατά + verbo λαμβάνω",
    ["Preposição κατά + verbo λέγω", "Preposição ἀπό + verbo λαμβάνω",
     "Preposição παρά + verbo βάλλω"],
    "καταλαμβάνω; há fusão de vogais entre a preposição e o verbo no aoristo."),
  m(5, ["autos"], "A que palavra se refere αὐτὸ em ἡ σκοτία αὐτὸ οὐ κατέλαβεν?",
    "τὸ φῶς (a luz), que é neutro",
    ["ἡ σκοτία (as trevas)", "ὁ λόγος (o Verbo)", "ὁ κόσμος (o mundo)"],
    "αὐτὸ é acusativo neutro singular: o objeto direto."),
  m(5, ["verbos"], "φαίνει está no presente. Que ideia transmite?",
    "Ação contínua no presente",
    ["Ação pontual concluída no passado", "Estado duradouro no passado", "Ação futura"],
    "“a luz resplandece nas trevas” (Unidade III)."),
  m(5, ["verbos"], "Que contraste de tempos há entre φαίνει e κατέλαβεν?",
    "Presente (ação contínua) × aoristo (ação pontual concluída)",
    ["Imperfeito × presente", "Aoristo × perfeito", "Presente × futuro"]),

  // João 1:6
  m(6, [], "Ἰωάννης é masculino. A que declinação pertence?",
    "1ª declinação, com terminação -ης",
    ["2ª declinação, com terminação -ος", "3ª declinação", "É indeclinável"]),
  m(6, ["prep"], "O que παρὰ Θεοῦ expressa?",
    "Origem ou agente: “da parte de Deus”",
    ["Lugar: “dentro de Deus”", "Finalidade: “para Deus”", "Posse: “o Deus dele”"],
    "παρά pede genitivo."),
  m(6, ["autos", "casos"], "Em ὄνομα αὐτῷ Ἰωάννης, por que αὐτῷ está no dativo?",
    "É dativo de posse: “o nome dele”",
    ["É objeto direto do verbo", "É regido pela preposição ἐν", "É o sujeito da oração"]),

  // João 1:7
  m(7, ["verbos"], "Em que modo estão μαρτυρήσῃ e πιστεύσωσι?",
    "Subjuntivo (aoristo do subjuntivo ativo)",
    ["Indicativo (aoristo do indicativo ativo)", "Imperativo", "Infinitivo"],
    "O professor avisa: em aula só foi dado o aoristo do indicativo."),
  m(7, [], "Que conjunção introduz as orações de finalidade em João 1:7?",
    "ἵνα — “para que”", ["καί — “e”", "ἀλλά — “mas”", "οὐδέ — “nem”"]),
  m(7, ["prep"], "O que εἰς μαρτυρίαν expressa?",
    "Finalidade: “para testemunho”",
    ["Lugar: “no testemunho”", "Origem: “do testemunho”", "Companhia: “com testemunho”"],
    "εἰς pede acusativo."),

  // João 1:8
  m(8, [], "ἀλλ᾽ é a forma com elisão de qual palavra?",
    "ἀλλά — conjunção adversativa “mas”",
    ["ἄλλος — “outro”", "ἀληθινός — “verdadeiro”", "ἀπό — “de”"]),
  m(8, [], "Como se classifica ἵνα μαρτυρήσῃ περὶ τοῦ φωτός em João 1:8?",
    "Oração subordinada final",
    ["Oração relativa", "Oração principal", "Oração condicional"],
    "“mas veio para que testificasse a respeito da luz.”"),

  // João 1:9
  m(9, [], "A que se refere o pronome relativo ὃ em João 1:9?",
    "A τὸ φῶς (a luz)",
    ["A ἄνθρωπον (homem)", "A τὸν κόσμον (o mundo)", "A ὁ λόγος (o Verbo)"],
    "ὃ é neutro, nominativo singular: sujeito da oração relativa."),
  m(9, ["casos"], "Com que palavra o particípio ἐρχόμενον concorda?",
    "Com ἄνθρωπον — acusativo masculino singular",
    ["Com τὸ φῶς — nominativo neutro singular", "Com τὸν κόσμον, como adjetivo de “mundo”",
     "Com o verbo φωτίζει"],
    "“todo homem que vem ao mundo”."),

  // João 1:10
  m(10, ["autos"], "A quem se refere αὐτὸν em ὁ κόσμος αὐτὸν οὐκ ἔγνω?",
    "Ao Logos (o Verbo)", ["Ao mundo", "A João", "À luz, por ser neutro"],
    "αὐτὸν é acusativo masculino singular: objeto direto."),
  m(10, ["verbos"], "O que o aoristo ἔγνω indica?",
    "Ação pontual concluída no passado: “não o conheceu”",
    ["Ação contínua no presente: “não o conhece”", "Estado duradouro no passado: “não o conhecia”",
     "Ação futura: “não o conhecerá”"],
    "ἔγνω é o aoristo irregular de γινώσκω."),
  m(10, ["prep", "casos"], "O que é Ἐν τῷ κόσμῳ na oração Ἐν τῷ κόσμῳ ἦν?",
    "Locução de lugar: “no mundo”",
    ["Sujeito da oração", "Objeto direto", "Genitivo de posse"],
    "ἐν pede dativo."),

  // o pronome αὐτός nos casos
  m(0, ["autos"], "Qual forma de αὐτός é genitivo — o possessivo “dele”?",
    "αὐτοῦ", ["αὐτῷ", "αὐτόν", "αὐτό"], "δι᾽ αὐτοῦ, χωρὶς αὐτοῦ.", { gk: true }),
  m(0, ["autos"], "Qual forma de αὐτός é dativo — o caso do objeto indireto?",
    "αὐτῷ", ["αὐτοῦ", "αὐτόν", "αὐτός"], "Ἐν αὐτῷ, ὄνομα αὐτῷ.", { gk: true }),
  m(0, ["autos"], "Qual forma de αὐτός é acusativo masculino — o objeto direto “o / a ele”?",
    "αὐτόν", ["αὐτοῦ", "αὐτῷ", "αὐτός"], "ὁ κόσμος αὐτὸν οὐκ ἔγνω.", { gk: true }),
  m(0, ["autos"], "Qual forma de αὐτός é acusativo neutro, usada para retomar τὸ φῶς?",
    "αὐτό", ["αὐτόν", "αὐτοῦ", "αὐτῷ"], "ἡ σκοτία αὐτὸ οὐ κατέλαβεν.", { gk: true }),
  m(0, ["autos", "prep"], "Por que αὐτοῦ está no genitivo em δι᾽ αὐτοῦ?",
    "Porque διά, no sentido “por meio de”, pede genitivo",
    ["Porque é o sujeito da oração", "Porque é o objeto direto", "Porque indica o objeto indireto"]),
  m(0, ["autos"], "Como se traduz χωρὶς αὐτοῦ?",
    "sem ele", ["por meio dele", "nele", "a ele"], "χωρίς pede genitivo."),
  m(0, ["autos"], "Como se traduz Ἐν αὐτῷ?",
    "nele", ["dele", "sem ele", "por meio dele"], "ἐν pede dativo."),
];

// --- montagem das perguntas ---------------------------------------------------
const TODAS = [];
VERSOS.forEach((v) => v.o.forEach((o) => o.w.forEach((w, k) => TODAS.push({ v, o, k, w }))));

const ref = (v) => `João 1:${v.n}`;
const explica = (w) =>
  `${w.ex || w.f}: ${w.an}${w.gl ? ` — “${w.gl}”` : ""}.${w.nota ? " " + w.nota : ""}`;

// três alternativas erradas, sem repetir a certa; tenta primeiro a lista preferida
function distrair(certa, preferidas, resto = [], n = 3) {
  const out = [];
  for (const v of [...shuffle(preferidas), ...shuffle(resto)]) {
    if (v && v !== certa && !out.includes(v)) out.push(v);
    if (out.length === n) break;
  }
  return out;
}
const opcoes = (certa, erradas) => shuffle([certa, ...erradas]);

function contexto(e) {
  const alvo = e.w.ex
    ? e.o.w.map((x, i) => (x.ex === e.w.ex ? i : -1)).filter((i) => i >= 0)
    : [e.k];
  return { w: e.o.w.map((x) => x.f), alvo };
}

function facetas(w) {
  switch (w.cl) {
    case "art":   return ["caso", "an"];
    case "prep":  return ["rege", "rege", "gl"];
    case "verbo": return ["tempo", "tempo", "lema", "gl", "pn"];
    case "part":  return ["caso", "an", "gl", "lema"];
    case "conj":
    case "adv":   return ["gl", "an"];
    case "expr":  return ["gl"];
    default:      return ["caso", "an", "gl", ...(w.fn ? ["fn", "fn"] : [])];
  }
}

const LEMAS_VERBAIS = [...new Set(TODAS.filter((e) => ["verbo", "part"].includes(e.w.cl))
  .map((e) => e.w.lema)), "λέγω", "λύω", "βλέπω", "ἀκούω"];

function perguntaPalavra(e, faceta = um(facetas(e.w))) {
  const { w } = e;
  const base = { k: "mc", ref: ref(e.v), ctx: contexto(e), nota: explica(w) };
  const outras = TODAS.filter((x) => x.w !== w);
  const mesma = outras.filter((x) => x.w.cl === w.cl);

  if (faceta === "caso")
    return { ...base, ask: "Em que caso está a palavra destacada?",
             a: cap(C[w.c]), opts: shuffle(CASOS4) };

  if (faceta === "rege")
    return { ...base, ask: "Que caso a preposição destacada pede?",
             a: cap(C[w.rege]), opts: shuffle(CASOS4) };

  if (faceta === "fn")
    return { ...base, ask: "Qual é a função da palavra destacada na oração?",
             a: w.fn, opts: opcoes(w.fn, distrair(w.fn, FUNCOES)) };

  if (faceta === "tempo") {
    const fora = w.t === AOR2 ? [AOR] : [];
    return { ...base, ask: "Em que tempo e modo está o verbo destacado?",
             a: w.t, opts: opcoes(w.t, distrair(w.t, TEMPOS.filter((t) => !fora.includes(t)))) };
  }

  if (faceta === "pn")
    return { ...base, ask: "Qual é a pessoa e o número do verbo destacado?",
             a: w.pn, opts: shuffle(PESSOAS) };

  if (faceta === "lema")
    return { ...base, ask: "De que verbo vem a forma destacada?", gk: true,
             a: w.lema, opts: opcoes(w.lema, distrair(w.lema, LEMAS_VERBAIS)) };

  if (faceta === "gl") {
    const serve = (x) => x.w.gl && x.w.lema !== w.lema;
    return { ...base, ask: "Como se traduz aqui a palavra destacada?",
             a: w.gl,
             opts: opcoes(w.gl, distrair(w.gl, mesma.filter(serve).map((x) => x.w.gl),
                                               outras.filter(serve).map((x) => x.w.gl))) };
  }

  // "an": a análise completa
  return { ...base, ask: "Qual é a análise da palavra destacada?",
           a: w.an,
           opts: opcoes(w.an, distrair(w.an, mesma.map((x) => x.w.an),
                                              outras.filter((x) => x.w.cl !== "verbo").map((x) => x.w.an))) };
}

// "toque na palavra": devolve todas as perguntas possíveis para a oração
function taps(v, o) {
  if (o.w.length < 3) return [];
  const out = [];
  const add = (tipo, ask, dica, teste) => {
    const certos = o.w.map((w, i) => (teste(w) ? i : -1)).filter((i) => i >= 0);
    if (!certos.length || certos.length === o.w.length) return;
    out.push({ k: "tap", tipo, ref: ref(v), ask, dica, w: o.w.map((w) => w.f), certos,
               nota: certos.map((i) => `${o.w[i].f}: ${o.w[i].an}`).join(" · ") });
  };
  add("suj", "Toque no sujeito da oração.",
      "ele está no nominativo — olhe a terminação, não a posição", (w) => w.fn === SUJ);
  add("verbo", "Toque no verbo da oração.",
      "a forma verbal indica a ação central", (w) => w.cl === "verbo");
  add("od", "Toque no objeto direto.", "ele está no acusativo", (w) => w.fn === OD);
  add("pred", "Toque no predicativo do sujeito.",
      "com dois nominativos ligados por εἰμί, é o que não tem artigo", (w) => w.fn === PRED);
  add("prep", "Toque na preposição.",
      "cada preposição pede um caso específico", (w) => w.cl === "prep");
  add("op", "Toque no complemento da preposição.",
      "a palavra que vem no caso pedido pela preposição", (w) => w.fn === OP);
  add("posse", "Toque na palavra que indica posse.",
      "posse pode vir no genitivo ou no dativo", (w) => w.fn === POSSE || w.fn === DPOSSE);
  for (const c of ["N", "G", "D", "A"])
    add("caso", `Toque numa palavra que está no ${C[c]}.`, DICA_CASO[c], (w) => w.c === c);
  return out;
}

const semPontuacao = (s) => s.replace(/[.,;:!?“”"]/g, "").trim();
const grego = (o) => o.grT || o.w.map((w) => w.f).join(" ");
const ORACOES = VERSOS.flatMap((v) => v.o.filter((o) => o.pt).map((o) => ({ v, o })));
const TODAS_PT = [...new Set(ORACOES.flatMap(({ o }) => semPontuacao(o.pt).split(/\s+/)))];
const PECAS_FALSAS = ["sobre", "depois", "contra", "céu", "nosso", "terra", "disse"];

function ordem(v, o) {
  const a = semPontuacao(o.pt).split(/\s+/);
  const usadas = new Set(a.map((p) => p.toLowerCase()));
  const livres = TODAS_PT.filter((p) => !usadas.has(p.toLowerCase()) && p.length > 2);
  const falsas = [...pick(livres, 2), um(PECAS_FALSAS)];
  return { k: "ordem", ref: ref(v), ask: "Monte a tradução desta oração.", gr: grego(o),
           a, banco: shuffle([...a, ...falsas]) };
}

function tradMc(v, o) {
  const certa = semPontuacao(o.pt);
  const outras = ORACOES.filter((x) => x.o !== o).map((x) => semPontuacao(x.o.pt));
  return { k: "mc", ref: ref(v), ask: "Qual é a tradução desta oração?",
           ctx: { w: grego(o).split(" "), alvo: [] },
           a: certa, opts: opcoes(certa, distrair(certa, outras)) };
}

function manual(q) {
  return { k: "mc", ref: q.v ? `João 1:${q.v}` : "Regras de análise", ask: q.ask, a: q.a,
           opts: opcoes(q.a, q.d), nota: q.nota, gk: !!q.gk };
}
const doTema = (t) => MANUAIS.filter((q) => q.temas.includes(t));

function locucao([frase, lema, c, pt, n], tipo = um(["caso", "trad"])) {
  const base = { k: "mc", ref: `João 1:${n}`, show: frase };
  if (tipo === "trad") {
    const outras = LOCUCOES.map((l) => l[3]);
    return { ...base, ask: "Como se traduz esta locução?", a: pt,
             opts: opcoes(pt, distrair(pt, outras)), nota: `${lema} pede ${C[c]}.` };
  }
  const frases = (x) => `${cap(C[x])} — ${lema} pede ${C[x]}`;
  const certa = frases(c);
  return { ...base, ask: "Em que caso está o complemento da preposição?", a: certa,
           opts: opcoes(certa, ["G", "D", "A"].filter((x) => x !== c).map(frases)
                                .concat("Nominativo — é o sujeito da oração")),
           nota: `${frase} = “${pt}”.` };
}

function vocab([lema, gl], tipo = um(["gr", "pt"])) {
  const outros = LEXICO.filter((x) => x[0] !== lema);
  if (tipo === "gr")
    return { k: "mc", ref: "Vocabulário", ask: "O que significa esta palavra?", show: lema,
             a: gl, opts: opcoes(gl, distrair(gl, outros.map((x) => x[1]))) };
  return { k: "mc", ref: "Vocabulário", ask: "Qual palavra grega corresponde?", txt: gl, gk: true,
           a: lema, opts: opcoes(lema, distrair(lema, outros.map((x) => x[0]))) };
}

// uma ocorrência por chave, na ordem do texto
function unicas(lista, chave) {
  const vistos = new Set();
  return lista.filter((e) => {
    const c = chave(e.w);
    if (vistos.has(c)) return false;
    vistos.add(c);
    return true;
  });
}
const minus = (s) => (s || "").toLowerCase();

// --- sessões --------------------------------------------------------------------
function sessaoVerso(v) {
  const q = [];
  const vistos = new Set();
  v.o.forEach((o) => {
    o.w.forEach((w, k) => {
      const chave = `${minus(w.ex || w.f)}|${w.an}|${w.fn || ""}`;
      if (vistos.has(chave)) return;
      vistos.add(chave);
      q.push(perguntaPalavra({ v, o, k, w }));
    });
    const ts = taps(v, o);
    if (ts.length) q.push(um(ts));
  });
  const comPt = v.o.filter((o) => o.pt);
  const montar = Math.floor(Math.random() * comPt.length);   // ao menos uma para montar
  comPt.forEach((o, i) => q.push(i === montar || Math.random() < 0.5 ? ordem(v, o) : tradMc(v, o)));
  MANUAIS.filter((x) => x.v === v.n).forEach((x) => q.push(manual(x)));
  return shuffle(q);
}

const NOMINAIS = unicas(TODAS.filter((e) => e.w.c), (w) => `${minus(w.f)}|${w.c}|${w.fn || ""}`);
const VERBOS = unicas(TODAS.filter((e) => e.w.cl === "verbo"), (w) => minus(w.f));
const VERBAIS = unicas(TODAS.filter((e) => ["verbo", "part"].includes(e.w.cl)), (w) => minus(w.f));
const PREPS = unicas(TODAS.filter((e) => e.w.cl === "prep"), (w) => w.lema);
const AUTOS = unicas(TODAS.filter((e) => e.w.lema === "αὐτός"), (w) => `${w.f}|${w.fn}`);
const TAPS = VERSOS.flatMap((v) => v.o.flatMap((o) => taps(v, o)));

const TEMAS = {
  regras: () => shuffle(doTema("regras").map(manual)),

  casos: () => shuffle([
    ...pick(NOMINAIS, 8).map((e) =>
      perguntaPalavra(e, um(e.w.fn && e.w.cl !== "art" ? ["caso", "fn", "fn", "an"] : ["caso", "an"]))),
    ...pick(TAPS.filter((t) => ["suj", "od", "pred", "posse", "caso"].includes(t.tipo)), 4),
    ...doTema("casos").map(manual),
  ]),

  prep: () => shuffle([
    ...PREPS.map((e) => perguntaPalavra(e, "rege")),
    ...PREPS.map((e) => perguntaPalavra(e, "gl")),
    ...pick(LOCUCOES, 3).map((l) => locucao(l)),
    ...pick(TAPS.filter((t) => ["prep", "op"].includes(t.tipo)), 1),
    ...doTema("prep").map(manual),
  ]),

  verbos: () => shuffle([
    ...VERBOS.map((e) => perguntaPalavra(e, "tempo")),
    ...pick(VERBAIS, 4).map((e) => perguntaPalavra(e, "lema")),
    ...pick(TAPS.filter((t) => t.tipo === "verbo"), 2),
    ...pick(doTema("verbos"), 9).map(manual),
  ]),

  autos: () => shuffle([
    ...AUTOS.map((e) => perguntaPalavra(e, "caso")),
    ...AUTOS.map((e) => perguntaPalavra(e, "fn")),
    ...doTema("autos").map(manual),
  ]),

  vocab: () => pick(LEXICO, 16).map((l, i) => vocab(l, i % 2 ? "pt" : "gr")),

  trad: () => pick(ORACOES, 12).map(({ v, o }) => ordem(v, o)),

  simulado: () => shuffle([
    ...pick(doTema("regras"), 5).map(manual),
    ...pick(MANUAIS.filter((q) => q.v), 4).map(manual),
    ...pick(TODAS, 7).map((e) => perguntaPalavra(e)),
    ...pick(TAPS, 3),
    ...pick(ORACOES, 3).map(({ v, o }) => ordem(v, o)),
    ...pick(LOCUCOES, 1).map((l) => locucao(l)),
    ...pick(LEXICO, 2).map((l) => vocab(l)),
  ]),
};

export function montarSessao(id) {
  const verso = /^v(\d+)$/.exec(id);
  const fila = verso ? sessaoVerso(VERSOS[verso[1] - 1]) : (TEMAS[id] || TEMAS.simulado)();
  return fila.map((q, n) => ({ ...q, id: n }));
}

export const SECOES = {
  simulado: { id: "simulado", nome: "Simulado geral", glifo: "Ω",
              desc: "25 questões sorteadas de todo o conteúdo" },
  versos: VERSOS.map((v) => ({ id: "v" + v.n, nome: `João 1:${v.n}`, glifo: String(v.n), desc: v.gr })),
  temas: [
    { id: "regras", nome: "Regras de análise", glifo: "§",
      desc: "os quatro passos e as observações finais do professor" },
    { id: "casos", nome: "Casos e funções", glifo: "τῷ",
      desc: "sujeito, objeto direto, posse e complemento — pela terminação" },
    { id: "prep", nome: "Preposições", glifo: "ἐν",
      desc: "ἐν, πρός, διά, χωρίς, παρά, εἰς, περί e o caso que cada uma pede" },
    { id: "verbos", nome: "Verbos e tempos", glifo: "ἦν",
      desc: "imperfeito × aoristo, depoentes, presente, perfeito e subjuntivo" },
    { id: "autos", nome: "O pronome αὐτός", glifo: "αὐ",
      desc: "αὐτοῦ, αὐτῷ, αὐτόν, αὐτό — posse, objeto indireto e direto" },
    { id: "vocab", nome: "Vocabulário", glifo: "φῶς",
      desc: `${LEXICO.length} palavras do texto, do grego ao português e de volta` },
    { id: "trad", nome: "Tradução", glifo: "→",
      desc: "monte a tradução de cada oração, peça por peça" },
  ],
};

export const TODAS_SECOES = [SECOES.simulado, ...SECOES.versos, ...SECOES.temas];
export const nomeSecao = (id) => (TODAS_SECOES.find((s) => s.id === id) || SECOES.simulado).nome;
