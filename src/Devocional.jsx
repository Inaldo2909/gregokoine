import { useState } from "react";
import { devocionalDeHoje } from "./devocional";

export default function Devocional({ onClose, onDone, feito }) {
  const { idx, d } = devocionalDeHoje();
  const [escolha, setEscolha] = useState(null);
  const acertou = escolha === d.a;

  return (
    <div className="lesson">
      <div className="ltop">
        <button className="x" onClick={onClose}>✕</button>
        <div className="lbar"><i style={{ width: escolha ? "100%" : "50%" }} /></div>
      </div>

      <div className="lbody">
        <div className="devref">{d.ref}</div>
        <div className="devgr gr">{d.gr}</div>
        <div className="devtr">{d.tr}</div>
        <div className="devpt">{d.pt}</div>

        <h2 className="sec">Vocabulário</h2>
        {d.vocab.map(([g, t, p]) => (
          <div className="devword" key={g}>
            <span className="gr dw1">{g}</span>
            <span className="dw2">{t}</span>
            <span className="dw3">{p}</span>
          </div>
        ))}

        <h2 className="sec">Tarefa</h2>
        <p className="devtask">{d.tarefa}</p>
        <div className="opts">
          {d.opts.map((o) => {
            let cls = "opt gk-mixed";
            if (escolha) {
              if (o === d.a) cls += " right";
              else if (o === escolha) cls += " wrong";
              else cls += " dim";
            }
            return (
              <button key={o} className={cls} disabled={!!escolha}
                onClick={() => { setEscolha(o); if (!feito) onDone(idx); }}>
                {o}
              </button>
            );
          })}
        </div>

        {escolha && (
          <div className={"devwhy " + (acertou ? "ok" : "bad")}>
            <b>{acertou ? "Isso mesmo." : "Observe de novo:"}</b>
            <p>{d.why}</p>
          </div>
        )}
      </div>

      <div className="foot">
        <button className="go" onClick={onClose}>
          {escolha ? "Concluir" : "Fechar"}
        </button>
      </div>
    </div>
  );
}
