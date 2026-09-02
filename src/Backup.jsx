import { useState } from "react";

export default function Backup({ codigo, onImport, onClose, onReset }) {
  const [aba, setAba] = useState("salvar");
  const [texto, setTexto] = useState("");
  const [msg, setMsg] = useState(null);
  const [copiado, setCopiado] = useState(false);

  async function copiar() {
    try {
      await navigator.clipboard.writeText(codigo);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2200);
    } catch {
      setMsg("Não consegui copiar. Selecione o texto acima e copie à mão.");
    }
  }

  function restaurar() {
    const erro = onImport(texto);
    if (erro) { setMsg(erro); return; }
    setMsg(null);
    onClose();
  }

  return (
    <>
      <div className="veil" onClick={onClose} />
      <div className="sheet">
        <div className="grab" />
        <h3>Progresso</h3>
        <p className="dim mb">
          Um novo deploy não apaga nada. O que separa o progresso é trocar de
          endereço ou de aparelho — para esses casos, leve o código.
        </p>

        <div className="seg">
          <button className={aba === "salvar" ? "on" : ""} onClick={() => { setAba("salvar"); setMsg(null); }}>Salvar</button>
          <button className={aba === "restaurar" ? "on" : ""} onClick={() => { setAba("restaurar"); setMsg(null); }}>Restaurar</button>
        </div>

        {aba === "salvar" ? (
          <>
            <textarea className="codebox" readOnly value={codigo} onFocus={(e) => e.target.select()} />
            <button className="btn" onClick={copiar}>{copiado ? "Copiado" : "Copiar código"}</button>
            <p className="hint">
              Guarde onde quiser — anotações, e-mail para você mesmo. Serve para
              restaurar em qualquer aparelho ou endereço.
            </p>
          </>
        ) : (
          <>
            <textarea
              className="codebox"
              value={texto}
              onChange={(e) => { setTexto(e.target.value); setMsg(null); }}
              placeholder="Cole aqui o código que começa com KOINE1:"
            />
            <button className={"btn" + (texto.trim() ? "" : " off")} onClick={restaurar}>
              Restaurar progresso
            </button>
            <p className="hint">Isto substitui o progresso atual deste aparelho.</p>
          </>
        )}

        {msg && <p className="hint bad">{msg}</p>}

        <button className="btn soft danger" onClick={onReset}>Apagar tudo e recomeçar</button>
        <button className="btn soft" onClick={onClose}>Fechar</button>
      </div>
    </>
  );
}
