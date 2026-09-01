import { A } from "./data";

export default function Stats({ state, round, onClose, onAgain }) {
  const { stats, reviews } = state;

  const porLetra = A
    .map((L) => ({ L, ...(stats[L.i] || { seen: 0, wrong: 0 }) }))
    .filter((x) => x.seen > 0)
    .map((x) => ({ ...x, taxa: x.wrong / x.seen }))
    .sort((a, b) => b.taxa - a.taxa || b.wrong - a.wrong);

  const dificeis = porLetra.filter((x) => x.wrong > 0).slice(0, 6);
  const limpas = porLetra.filter((x) => x.wrong === 0);

  const totQ = reviews.reduce((s, r) => s + r.total, 0);
  const totE = reviews.reduce((s, r) => s + r.wrong, 0);
  const geral = totQ ? Math.round(((totQ - totE) / totQ) * 100) : null;
  const ultimas = reviews.slice(-10);

  return (
    <div className="lesson">
      <div className="ltop">
        <button className="x" onClick={onClose}>✕</button>
        <div className="lbar"><i style={{ width: "100%" }} /></div>
      </div>

      <div className="lbody">
        {round && (
          <div className="roundbox">
            <div className="pct">{Math.round(((round.total - round.wrong) / round.total) * 100)}%</div>
            <div className="dim">
              {round.total - round.wrong} de {round.total} nesta rodada
              {round.wrong === 0 && " — rodada limpa"}
            </div>
          </div>
        )}

        {!reviews.length && !round && (
          <p className="dim center pad">
            Nenhuma revisão feita ainda. Complete uma rodada para começar a acompanhar.
          </p>
        )}

        {geral !== null && (
          <>
            <h2 className="sec">No total</h2>
            <div className="statgrid">
              <div className="stat"><b>{geral}%</b><small>de acerto em {reviews.length} {reviews.length === 1 ? "rodada" : "rodadas"}</small></div>
              <div className="stat"><b>{totQ}</b><small>questões respondidas</small></div>
            </div>
          </>
        )}

        {ultimas.length > 1 && (
          <>
            <h2 className="sec">Últimas rodadas</h2>
            <div className="bars">
              {ultimas.map((r, k) => {
                const p = Math.round(((r.total - r.wrong) / r.total) * 100);
                return (
                  <div className="barcol" key={k}>
                    <div className="barwrap"><i style={{ height: `${Math.max(6, p)}%` }} /></div>
                    <small>{p}</small>
                  </div>
                );
              })}
            </div>
            <p className="hint">acerto por rodada, da mais antiga à mais recente</p>
          </>
        )}

        {dificeis.length > 0 && (
          <>
            <h2 className="sec">Onde você tropeça</h2>
            {dificeis.map(({ L, seen, wrong, taxa }) => (
              <div className="statrow" key={L.i}>
                <span className="gr sl">{L.l}</span>
                <span className="sn">{L.n}</span>
                <span className="sbar"><i style={{ width: `${Math.round(taxa * 100)}%` }} /></span>
                <span className="sv">{wrong}/{seen}</span>
              </div>
            ))}
            <p className="hint">
              Estas letras aparecem com mais frequência nas próximas revisões.
            </p>
          </>
        )}

        {limpas.length > 0 && (
          <>
            <h2 className="sec">Sem erros ({limpas.length})</h2>
            <p className="clean gr">{limpas.map((x) => x.L.l).join("  ")}</p>
          </>
        )}
      </div>

      <div className="foot">
        {onAgain && <button className="go" onClick={onAgain}>Nova rodada</button>}
        <button className={"go" + (onAgain ? " ghost" : "")} onClick={onClose}>
          {onAgain ? "Voltar à trilha" : "Fechar"}
        </button>
      </div>
    </div>
  );
}
