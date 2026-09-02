import { TASKS, LESSONS, seenLetters, decodable } from "./data";
import { MODULES, MODULE_LESSONS } from "./modules";
import { isDone, nextSpot, mDone, mNext } from "./store";
import { devocionalDeHoje } from "./devocional";

// progresso de um módulo: [feitas, total]
function progressoAlfabeto(state) {
  let feitas = 0;
  for (let t = 0; t < 8; t++) for (let l = 0; l < 5; l++) if (isDone(state, t, l)) feitas++;
  return [feitas, 40];
}
function progressoModulo(state, id) {
  const n = MODULES[id].tasks.length;
  let feitas = 0;
  for (let t = 0; t < n; t++) for (let l = 0; l < 4; l++) if (mDone(state, id, t, l)) feitas++;
  return [feitas, n * 4];
}

export default function Home({ state, onOpenModule, onStart, onReview, onDecode, onDevocional, onStats, onToggleFree, onBackup }) {
  const [feitasAlf, totAlf] = progressoAlfabeto(state);
  const spot = nextSpot(state);
  const vistas = seenLetters(state.done);
  const decodeCount = decodable(vistas).length;
  const rodadas = state.reviews.length;
  const dev = devocionalDeHoje();
  const hoje = new Date().toISOString().slice(0, 10);
  const devFeito = state.dev && state.dev.d === hoje;

  // o que o botão Continuar faz: termina o alfabeto antes de sugerir outro módulo
  let cont;
  if (spot) {
    cont = {
      g: TASKS[spot[0]].letters[0].l,
      b: feitasAlf ? "Continuar" : "Começar",
      s: `Alfabeto · tarefa ${spot[0] + 1} · ${LESSONS[spot[1]].n}`,
      go: () => onStart("alfabeto", spot[0], spot[1]),
    };
  } else {
    const pendente = Object.keys(MODULES).find((id) => mNext(state, id, MODULES[id].tasks.length));
    if (pendente) {
      const [t, l] = mNext(state, pendente, MODULES[pendente].tasks.length);
      cont = {
        g: MODULES[pendente].glyph,
        b: "Continuar",
        s: `${MODULES[pendente].name} · ${MODULES[pendente].tasks[t].name} · ${MODULE_LESSONS[l].n}`,
        go: () => onStart(pendente, t, l),
      };
    } else {
      cont = { g: "✓", b: "Tudo concluído", s: "use a revisão para não esquecer", go: onReview };
    }
  }

  const cards = [
    { id: "alfabeto", name: "Alfabeto", glyph: "Α", unit: "Unidade I",
      desc: "as 24 letras, som e transliteração",
      tasks: 8, lessons: 5, prog: [feitasAlf, totAlf], open: true },
    ...Object.entries(MODULES).map(([id, m]) => ({
      id, name: m.name, glyph: m.glyph, unit: m.unit, desc: m.desc,
      tasks: m.tasks.length, lessons: 4, prog: progressoModulo(state, id),
      open: true,
    })),
  ];

  return (
    <section className="view">
      <button className="cont" onClick={cont.go}>
        <span className="g">{cont.g}</span>
        <span><b>{cont.b}</b><small>{cont.s}</small></span>
      </button>

      <h2 className="sec">Devocional de hoje</h2>
      <button className={"devcard" + (devFeito ? " done" : "")} onClick={onDevocional}>
        <span className="dev1">
          <b>{dev.d.ref}</b>
          {devFeito && <span className="devtick">✓ feito hoje</span>}
        </span>
        <span className="gr dev2">{dev.d.gr}</span>
        <span className="dev3">{dev.d.pt}</span>
      </button>

      <h2 className="sec">Módulos</h2>
      {cards.map((c) => {
        const [f, t] = c.prog;
        const pct = Math.round((f / t) * 100);
        return (
          <button
            key={c.id}
            className={"modcard" + (c.open ? "" : " lock")}
            onClick={() => c.open ? onOpenModule(c.id) : null}
            disabled={!c.open}
          >
            <span className="mic gr">{c.glyph}</span>
            <span className="mbody">
              <b>{c.name}</b>
              <small>{c.desc}</small>
              <span className="mmeta">
                {c.open
                  ? `${c.tasks} tarefas · ${c.lessons} lições cada · ${pct}%`
                  : "abre ao terminar a primeira tarefa do alfabeto"}
              </span>
              <span className="mbar"><i style={{ width: `${pct}%` }} /></span>
            </span>
          </button>
        );
      })}

      <h2 className="sec">Praticar</h2>
      <button className="revcard" onClick={onReview}>
        <span className="ic">↻</span>
        <span>
          <b>Revisão geral</b>
          <small>
            {vistas.length
              ? `12 questões sorteadas entre as ${vistas.length} letras já vistas, puxando o que você mais erra.`
              : "disponível assim que você terminar a primeira lição."}
          </small>
        </span>
      </button>

      {decodeCount >= 6 && (
        <button className="revcard mt" onClick={onDecode}>
          <span className="ic gr">δ</span>
          <span>
            <b>Decifrar palavras</b>
            <small>Palavras em português escritas com letras gregas — {decodeCount} disponíveis.</small>
          </span>
        </button>
      )}

      <button className="statslink" onClick={onStats}>
        Ver desempenho{rodadas ? ` · ${rodadas} ${rodadas === 1 ? "rodada" : "rodadas"}` : ""}
      </button>
      <button className="statslink" onClick={onBackup}>Salvar ou restaurar progresso</button>

      <button className={"freebtn" + (state.free ? " on" : "")} onClick={onToggleFree}>
        {state.free ? "Tudo liberado — toque para seguir a ordem" : "Seguindo a ordem das lições — toque para liberar tudo"}
      </button>
    </section>
  );
}
