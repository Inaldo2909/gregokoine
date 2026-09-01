import { TASKS, LESSONS, seenLetters } from "./data";
import { isDone, taskCount, taskFull, taskOpen, nextSpot } from "./store";

export default function Path({ state, onStart, openTask, sheet, closeSheet, toast, onReview, onStats }) {
  const spot = nextSpot(state);
  const vistas = seenLetters(state.done);
  const rodadas = state.reviews.length;

  return (
    <section className="view">
      <button
        className="cont"
        onClick={() => (spot ? onStart(spot[0], spot[1]) : openTask(7))}
      >
        <span className="g">{spot ? TASKS[spot[0]].letters[0].l : "✓"}</span>
        <span>
          <b>{spot ? (state.xp ? "Continuar" : "Começar") : "Alfabeto completo"}</b>
          <small>
            {spot
              ? `Tarefa ${spot[0] + 1} · lição ${spot[1] + 1}: ${LESSONS[spot[1]].n}`
              : "volte para revisar quando quiser"}
          </small>
        </span>
      </button>

      <div className="path">
        {TASKS.map((T) => {
          const full = taskFull(state, T.i);
          const open = taskOpen(state, T.i);
          const count = taskCount(state, T.i);
          const glyphs = T.letters.map((l) => l.l).join(" ");
          return (
            <div className="task" key={T.i}>
              <div className={"spine" + (full ? " lit" : "")} />
              <button
                className="taskrow"
                onClick={() => (open ? openTask(T.i) : toast("Termine a tarefa anterior"))}
              >
                <span className={"node " + (full ? "doneT" : open ? "open" : "lock")}>
                  {full ? "✓" : glyphs}
                </span>
                <span className="tinfo">
                  <b>Tarefa {T.i + 1} · <span className="gr">{glyphs}</span></b>
                  <small>{open ? (full ? "concluída" : `${count} de 5 lições`) : "bloqueada"}</small>
                  <span className="dots">
                    {[0, 1, 2, 3, 4].map((l) => (
                      <i key={l} className={isDone(state, T.i, l) ? "f" : ""} />
                    ))}
                  </span>
                </span>
              </button>
            </div>
          );
        })}
      </div>

      {vistas.length >= 3 && (
        <>
          <h2 className="sec">Revisão geral</h2>
          <button className="revcard" onClick={onReview}>
            <span className="ic">↻</span>
            <span>
              <b>Revisar as {vistas.length} letras</b>
              <small>
                12 questões sorteadas, sempre diferentes. As letras que você erra
                aparecem com mais frequência.
              </small>
            </span>
          </button>
          <button className="statslink" onClick={onStats}>
            Ver desempenho{rodadas ? ` · ${rodadas} ${rodadas === 1 ? "rodada" : "rodadas"}` : ""}
          </button>
        </>
      )}

      <p className="dim center mt">8 tarefas · 3 letras cada · 5 lições por tarefa</p>

      {sheet !== null && (
        <>
          <div className="veil" onClick={closeSheet} />
          <div className="sheet">
            <div className="grab" />
            <h3>Tarefa {sheet + 1}</h3>
            <p className="dim mb">
              <span className="gr glyphs">{TASKS[sheet].letters.map((l) => l.l).join("  ")}</span>
              {" — "}
              {TASKS[sheet].letters.map((l) => l.n).join(", ")}
            </p>
            {LESSONS.map((L, l) => {
              const done = isDone(state, sheet, l);
              const unlocked = l === 0 || isDone(state, sheet, l - 1);
              return (
                <button
                  key={l}
                  className={"les " + (done ? "done" : unlocked ? "next" : "lock")}
                  disabled={!unlocked}
                  onClick={() => onStart(sheet, l)}
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
