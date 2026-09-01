import { useEffect, useMemo, useRef, useState } from "react";
import { buildLesson, buildReview, spoken, norm, NAMEALT, LESSONS } from "./data";
import { falar } from "./speech";

export default function Lesson({
  task, lesson, voice, onQuit, onFinish, taskWasFull,
  review = false, pool = [], stats = {}, onAnswer,
}) {
  const [queue, setQueue] = useState(() =>
    review ? buildReview(pool, stats) : buildLesson(task, lesson));

  const [i, setI] = useState(0);
  const [verdict, setVerdict] = useState(null); // { ok, why }
  const [picked, setPicked] = useState(null);
  const [typed, setTyped] = useState("");
  const [hint, setHint] = useState(null);
  const [errors, setErrors] = useState(0);
  const [over, setOver] = useState(false);
  const inputRef = useRef(null);
  const totalInicial = useRef(0);
  if (totalInicial.current === 0 && queue.length) totalInicial.current = queue.length;

  const q = queue[i];
  const total = Math.max(queue.length, 1);

  // fala o nome da letra ao abrir cada questão
  useEffect(() => {
    if (!q || over) return;
    if (q.k === "intro" || q.k === "hear" || q.k === "mc" || q.k === "word")
      falar(spoken(q.L), voice);
    if (q.k === "type") setTimeout(() => inputRef.current?.focus(), 250);
  }, [i, over]); // eslint-disable-line react-hooks/exhaustive-deps

  function judge(ok, why) {
    if (review) onAnswer?.(q.L.i, ok);
    if (!ok) {
      setErrors((e) => e + 1);
      setQueue((s) => [...s, q]); // erro volta ao fim da fila
      falar(spoken(q.L), voice);
    }
    setVerdict({ ok, why });
  }

  function advance() {
    const next = i + 1;
    setVerdict(null); setPicked(null); setTyped(""); setHint(null);
    if (next >= queue.length) {
      setOver(true);
      onFinish(review ? { total: totalInicial.current, wrong: errors } : null, task, lesson, errors);
    }
    else setI(next);
  }

  function choose(option) {
    if (verdict) return;
    setPicked(option);
    judge(option === q.a, option === q.a ? "" : `Resposta: ${q.a}`);
  }

  function checkTyped() {
    const v = norm(typed);
    if (!v) return;
    const ok =
      v === norm(q.L.n) ||
      (NAMEALT[q.L.n] || []).includes(v) ||
      v === norm(spoken(q.L));
    if (!ok && (v === norm(q.L.t) || q.L.alt.some((x) => norm(x) === v))) {
      setHint("Isso é a transliteração. Aqui vale o nome da letra — tente de novo.");
      setTyped("");
      inputRef.current?.focus();
      return;
    }
    inputRef.current?.blur();
    judge(ok, ok ? "" : `Esta letra chama-se “${q.L.n}”`);
  }

  // ------------------------------------------------------------------ fim
  if (over && review) return null;

  if (over) {
    const full = taskWasFull;
    return (
      <div className="lesson">
        <div className="ltop"><button className="x" onClick={onQuit}>✕</button>
          <div className="lbar"><i style={{ width: "100%" }} /></div></div>
        <div className="finish">
          <div className="ring">{full ? "Ω" : "✓"}</div>
          <h2>{full ? `Tarefa ${task + 1} concluída` : "Lição concluída"}</h2>
          <p className="dim">
            {full
              ? "As três letras estão dominadas. A próxima tarefa foi liberada."
              : `${LESSONS[lesson].n} · ${errors} ${errors === 1 ? "erro" : "erros"}`}
          </p>
        </div>
        <div className="foot">
          <button className="go" onClick={onQuit}>Continuar</button>
        </div>
      </div>
    );
  }

  if (!q) return null;

  // ------------------------------------------------------------- conteúdo
  let body = null;

  if (q.k === "intro") {
    body = (
      <div className="big">
        <div className="g">{q.L.l}{q.L.i === 17 && <span className="sigmaFinal"> ς</span>}</div>
        <div className="nm">{q.L.n}</div>
        <div className="tl">{q.L.t}</div>
        <button className="speak" onClick={() => falar(spoken(q.L), voice)}>
          🔊 ouvir “{q.L.n}”
        </button>
        <div className="facts">
          <div className="fact"><b>Maiúscula</b><span className="gr big-u">{q.L.u}</span></div>
          <div className="fact"><b>Som</b><span>{q.L.som}</span></div>
          <div className="fact"><b>No NT</b>
            <span><span className="gr">{q.L.ex}</span> <span className="dim">— {q.L.exT}</span></span></div>
        </div>
      </div>
    );
  }

  if (q.k === "hear") {
    body = (
      <>
        <div className="ask">{q.ask}</div>
        <div className="hear">
          <button className="hearbtn" onClick={() => falar(spoken(q.L), voice)}>🔊</button>
        </div>
        <Options q={q} picked={picked} verdict={verdict} choose={choose} glyph />
      </>
    );
  }

  if (q.k === "type") {
    const modelo = q.L.n === "Beta" ? ["θ", "Theta"] : ["β", "Beta"];
    body = (
      <>
        <div className="ask">{q.ask}</div>
        <p className="hint tight">
          Como a letra se chama — <span className="gr">{modelo[0]}</span> é <b>{modelo[1]}</b>.
        </p>
        <div className="big small">
          <div className="g" onClick={() => falar(spoken(q.L), voice)}>{q.show}</div>
        </div>
        <input
          ref={inputRef}
          className="tin"
          value={typed}
          disabled={!!verdict}
          onChange={(e) => { setTyped(e.target.value); setHint(null); }}
          onKeyDown={(e) => { if (e.key === "Enter") checkTyped(); }}
          placeholder="nome da letra"
          autoComplete="off" autoCorrect="off" spellCheck="false"
        />
        <p className={"hint" + (hint ? " bad" : "")}>
          {hint || "Acento e maiúscula não são avaliados: “epsilon” vale tanto quanto “Épsilon”."}
        </p>
      </>
    );
  }

  if (q.k === "mc" || q.k === "word") {
    body = (
      <>
        <div className="ask">{q.ask}</div>
        {q.show && (
          <div className="big small">
            <div className="g" onClick={() => falar(spoken(q.L), voice)}>{q.show}</div>
          </div>
        )}
        <Options q={q} picked={picked} verdict={verdict} choose={choose} />
      </>
    );
  }

  // ---------------------------------------------------------------- rodapé
  let foot;
  if (verdict) {
    foot = (
      <div className={"foot " + (verdict.ok ? "ok" : "bad")}>
        <div className={"verd " + (verdict.ok ? "ok" : "bad")}>
          {verdict.ok ? "Certo!" : "Quase lá"}
        </div>
        <div className="why">{verdict.ok ? `${q.L.n} · ${q.L.som}` : verdict.why}</div>
        <button className={"go " + (verdict.ok ? "okb" : "badb")} onClick={advance}>
          Continuar
        </button>
      </div>
    );
  } else if (q.k === "intro") {
    foot = <div className="foot"><button className="go" onClick={advance}>Continuar</button></div>;
  } else if (q.k === "type") {
    foot = (
      <div className="foot">
        <button className={"go" + (typed.trim() ? "" : " mute")} onClick={checkTyped}>
          Conferir
        </button>
      </div>
    );
  } else {
    foot = <div className="foot"><button className="go mute">Escolha uma opção</button></div>;
  }

  return (
    <div className="lesson">
      <div className="ltop">
        <button className="x" onClick={onQuit}>✕</button>
        <div className="lbar"><i style={{ width: `${(i / total) * 100}%` }} /></div>
      </div>
      <div className="lbody">{body}</div>
      {foot}
    </div>
  );
}

function Options({ q, picked, verdict, choose, glyph }) {
  return (
    <div className="opts">
      {q.opts.map((o) => {
        let cls = "opt" + (glyph ? " gl" : "");
        if (verdict) {
          if (o === q.a) cls += " right";
          else if (o === picked) cls += " wrong";
          else cls += " dim";
        }
        return (
          <button key={o} className={cls} onClick={() => choose(o)} disabled={!!verdict}>
            {o}
          </button>
        );
      })}
    </div>
  );
}
