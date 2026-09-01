import { useEffect, useState } from "react";
import Path from "./Path";
import Reference from "./Reference";
import Lesson from "./Lesson";
import { useStore } from "./store";
import { falar } from "./speech";
import "./styles.css";

export default function App() {
  const { state, touchDay, completeLesson, toggle, setTheme } = useStore();
  const [tab, setTab] = useState("trilha");
  const [sheet, setSheet] = useState(null);
  const [lesson, setLesson] = useState(null);   // { t, l }
  const [wasFull, setWasFull] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (!toast) return;
    const id = setTimeout(() => setToast(null), 2600);
    return () => clearTimeout(id);
  }, [toast]);

  // trava a rolagem do fundo enquanto a lição está aberta
  useEffect(() => {
    document.body.style.overflow = lesson ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [lesson]);

  function start(t, l) {
    setSheet(null);
    touchDay();
    setWasFull(false);
    setLesson({ t, l });
  }

  function finish(t, l, errors) {
    completeLesson(t, l);
    // a tarefa fecha quando esta era a última lição pendente
    const willBeFull = [0, 1, 2, 3, 4].every((x) => x === l || state.done[`${t}-${x}`]);
    setWasFull(willBeFull);
  }

  if (lesson) {
    return (
      <div className="app">
        <Lesson
          key={`${lesson.t}-${lesson.l}`}
          task={lesson.t}
          lesson={lesson.l}
          voice={state.voice}
          taskWasFull={wasFull}
          onFinish={finish}
          onQuit={() => { setLesson(null); if (window.speechSynthesis) window.speechSynthesis.cancel(); }}
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
