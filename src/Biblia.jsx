import { useEffect, useMemo, useState } from "react";
import { analisar, translit } from "./morfologia";
import { pronuncia } from "./fonetica";
import { falar } from "./speech";

const b36 = (s) => parseInt(s, 36);
const marcas = /[\u2E00-\u2E7F]/g;   // sinais editoriais do aparato
const semMarcas = (p) => p.replace(marcas, "");
const limpar = (p) => p.replace(marcas, "").replace(/[·,.;:!?"“”«»()\[\]—–]/g, "").replace(/ʼ/g, "");

export default function Biblia({ voice = true, estudados = new Set() }) {
  const [nt, setNt] = useState(null);
  const [mf, setMf] = useState(null);
  const [erro, setErro] = useState(false);
  const [livro, setLivro] = useState(null);
  const [cap, setCap] = useState(null);
  const [ap, setAp] = useState(null);
  const [sel, setSel] = useState(null);   // { vKey, i, tokens }
  const [variante, setVariante] = useState(null);
  const [busca, setBusca] = useState(null);      // null = leitura; string = tela de busca
  const [termo, setTermo] = useState("");
  const [fonte, setFonte] = useState(() => {
    try { return Number(localStorage.getItem("koine:fonte")) || 18; } catch { return 18; }
  });
  const mudarFonte = (d) => setFonte((f) => {
    const n = Math.min(26, Math.max(14, f + d));
    try { localStorage.setItem("koine:fonte", String(n)); } catch {}
    return n;
  });

  useEffect(() => {
    const carregar = async () => {
      try {
        if (typeof window !== "undefined" && window.__NT__) {
          setNt(window.__NT__); setMf(window.__MORF__ || null); setAp(window.__AP__ || null); return;
        }
        const [a, b, c] = await Promise.all([
          import("./nt.json"), import("./morf.json"), import("./aparato.json"),
        ]);
        setNt(a.default); setMf(b.default); setAp(c.default);
      } catch { setErro(true); }
    };
    carregar();
  }, []);

  // tokens analisados de um versículo
  const tokensDe = useMemo(() => (vKey) => {
    if (!mf || !mf.v[vKey]) return null;
    return mf.v[vKey].split(" ").map((t) => {
      const [l, c] = t.split(".");
      return { lema: b36(l), cod: b36(c) };
    });
  }, [mf]);

  // percentual de palavras do capítulo que o app traduz
  const legibilidade = (bi, ci) => {
    if (!mf || !nt) return null;
    let tot = 0, com = 0;
    for (const [num] of nt[bi].c[ci]) {
      const bruto = mf.v[`${bi}.${ci + 1}.${num}`];
      if (!bruto) continue;
      for (const t of bruto.split(" ")) {
        tot++;
        if (mf.glosas[b36(t.split(".")[0])]) com++;
      }
    }
    return tot ? Math.round((com / tot) * 100) : null;
  };

  if (erro) return <section className="view"><p className="dim">Não consegui carregar o texto.</p></section>;
  if (!nt) return <section className="view"><p className="dim center pad">Carregando o Novo Testamento…</p></section>;

  if (busca !== null) {
    const alvo = termo.trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    let achados = [];
    if (alvo.length >= 2 && mf) {
      // se o termo casar com uma glosa ou um lema, busca por lema; senão, pelo texto
      const porLema = mf.lemas.findIndex((l, k) =>
        l.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").startsWith(alvo) ||
        (mf.glosas[k] || "").toLowerCase().startsWith(alvo));
      for (let bi = 0; bi < nt.length && achados.length < 60; bi++) {
        for (let ci = 0; ci < nt[bi].c.length && achados.length < 60; ci++) {
          for (const [num, texto] of nt[bi].c[ci]) {
            if (achados.length >= 60) break;
            let bate = false;
            if (porLema >= 0) {
              const bruto = mf.v[`${bi}.${ci + 1}.${num}`];
              bate = bruto && bruto.split(" ").some((t) => b36(t.split(".")[0]) === porLema);
            }
            if (!bate) {
              const plano = texto.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
              bate = plano.includes(alvo);
            }
            if (bate) achados.push({ bi, ci, num, texto });
          }
        }
      }
    }
    return (
      <section className="view">
        <button className="backlink" onClick={() => { setBusca(null); setTermo(""); }}>‹ Livros</button>
        <h1 className="modtitle">Buscar</h1>
        <input
          className="search" autoFocus value={termo} onChange={(e) => setTermo(e.target.value)}
          placeholder="palavra grega ou tradução…" autoComplete="off" autoCapitalize="off"
        />
        <p className="hint" style={{ textAlign: "left" }}>
          Aceita grego com ou sem acento, e também português: buscar “glória” encontra
          as ocorrências de <span className="gr">δόξα</span>.
        </p>
        {alvo.length >= 2 && (
          <p className="dim mb">{achados.length}{achados.length === 60 ? "+" : ""} resultado(s)</p>
        )}
        {achados.map((a, k) => (
          <button className="resultado" key={k}
            onClick={() => { setBusca(null); setLivro(a.bi); setCap(a.ci); window.scrollTo(0, 0); }}>
            <b>{nt[a.bi].n} {a.ci + 1}:{a.num}</b>
            <span className="gr">{semMarcas(a.texto)}</span>
          </button>
        ))}
      </section>
    );
  }

  if (livro === null) {
    return (
      <section className="view">
        <p className="dim mb">
          Texto grego do <b>SBL Greek New Testament</b>, com análise morfológica.
          Toque em qualquer palavra para ver lema, análise e ocorrências. O losango
          ao lado do versículo abre o aparato crítico.
        </p>
        <button className="buscabtn" onClick={() => setBusca("")}>🔍 Buscar no Novo Testamento</button>
        <div className="books">
          {nt.map((l, i) => (
            <button className="book" key={l.id} onClick={() => { setLivro(i); setCap(null); }}>
              <b>{l.n}</b><small>{l.c.length} cap.</small>
            </button>
          ))}
        </div>
        <Credito />
      </section>
    );
  }

  const L = nt[livro];

  if (cap === null) {
    return (
      <section className="view">
        <button className="backlink" onClick={() => setLivro(null)}>‹ Livros</button>
        <h1 className="modtitle">{L.n}</h1>
        <p className="dim mb">{L.c.length} capítulos</p>
        <div className="caps">
          {L.c.map((_, i) => {
            const leg = legibilidade(livro, i);
            return (
              <button className="capbtn" key={i} onClick={() => { setCap(i); window.scrollTo(0, 0); }}>
                <span>{i + 1}</span>
                {leg !== null && <em style={{ opacity: 0.25 + leg / 160 }}>{leg}%</em>}
              </button>
            );
          })}
        </div>
        <p className="hint">
          A porcentagem indica quantas palavras do capítulo o app traduz. Comece pelos
          números mais altos — é assim que a leitura deixa de ser decifração.
        </p>
      </section>
    );
  }

  return (
    <section className="view">
      <button className="backlink" onClick={() => { setCap(null); setSel(null); }}>‹ {L.n}</button>
      <div className="caphead">
        <h1 className="modtitle">{L.n} {cap + 1}</h1>
        <div className="fonte">
          <button onClick={() => mudarFonte(-2)} aria-label="Diminuir">A−</button>
          <button onClick={() => mudarFonte(2)} aria-label="Aumentar">A+</button>
        </div>
      </div>

      <div className="chapter" style={{ fontSize: fonte }}>
        {L.c[cap].map(([num, texto]) => {
          const vKey = `${livro}.${cap + 1}.${num}`;
          const toks = tokensDe(vKey);
          const palavras = texto.split(/\s+/).filter(Boolean);
          const alinhado = toks && toks.length === palavras.length;
          const vars = ap && ap[vKey];
          return (
            <p className="verse" key={num}>
              <span className="vnum">{num}</span>
              {vars && (
                <button className="apmark" onClick={() => setVariante({ vKey, num, vars })}
                  title="variantes textuais">◆</button>
              )}
              {palavras.map((p, k) => {
                const lema = alinhado ? mf.lemas[toks[k].lema] : null;
                const visto = lema && estudados.has(lema);
                return (
                <span
                  key={k}
                  className={"vw gr" + (visto ? " known" : "")}
                  onClick={() => alinhado && setSel({ vKey, i: k, palavras, toks })}
                >
                  {semMarcas(p)}{" "}
                </span>);
              })}
            </p>
          );
        })}
      </div>

      <div className="navcap">
        {cap > 0 && <button className="btn soft" onClick={() => { setCap(cap - 1); window.scrollTo(0, 0); }}>‹ Anterior</button>}
        {cap < L.c.length - 1 && <button className="btn soft" onClick={() => { setCap(cap + 1); window.scrollTo(0, 0); }}>Próximo ›</button>}
      </div>

      <Credito />

      {sel && <Painel sel={sel} setSel={setSel} mf={mf} voice={voice} />}
      {variante && (
        <Aparato dados={variante} livro={L.n} cap={cap + 1} onClose={() => setVariante(null)} />
      )}
    </section>
  );
}

function Painel({ sel, setSel, mf, voice }) {
  const { palavras, toks, i } = sel;
  const t = toks[i];
  const lema = mf.lemas[t.lema];
  const glosa = mf.glosas[t.lema];
  const contagem = mf.freq[t.lema];
  const forma = limpar(palavras[i]);
  const fon = pronuncia(forma);
  const fonLema = pronuncia(lema);
  const partes = analisar(mf.codigos[t.cod]);
  const mover = (d) => {
    const j = i + d;
    if (j >= 0 && j < palavras.length) setSel({ ...sel, i: j });
  };

  return (
    <>
      <div className="veil" onClick={() => setSel(null)} />
      <div className="sheet">
        <div className="grab" />
        <div className="wi-tit">Informação de palavra</div>

        <div className="wi-forma">
          <span className="gr">{forma}</span>
          <i>{translit(forma)}</i>
          <button className="ouvir" onClick={() => falar(fon, voice)}>
            🔊 Ouvir <span className="fon">{fon}</span>
          </button>
        </div>

        <div className="wi-linha">
          <span className="wi-rot">Lema</span>
          <span className="wi-val">
            <b className="gr">{lema}</b> <i>{translit(lema)}</i>
            <button className="ouvir mini" onClick={() => falar(fonLema, voice)}>🔊</button>
            {glosa && <span className="wi-glosa">{glosa}</span>}
          </span>
        </div>

        <div className="wi-linha">
          <span className="wi-rot">Morfologia</span>
          <span className="wi-val wi-morf">
            {partes.map((p, k) => <span className="wi-tag" key={k}>{p}</span>)}
          </span>
        </div>

        <div className="wi-linha">
          <span className="wi-rot">Ocorrências</span>
          <span className="wi-val">
            {contagem.toLocaleString("pt-BR")} {contagem === 1 ? "ocorrência" : "ocorrências"} no NT
          </span>
        </div>

        <p className="hint fonnota">
          Pronúncia figurada em português, seguindo o grego clássico das fichas — é
          esse texto que a voz do aparelho lê. Se a voz soar mecânica, baixe a versão
          aprimorada em Ajustes › Acessibilidade › Conteúdo Falado › Vozes › Português.
        </p>

        {!glosa && (
          <p className="hint">
            Sem tradução no glossário do app, que cobre os 300 lemas mais frequentes.
            A análise e a contagem acima valem para qualquer palavra.
          </p>
        )}

        <div className="wi-nav">
          <button className="wi-arrow" onClick={() => mover(-1)} disabled={i === 0}>‹</button>
          <span className="gr wi-ctx">{semMarcas(palavras[i])}</span>
          <button className="wi-arrow" onClick={() => mover(1)} disabled={i === palavras.length - 1}>›</button>
        </div>

        <button className="btn soft" onClick={() => setSel(null)}>Fechar</button>
      </div>
    </>
  );
}

const SIGLAS = [
  ["WH", "Westcott e Hort, 1881"],
  ["Treg", "Tregelles, 1857–1879"],
  ["NA28", "Nestle-Aland, 28ª edição"],
  ["RP", "Robinson e Pierpont, texto bizantino, 2005"],
  ["NIV", "texto grego por trás da New International Version"],
];

function Aparato({ dados, livro, cap, onClose }) {
  return (
    <>
      <div className="veil" onClick={onClose} />
      <div className="sheet">
        <div className="grab" />
        <div className="wi-tit">Aparato crítico</div>
        <h3>{livro} {cap}:{dados.num}</h3>
        <p className="dim mb">
          À esquerda do colchete, a leitura adotada pelo SBLGNT e as edições que a
          trazem. À direita, as leituras concorrentes.
        </p>

        {dados.vars.map((v, k) => {
          const [esq, dir] = v.split("]");
          return (
            <div className="apunit" key={k}>
              <div className="apside">
                <span className="apbadge adotada">adotada</span>
                <span className="gr">{esq.trim()}</span>
              </div>
              {dir && (
                <div className="apside">
                  <span className="apbadge">variante</span>
                  <span className="gr">{dir.trim()}</span>
                </div>
              )}
            </div>
          );
        })}

        <h2 className="sec">Siglas</h2>
        {SIGLAS.map(([s, d]) => (
          <div className="apsigla" key={s}><b>{s}</b><span>{d}</span></div>
        ))}
        <p className="hint">
          O sinal + indica acréscimo na outra leitura; – indica omissão.
        </p>

        <button className="btn soft" onClick={onClose}>Fechar</button>
      </div>
    </>
  );
}

function Credito() {
  return (
    <p className="credito">
      SBL Greek New Testament (SBLGNT) © 2010 Society of Biblical Literature e Logos
      Bible Software, licença CC BY 4.0, texto e aparato editados por Michael W. Holmes.
      Análise morfológica: MorphGNT: SBLGNT Edition, ed. J. K. Tauber, licença CC BY-SA 3.0.
    </p>
  );
}
