import { useEffect, useMemo, useState } from "react";
import { analisar, translit } from "./morfologia";

const b36 = (s) => parseInt(s, 36);
const limpar = (p) => p.replace(/[·,.;:!?"“”«»()\[\]—–]/g, "").replace(/ʼ/g, "");

export default function Biblia() {
  const [nt, setNt] = useState(null);
  const [mf, setMf] = useState(null);
  const [erro, setErro] = useState(false);
  const [livro, setLivro] = useState(null);
  const [cap, setCap] = useState(null);
  const [ap, setAp] = useState(null);
  const [sel, setSel] = useState(null);   // { vKey, i, tokens }
  const [variante, setVariante] = useState(null);

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

  if (erro) return <section className="view"><p className="dim">Não consegui carregar o texto.</p></section>;
  if (!nt) return <section className="view"><p className="dim center pad">Carregando o Novo Testamento…</p></section>;

  if (livro === null) {
    return (
      <section className="view">
        <p className="dim mb">
          Texto grego do <b>SBL Greek New Testament</b>, com análise morfológica.
          Toque em qualquer palavra para ver lema, análise e ocorrências. O losango
          ao lado do versículo abre o aparato crítico.
        </p>
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
          {L.c.map((_, i) => (
            <button className="capbtn" key={i} onClick={() => { setCap(i); window.scrollTo(0, 0); }}>{i + 1}</button>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="view">
      <button className="backlink" onClick={() => { setCap(null); setSel(null); }}>‹ {L.n}</button>
      <h1 className="modtitle">{L.n} {cap + 1}</h1>

      <div className="chapter">
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
              {palavras.map((p, k) => (
                <span
                  key={k}
                  className={"vw gr" + (alinhado ? " known" : "")}
                  onClick={() => alinhado && setSel({ vKey, i: k, palavras, toks })}
                >
                  {p}{" "}
                </span>
              ))}
            </p>
          );
        })}
      </div>

      <div className="navcap">
        {cap > 0 && <button className="btn soft" onClick={() => { setCap(cap - 1); window.scrollTo(0, 0); }}>‹ Anterior</button>}
        {cap < L.c.length - 1 && <button className="btn soft" onClick={() => { setCap(cap + 1); window.scrollTo(0, 0); }}>Próximo ›</button>}
      </div>

      <Credito />

      {sel && <Painel sel={sel} setSel={setSel} mf={mf} />}
      {variante && (
        <Aparato dados={variante} livro={L.n} cap={cap + 1} onClose={() => setVariante(null)} />
      )}
    </section>
  );
}

function Painel({ sel, setSel, mf }) {
  const { palavras, toks, i } = sel;
  const t = toks[i];
  const lema = mf.lemas[t.lema];
  const glosa = mf.glosas[t.lema];
  const contagem = mf.freq[t.lema];
  const forma = limpar(palavras[i]);
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
        </div>

        <div className="wi-linha">
          <span className="wi-rot">Lema</span>
          <span className="wi-val">
            <b className="gr">{lema}</b> <i>{translit(lema)}</i>
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
          <span className="wi-rot">Contagem</span>
          <span className="wi-val">
            {contagem.toLocaleString("pt-BR")} {contagem === 1 ? "ocorrência" : "ocorrências"} no NT
          </span>
        </div>

        {!glosa && (
          <p className="hint">
            Sem tradução no glossário do app, que cobre os 300 lemas mais frequentes.
            A análise e a contagem acima valem para qualquer palavra.
          </p>
        )}

        <div className="wi-nav">
          <button className="wi-arrow" onClick={() => mover(-1)} disabled={i === 0}>‹</button>
          <span className="gr wi-ctx">{palavras[i]}</span>
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
