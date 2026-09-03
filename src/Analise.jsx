import { useEffect, useMemo, useState } from "react";
import { analisar } from "./morfologia";
import { pronuncia } from "./fonetica";
import { falar } from "./speech";

const b36 = (s) => parseInt(s, 36);
const marcas = /[\u2E00-\u2E7F]/g;   // sinais editoriais do aparato
const semMarcas = (p) => p.replace(marcas, "");
const limpar = (p) => p.replace(marcas, "").replace(/[·,.;:!?"“”«»()\[\]—–]/g, "").replace(/ʼ/g, "");

const CASOS = {
  N: ["nominativo", "quem pratica a ação — o sujeito"],
  G: ["genitivo", "a quem algo pertence — o “de”"],
  D: ["dativo", "a quem a ação se dirige — o objeto indireto"],
  A: ["acusativo", "o que sofre a ação — o objeto direto"],
};

// escolhe versículos curtos e com vocabulário conhecido
function montarRodada(nt, mf, n = 8) {
  const bons = [];
  for (let bi = 0; bi < nt.length; bi++) {
    const L = nt[bi];
    for (let ci = 0; ci < L.c.length; ci++) {
      for (const [num, texto] of L.c[ci]) {
        const chave = `${bi}.${ci + 1}.${num}`;
        const bruto = mf.v[chave];
        if (!bruto) continue;
        const toks = bruto.split(" ").map((t) => {
          const [l, c] = t.split(".");
          return { lema: b36(l), cod: b36(c) };
        });
        const palavras = texto.split(/\s+/).filter(Boolean);
        if (toks.length !== palavras.length) continue;
        if (palavras.length < 4 || palavras.length > 11) continue;
        const comGlosa = toks.filter((t) => mf.glosas[t.lema]).length;
        if (comGlosa / toks.length < 0.75) continue;

        const casos = {};
        toks.forEach((t, i) => {
          const cod = mf.codigos[t.cod];
          const caso = cod[6];                       // 5ª posição da análise
          if (CASOS[caso]) (casos[caso] ||= []).push(i);
        });
        const disponiveis = Object.keys(casos);
        if (disponiveis.length < 2) continue;
        bons.push({ bi, ci, num, ref: `${L.n} ${ci + 1}:${num}`, palavras, toks, casos, disponiveis });
      }
    }
  }
  const sorteados = bons.sort(() => Math.random() - 0.5).slice(0, n);
  return sorteados.map((v) => {
    const caso = v.disponiveis[Math.floor(Math.random() * v.disponiveis.length)];
    return { ...v, caso };
  });
}

export default function Analise({ voice, onClose }) {
  const [nt, setNt] = useState(null);
  const [mf, setMf] = useState(null);
  const [rodada, setRodada] = useState(null);
  const [i, setI] = useState(0);
  const [tocou, setTocou] = useState(null);
  const [acertos, setAcertos] = useState(0);

  useEffect(() => {
    const carregar = async () => {
      if (typeof window !== "undefined" && window.__NT__) {
        setNt(window.__NT__); setMf(window.__MORF__); return;
      }
      const [a, b] = await Promise.all([import("./nt.json"), import("./morf.json")]);
      setNt(a.default); setMf(b.default);
    };
    carregar();
  }, []);

  useEffect(() => {
    if (nt && mf && !rodada) setRodada(montarRodada(nt, mf));
  }, [nt, mf, rodada]);

  if (!rodada) {
    return (
      <div className="lesson">
        <div className="ltop"><button className="x" onClick={onClose}>✕</button>
          <div className="lbar"><i style={{ width: "0%" }} /></div></div>
        <p className="dim center pad">Escolhendo versículos…</p>
      </div>
    );
  }

  if (i >= rodada.length) {
    return (
      <div className="lesson">
        <div className="ltop"><button className="x" onClick={onClose}>✕</button>
          <div className="lbar"><i style={{ width: "100%" }} /></div></div>
        <div className="finish">
          <div className="ring">Ω</div>
          <h2>{acertos} de {rodada.length}</h2>
          <p className="dim">
            {acertos === rodada.length
              ? "Você está lendo a função pela forma. É esse o objetivo."
              : "Repare sempre no artigo: ele muda junto com o substantivo."}
          </p>
        </div>
        <div className="foot">
          <button className="go" onClick={() => { setRodada(null); setI(0); setAcertos(0); setTocou(null); }}>
            Nova rodada
          </button>
          <button className="go mute" style={{ marginTop: 8, background: "transparent" }} onClick={onClose}>
            Voltar
          </button>
        </div>
      </div>
    );
  }

  const q = rodada[i];
  const [nome, funcao] = CASOS[q.caso];
  const certos = q.casos[q.caso];
  const acertou = tocou !== null && certos.includes(tocou);

  const tocar = (k) => {
    if (tocou !== null) return;
    setTocou(k);
    if (certos.includes(k)) setAcertos((a) => a + 1);
  };

  const avancar = () => { setTocou(null); setI(i + 1); };

  const infoDe = (k) => {
    const t = q.toks[k];
    return {
      lema: mf.lemas[t.lema],
      glosa: mf.glosas[t.lema],
      partes: analisar(mf.codigos[t.cod]),
    };
  };

  return (
    <div className="lesson">
      <div className="ltop">
        <button className="x" onClick={onClose}>✕</button>
        <div className="lbar"><i style={{ width: `${(i / rodada.length) * 100}%` }} /></div>
        <span className="qcount">{i + 1}/{rodada.length}</span>
      </div>

      <div className="lbody">
        <div className="anref">{q.ref}</div>
        <div className="anverso">
          {q.palavras.map((p, k) => {
            let cls = "anw gr";
            if (tocou !== null) {
              if (certos.includes(k)) cls += " certo";
              else if (k === tocou) cls += " errado";
            }
            return <button key={k} className={cls} onClick={() => tocar(k)}>{semMarcas(p)}</button>;
          })}
        </div>

        <p className="anpergunta">
          Toque na palavra que está no <b>{nome}</b>.
          <span className="dim"> {funcao}.</span>
        </p>

        {tocou !== null && (
          <div className={"anwhy " + (acertou ? "ok" : "bad")}>
            <b>{acertou ? "Isso mesmo." : "Essa não."}</b>
            <p>
              <span className="gr">{limpar(q.palavras[tocou])}</span> é{" "}
              {infoDe(tocou).partes.join(", ")}
              {infoDe(tocou).glosa ? ` — ${infoDe(tocou).glosa}` : ""}.
            </p>
            {!acertou && (
              <p>
                No {nome} está{" "}
                {certos.map((k) => (
                  <span key={k}><span className="gr">{limpar(q.palavras[k])}</span>{" "}</span>
                ))}
                {certos.length > 1 ? "— artigo e substantivo concordam." : "."}
              </p>
            )}
            <button className="ouvir" onClick={() => falar(pronuncia(limpar(q.palavras[certos[0]])), voice)}>
              🔊 Ouvir
            </button>
          </div>
        )}
      </div>

      <div className={"foot" + (tocou !== null ? (acertou ? " ok" : " bad") : "")}>
        {tocou !== null
          ? <button className={"go " + (acertou ? "okb" : "badb")} onClick={avancar}>Continuar</button>
          : <button className="go mute">Toque numa palavra do versículo</button>}
      </div>
    </div>
  );
}
