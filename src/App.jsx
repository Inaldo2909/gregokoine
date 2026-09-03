import { useEffect, useState } from "react";
import Home from "./Home";
import Track from "./Track";
import Reference from "./Reference";
import Biblia from "./Biblia";
import Lesson from "./Lesson";
import Stats from "./Stats";
import Backup from "./Backup";
import Devocional from "./Devocional";
import { useStore } from "./store";
import { seenLetters } from "./data";
import { falar } from "./speech";
import "./styles.css";

export default function App() {
  const { state, touchDay, completeLesson, recordAnswer, recordReview,
          exportJSON, importJSON, reset, toggle, setTheme, doneDevocional } = useStore();

  const [tab, setTab] = useState("trilha");
  const [modulo, setModulo] = useState(null);   // módulo aberto
  const [lesson, setLesson] = useState(null);   // { id, t, l } | { review } | { decode }
  const [round, setRound] = useState(null);
  const [wasFull, setWasFull] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [showBackup, setShowBackup] = useState(false);
  const [showDev, setShowDev] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (!toast) return;
    const id = setTimeout(() => setToast(null), 2600);
    return () => clearTimeout(id);
  }, [toast]);

  useEffect(() => {
    const travado = lesson || showStats || round;
    document.body.style.overflow = travado ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [lesson, showStats, round]);

  function start(id, t, l) { touchDay(); setWasFull(false); setLesson({ id, t, l }); }
  function startReview() { touchDay(); setRound(null); setLesson({ review: true }); }
  function startDecode() { touchDay(); setRound(null); setLesson({ decode: true }); }

  function finish(resultado, t, l, errors, moduleId) {
    if (resultado) {
      if (!resultado.decode) recordReview(resultado.total, resultado.wrong);
      setRound(resultado);
      setLesson(null);
      return;
    }
    completeLesson(t, l, moduleId);
    const total = moduleId ? 4 : 5;
    const chave = (x) => moduleId ? `${moduleId}:${t}-${x}` : `${t}-${x}`;
    setWasFull([...Array(total).keys()].every((x) => x === l || state.done[chave(x)]));
  }

  if (lesson) {
    const rev = !!lesson.review, dec = !!lesson.decode;
    const generico = !rev && !dec && lesson.id !== "alfabeto";
    return (
      <div className="app">
        <Lesson
          key={rev || dec ? `avulso-${Date.now()}` : `${lesson.id}-${lesson.t}-${lesson.l}`}
          task={lesson.t}
          lesson={lesson.l}
          moduleId={generico ? lesson.id : null}
          review={rev}
          decode={dec}
          pool={rev || dec ? seenLetters(state.done) : []}
          stats={state.stats}
          onAnswer={recordAnswer}
          voice={state.voice}
          taskWasFull={wasFull}
          onFinish={finish}
          onQuit={() => { setLesson(null); if (window.speechSynthesis) window.speechSynthesis.cancel(); }}
        />
      </div>
    );
  }

  if (showDev) {
    const hoje = new Date().toISOString().slice(0, 10);
    return (
      <div className="app">
        <Devocional
          feito={state.dev && state.dev.d === hoje}
          onDone={doneDevocional}
          onClose={() => setShowDev(false)}
        />
      </div>
    );
  }

  if (round || showStats) {
    return (
      <div className="app">
        <Stats
          state={state}
          round={round}
          onAgain={round ? () => { setRound(null); (round.decode ? startDecode : startReview)(); } : null}
          onClose={() => { setRound(null); setShowStats(false); }}
        />
      </div>
    );
  }

  return (
    <div className="app">
      <header>
        <div className="brand"><span className="mk">Κ</span>
          <h1>{{ trilha: "Estudar", biblia: "Novo Testamento", consulta: "Consulta" }[tab]}</h1></div>
        <div className="hb">
          <span className="fire">🔥 {state.streak || 0}</span>
          <button className={"icon" + (state.voice ? "" : " off")} aria-label="Voz"
            onClick={() => { toggle("voice"); if (!state.voice) falar("Alfa", true);
                             setToast(state.voice ? "Voz desligada" : "Voz ligada"); }}>🔊</button>
          <button className="icon" aria-label="Tema"
            onClick={() => setTheme(state.theme === "dark" ? "light" : "dark")}>
            {state.theme === "dark" ? "☾" : "☀"}</button>
        </div>
      </header>

      <main>
        {tab === "consulta" ? <Reference />
          : tab === "biblia" ? <Biblia />
          : modulo ? (
            <Track state={state} moduleId={modulo} onStart={start}
                   onBack={() => setModulo(null)} toast={setToast} />
          ) : (
            <Home
              state={state}
              onOpenModule={setModulo}
              onStart={start}
              onReview={startReview}
              onDecode={startDecode}
              onDevocional={() => { touchDay(); setShowDev(true); }}
              onStats={() => setShowStats(true)}
              onBackup={() => setShowBackup(true)}
            />
          )}
      </main>

      <nav className="three">
        <button className={tab === "trilha" ? "on" : ""}
          onClick={() => { setTab("trilha"); setModulo(null); }}>
          <span className="g">Α</span><span className="l">Estudar</span>
        </button>
        <button className={tab === "biblia" ? "on" : ""} onClick={() => setTab("biblia")}>
          <span className="g">ΙΧΘΥΣ</span><span className="l">Novo Testamento</span>
        </button>
        <button className={tab === "consulta" ? "on" : ""} onClick={() => setTab("consulta")}>
          <span className="g">λ</span><span className="l">Consulta</span>
        </button>
      </nav>

      {showBackup && (
        <Backup codigo={exportJSON()} onImport={importJSON}
          onClose={() => setShowBackup(false)}
          onReset={() => { reset(); setShowBackup(false); setToast("Progresso apagado"); }} />
      )}

      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}
