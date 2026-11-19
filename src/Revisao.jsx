import { useRef, useState } from "react";
import { SECOES, montarSessao, nomeSecao } from "./revisaoJo1";

// ---------------------------------------------------------------------------
// Revisão para a prova: João 1:1-10.
// RevisaoHub lista as seções; RevisaoSessao roda uma rodada em tela cheia.
// ---------------------------------------------------------------------------

function Linha({ s, rev, onStart, grego }) {
  const r = rev[s.id];
  return (
    <button className="rvrow" onClick={() => onStart(s.id)}>
      <span className="rvg gr">{s.glifo}</span>
      <span className="rvb">
        <b>{s.nome}</b>
        <small className={grego ? "gr" : "wrap"}>{s.desc}</small>
      </span>
      <span className={"rvnota" + (r ? "" : " vazio")}>{r ? `${r.melhor}%` : "novo"}</span>
    </button>
  );
}

export function RevisaoHub({ rev = {}, onStart, onBack }) {
  return (
    <section className="view">
      <button className="backlink" onClick={onBack}>‹ Estudar</button>
      <h1 className="modtitle">Revisão para a prova</h1>
      <p className="dim mb">
        João 1:1-10, conforme a análise enviada pelo professor. Cada seção mostra
        o seu melhor resultado.
      </p>

      <button className="cont" onClick={() => onStart(SECOES.simulado.id)}>
        <span className="g">{SECOES.simulado.glifo}</span>
        <span>
          <b>{SECOES.simulado.nome}</b>
          <small>
            {SECOES.simulado.desc}
            {rev.simulado ? ` · melhor: ${rev.simulado.melhor}%` : ""}
          </small>
        </span>
      </button>

      <h2 className="sec">Versículo por versículo</h2>
      {SECOES.versos.map((s) => <Linha key={s.id} s={s} rev={rev} onStart={onStart} grego />)}

      <h2 className="sec">Por tema</h2>
      {SECOES.temas.map((s) => <Linha key={s.id} s={s} rev={rev} onStart={onStart} />)}
    </section>
  );
}

const igual = (a, b) => a.join(" ").toLowerCase() === b.join(" ").toLowerCase();

// o enunciado de cada tipo de questão, sem o rodapé
export function Corpo({ q, verd, picked, sel, onPick, onSel }) {
  const cabeca = (
    <>
      <div className="anref">{q.ref}</div>
      <div className="ask">{q.ask}</div>
    </>
  );

  if (q.k === "tap") {
    return (
      <>
        {cabeca}
        <div className="anverso">
          {q.w.map((p, k) => {
            let cls = "anw gr";
            if (verd) {
              if (q.certos.includes(k)) cls += " certo";
              else if (k === picked) cls += " errado";
            }
            return (
              <button key={k} className={cls} disabled={!!verd} onClick={() => onPick(k)}>{p}</button>
            );
          })}
        </div>
        <p className="dim">Dica: {q.dica}.</p>
      </>
    );
  }

  if (q.k === "ordem") {
    return (
      <>
        {cabeca}
        <div className="rvctx gr">{q.gr}</div>
        <div className={"rvlinha" + (verd ? (verd.ok ? " ok" : " bad") : "")}>
          {sel.map((t) => (
            <button key={t} className="rvtile" disabled={!!verd}
              onClick={() => onSel(sel.filter((x) => x !== t))}>{q.banco[t]}</button>
          ))}
        </div>
        <div className="rvbanco">
          {q.banco.map((p, t) => (
            <button key={t} className={"rvtile" + (sel.includes(t) ? " usada" : "")}
              disabled={sel.includes(t) || !!verd}
              onClick={() => onSel([...sel, t])}>{p}</button>
          ))}
        </div>
      </>
    );
  }

  return (
    <>
      {cabeca}
      {q.ctx && (
        <div className="rvctx gr">
          {q.ctx.w.map((p, k) => (
            <span key={k}>
              <span className={q.ctx.alvo.includes(k) ? "alvo" : ""}>{p}</span>{" "}
            </span>
          ))}
        </div>
      )}
      {q.show && <div className="rvshow gr">{q.show}</div>}
      {q.txt && <div className="rvtxt">{q.txt}</div>}
      <div className="opts">
        {q.opts.map((o) => {
          let cls = "opt" + (q.gk ? " gk" : "");
          if (verd) {
            if (o === q.a) cls += " right";
            else if (o === picked) cls += " wrong";
            else cls += " dim";
          }
          return (
            <button key={o} className={cls} disabled={!!verd} onClick={() => onPick(o)}>{o}</button>
          );
        })}
      </div>
    </>
  );
}

function resposta(q) {
  if (q.k === "tap") return q.certos.map((k) => q.w[k]).join(" ");
  if (q.k === "ordem") return q.a.join(" ");
  return q.a;
}

export function RevisaoSessao({ secao, onFinish, onAgain, onQuit }) {
  const [fila, setFila] = useState(() => montarSessao(secao));
  const total = useRef(fila.length).current;
  const [i, setI] = useState(0);
  const [verd, setVerd] = useState(null);     // { ok }
  const [picked, setPicked] = useState(null); // opção escolhida ou índice tocado
  const [sel, setSel] = useState([]);         // peças da tradução, na ordem escolhida
  const [errados, setErrados] = useState(() => new Set());
  const [fim, setFim] = useState(false);

  const q = fila[i];

  function julgar(ok) {
    if (!ok) {
      setErrados((s) => new Set(s).add(q.id));
      setFila((f) => [...f, q]);              // o erro volta ao fim da fila
    }
    setVerd({ ok });
  }

  function escolher(valor) {
    if (verd) return;
    setPicked(valor);
    julgar(q.k === "tap" ? q.certos.includes(valor) : valor === q.a);
  }

  function avancar() {
    setVerd(null); setPicked(null); setSel([]);
    if (i + 1 >= fila.length) {
      setFim(true);
      onFinish(secao, total, errados.size);
    } else setI(i + 1);
  }

  if (fim) {
    const certas = total - errados.size;
    const pct = Math.round((certas / total) * 100);
    return (
      <div className="lesson">
        <div className="ltop"><button className="x" onClick={onQuit}>✕</button>
          <div className="lbar"><i style={{ width: "100%" }} /></div></div>
        <div className="finish">
          <div className="ring">{pct === 100 ? "Ω" : "✓"}</div>
          <h2>{pct}%</h2>
          <p className="dim">
            {nomeSecao(secao)} · {certas} de {total} na primeira tentativa
          </p>
          <p className="dim">
            {pct === 100
              ? "Rodada limpa. Cada rodada sorteia perguntas diferentes — vale repetir."
              : "O que você errou voltou no fim da fila. Repita a seção até fechar em 100%."}
          </p>
        </div>
        <div className="foot">
          <button className="go" onClick={onAgain}>Nova rodada</button>
          <button className="go ghost" onClick={onQuit}>Voltar à revisão</button>
        </div>
      </div>
    );
  }

  if (!q) return null;

  let foot;
  if (verd) {
    foot = (
      <div className={"foot " + (verd.ok ? "ok" : "bad")}>
        <div className={"verd " + (verd.ok ? "ok" : "bad")}>{verd.ok ? "Certo!" : "Quase lá"}</div>
        <div className="why">
          {!verd.ok && <span className="rvresp">Resposta: {resposta(q)}</span>}
          {q.nota && <span>{q.nota}</span>}
        </div>
        <button className={"go " + (verd.ok ? "okb" : "badb")} onClick={avancar}>Continuar</button>
      </div>
    );
  } else if (q.k === "ordem") {
    foot = (
      <div className="foot">
        <button className={"go" + (sel.length ? "" : " mute")}
          onClick={() => sel.length && julgar(igual(sel.map((t) => q.banco[t]), q.a))}>
          Conferir
        </button>
      </div>
    );
  } else {
    foot = (
      <div className="foot">
        <button className="go mute">
          {q.k === "tap" ? "Toque numa palavra da oração" : "Escolha uma opção"}
        </button>
      </div>
    );
  }

  return (
    <div className="lesson">
      <div className="ltop">
        <button className="x" onClick={onQuit}>✕</button>
        <div className="lbar"><i style={{ width: `${(i / fila.length) * 100}%` }} /></div>
        <span className="qcount">{Math.min(i + 1, total)}/{total}</span>
      </div>
      <div className="lbody">
        <Corpo q={q} verd={verd} picked={picked} sel={sel} onPick={escolher} onSel={setSel} />
      </div>
      {foot}
    </div>
  );
}
