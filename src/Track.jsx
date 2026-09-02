import { useState } from "react";
import { TASKS, LESSONS } from "./data";
import { MODULES, MODULE_LESSONS } from "./modules";
import { isDone, taskCount, taskFull, taskOpen, lessonOpen,
         mDone, mCount, mFull, mOpen } from "./store";

export default function Track({ state, moduleId, onStart, onBack, toast }) {
  const [sheet, setSheet] = useState(null);
  const alfabeto = moduleId === "alfabeto";
  const mod = alfabeto ? null : MODULES[moduleId];

  const nome = alfabeto ? "Alfabeto" : mod.name;
  const lessons = alfabeto ? LESSONS : MODULE_LESSONS;
  const tarefas = alfabeto
    ? TASKS.map((T) => ({ titulo: `Tarefa ${T.i + 1}`, glifo: T.letters.map((l) => l.l).join(" "),
                          sub: T.letters.map((l) => l.n).join(", ") }))
    : mod.tasks.map((T, i) => ({ titulo: T.name, glifo: T.items[0].f,
                                 sub: `${T.items.length} itens` }));

  const cheia = (t) => alfabeto ? taskFull(state, t) : mFull(state, moduleId, t);
  const aberta = (t) => alfabeto ? taskOpen(state, t) : mOpen(state, moduleId, t);
  const conta = (t) => alfabeto ? taskCount(state, t) : mCount(state, moduleId, t);
  const feita = (t, l) => alfabeto ? isDone(state, t, l) : mDone(state, moduleId, t, l);
  const abertaLic = (t, l) =>
    alfabeto ? lessonOpen(state, t, l) : (state.free || l === 0 || mDone(state, moduleId, t, l - 1));

  return (
    <section className="view">
      <button className="backlink" onClick={onBack}>‹ Módulos</button>
      <h1 className="modtitle">{nome}</h1>
      <p className="dim mb">
        {tarefas.length} tarefas · {lessons.length} lições cada
      </p>

      <div className="path">
        {tarefas.map((T, i) => (
          <div className="task" key={i}>
            <div className={"spine" + (cheia(i) ? " lit" : "")} />
            <button
              className="taskrow"
              onClick={() => aberta(i) ? setSheet(i) : toast("Termine a tarefa anterior")}
            >
              <span className={"node " + (cheia(i) ? "doneT" : aberta(i) ? "open" : "lock")
                               + (alfabeto ? "" : " small")}>
                {cheia(i) ? "✓" : T.glifo}
              </span>
              <span className="tinfo">
                <b>{T.titulo}</b>
                <small>{aberta(i) ? (cheia(i) ? "concluída" : `${conta(i)} de ${lessons.length} lições`) : "bloqueada"}</small>
                <span className="dots">
                  {lessons.map((_, l) => <i key={l} className={feita(i, l) ? "f" : ""} />)}
                </span>
              </span>
            </button>
          </div>
        ))}
      </div>

      {sheet !== null && (
        <>
          <div className="veil" onClick={() => setSheet(null)} />
          <div className="sheet">
            <div className="grab" />
            <h3>{tarefas[sheet].titulo}</h3>
            <p className="dim mb">
              <span className="gr glyphs">{tarefas[sheet].glifo}</span> — {tarefas[sheet].sub}
            </p>
            {lessons.map((L, l) => {
              const done = feita(sheet, l);
              const unl = abertaLic(sheet, l);
              return (
                <button
                  key={l}
                  className={"les " + (done ? "done" : unl ? "next" : "lock")}
                  disabled={!unl}
                  onClick={() => { setSheet(null); onStart(moduleId, sheet, l); }}
                >
                  <span className="num">{done ? "✓" : l + 1}</span>
                  <span><b>{L.n}</b><small>{L.d}</small></span>
                </button>
              );
            })}
          </div>
        </>
      )}
    </section>
  );
}
