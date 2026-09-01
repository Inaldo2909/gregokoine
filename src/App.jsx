import { useEffect, useState } from "react";
import Path from "./Path";
import Reference from "./Reference";
import Lesson from "./Lesson";
import Stats from "./Stats";
import { seenLetters } from "./data";
import { useStore } from "./store";
import { falar } from "./speech";
import "./styles.css";

export default function App() {
  const { state, touchDay, completeLesson, recordAnswer, recordReview, toggle, setTheme } = useStore();
  const [tab, setTab] = useState("trilha");
  const [sheet, setSheet] = useState(null);
  const [lesson, setLesson] = useState(null);   // { t, l } ou { review: true }
  const [round, setRound] = useState(null);    // resultado da rodada de revisão
  const [showStats, setShowStats] = useState(false);
  const [wasFull, setWasFull] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (!toast) return;
    const id = setTimeout(() => setToast(null), 2600);
    return () => clearTimeout(id);
  }, [toast]);

  // trava a rolagem do fundo enquanto a lição está aberta
  useEffect(() => {
    const travado = lesson || showStats || round;
    document.body.style.overflow = travado ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [lesson, showStats, round]);

  function start(t, l) {
    setSheet(null);
    touchDay();
    setWasFull(false);
    setLesson({ t, l });
  }

  function startReview() {
    touchDay();
    setRound(null);
    setLesson({ review: true });
  }

  function finish(resultado, t, l, errors) {
    if (resultado) {                       // rodada de revisão
      recordReview(resultado.total, resultado.wrong);
      setRound(resultado);
      setLesson(null);
      return;
    }
    completeLesson(t, l);
    const willBeFull = [0, 1, 2, 3, 4].every((x) => x === l || state.done[`${t}-${x}`]);
    setWasFull(willBeFull);
  }

  if (lesson) {
    const rev = !!lesson.review;
    return (
      <div className="app">
        <Lesson
          key={rev ? `rev-${Date.now()}` : `${lesson.t}-${lesson.l}`}
          task={lesson.t}
          lesson={lesson.l}
          review={rev}
          pool={rev ? seenLetters(state.done) : []}
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

  if (round || showStats) {
    return (
      <div className="app">
        <Stats
          state={state}
          round={round}
          onAgain={round ? () => { setRound(null); startReview(); } : null}
          onClose={() => { setRound(null); setShowStats(false); }}
        />
      </div>
    );
  }

  return (
    <div className="app">
      <header>
        <div className="brand"><span className="mk">Κ</span><h1>{tab === "trilha" ? "Trilha" : "Consulta"}</h1></div>
        <div className="hb">
          <span className="fire">🔥 {state.streak || 0}</span>
          <button
            className={"icon" + (state.voice ? "" : " off")}
            aria-label="Voz"
            onClick={() => { toggle("voice"); if (!state.voice) falar("Alfa", true); setToast(state.voice ? "Voz desligada" : "Voz ligada"); }}
          >🔊</button>
          <button
            className="icon" aria-label="Tema"
            onClick={() => setTheme(state.theme === "dark" ? "light" : "dark")}
          >{state.theme === "dark" ? "☾" : "☀"}</button>
        </div>
      </header>

      <main>
        {tab === "trilha"
          ? <Path
              state={state}
              onStart={start}
              openTask={setSheet}
              sheet={sheet}
              closeSheet={() => setSheet(null)}
              toast={setToast}
              onReview={startReview}
              onStats={() => setShowStats(true)}
            />
          : <Reference />}
      </main>

      <nav>
        <button className={tab === "trilha" ? "on" : ""} onClick={() => setTab("trilha")}>
          <span className="g">Α</span><span className="l">Trilha</span>
        </button>
        <button className={tab === "consulta" ? "on" : ""} onClick={() => setTab("consulta")}>
          <span className="g">λ</span><span className="l">Consulta</span>
        </button>
      </nav>

      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}
