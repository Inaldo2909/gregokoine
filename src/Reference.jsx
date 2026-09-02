import { useState } from "react";
import { DIPS, PREPS, VOCAB } from "./data";

const CATS = [["t","Tudo"],["n","Top 10"],["d","Divindade"],["p","Partículas"],["c","Conceitos"],["v","Verbos"]];

export default function Reference() {
  const [sub, setSub] = useState("sons");
  const [cat, setCat] = useState("t");
  const [term, setTerm] = useState("");

  const words = VOCAB
    .filter(([g, pt, , c]) =>
      (cat === "t" || c === cat) &&
      (!term || g.toLowerCase().includes(term.toLowerCase()) ||
                pt.toLowerCase().includes(term.toLowerCase())))
    .sort((a, b) => b[2] - a[2]);

  return (
    <section className="view">
      <div className="seg">
        {[["hist","História"],["sons","Sons"],["gram","Gramática"],["lex","Léxico"]].map(([k, label]) => (
          <button key={k} className={sub === k ? "on" : ""} onClick={() => setSub(k)}>{label}</button>
        ))}
      </div>

      {sub === "hist" && (
        <>
          <h2 className="sec">Evolução do idioma grego</h2>
          <div className="tl">
            {[
              ["1300 a.C.", "Minoico e micênico",
               "Linear A, do período minoico, segue sem decifração. O Linear B, micênico, já foi decifrado — é grego, escrito séculos antes do alfabeto."],
              ["800 a.C.", "Arcaico",
               "Surge o alfabeto, adaptado do fenício com o acréscimo das vogais. É a língua de Homero e Hesíodo."],
              ["500 a.C.", "Clássico",
               "Predomina o dialeto ático, de Atenas. Sócrates, Platão, Aristóteles e as tragédias."],
              ["300 a.C. – 300 d.C.", "Koiné",
               "O grego comum do império helenístico. É o grego do Novo Testamento e da Septuaginta — o que este app ensina."],
              ["até 1453 d.C.", "Bizantino",
               "Do império do Oriente até a queda de Constantinopla."],
              ["hoje", "Grego moderno",
               "Pronúncia iotacista, em que várias vogais e ditongos convergiram para o som de “i”. É por isso que a voz do celular lê o grego de forma diferente da que se estuda aqui."],
            ].map(([quando, nome, texto]) => (
              <div className="tlrow" key={nome}>
                <div className="tlwhen">{quando}</div>
                <div className="tlbody">
                  <b>{nome}</b>
                  <p className="dim">{texto}</p>
                </div>
              </div>
            ))}
          </div>

          <h2 className="sec">De onde veio o alfabeto</h2>
          <div className="card">
            <p className="dim" style={{ color: "var(--text)", fontSize: "14.5px" }}>
              Hieróglifos egípcios influenciaram o proto-cananeu, que influenciou o
              alfabeto fenício por volta de 1500 a.C. No século VIII a.C. os gregos
              adotaram o alfabeto fenício <b>acrescentando as vogais</b> — os fenícios
              escreviam só consoantes. Nos séculos VII e VI a.C. os romanos adotaram o
              alfabeto grego com modificações, e daí vem o alfabeto que você está lendo
              agora. No Oriente, o grego bizantino deu origem ao cirílico, levado aos
              povos eslavos por Cirilo e Metódio.
            </p>
          </div>

          <h2 className="sec">Palavras gregas no português</h2>
          <p className="dim">
            A aspiração áspera vira “h” quando a palavra atravessa para o português.
          </p>
          <div className="card">
            <table><tbody>
              <tr><th>Português</th><th>Do grego</th></tr>
              <tr><td>hora</td><td className="dim"><span className="gr">ὥρα</span> — hora</td></tr>
              <tr><td>hipopótamo</td><td className="dim">cavalo + rio</td></tr>
              <tr><td>hipódromo</td><td className="dim">cavalo + percurso</td></tr>
              <tr><td>hipertrofia</td><td className="dim">excesso + crescimento</td></tr>
              <tr><td>hematologia</td><td className="dim">sangue + estudo</td></tr>
              <tr><td>heliocêntrico</td><td className="dim">sol + centro</td></tr>
              <tr><td>psicossomático</td><td className="dim">alma + corpo</td></tr>
              <tr><td>teologia</td><td className="dim">Deus + estudo</td></tr>
              <tr><td>Mesopotâmia</td><td className="dim">entre + rios</td></tr>
            </tbody></table>
          </div>

          <h2 className="sec">Notas de exegese</h2>
          <div className="card">
            <b><span className="gr">λόγος</span> e <span className="gr">ῥῆμα</span></b>
            <p className="dim mt-s">
              Não há base no texto bíblico para a distinção corrente de que
              <span className="gr"> ῥῆμα </span> seria “palavra revelada” e
              <span className="gr"> λόγος </span> não. A Septuaginta traduz a mesma
              palavra hebraica pelas duas indistintamente. O campo semântico de
              <span className="gr"> λόγος </span> é largo: fala, razão, argumento,
              narrativa, doutrina, explicação.
            </p>
          </div>
          <div className="card">
            <b><span className="gr">κύριος</span> em 1Co 12.3</b>
            <p className="dim mt-s">
              A Septuaginta usa <span className="gr">κύριος</span> para verter o
              Tetragrama, o nome sagrado. É o peso dessa escolha que está por trás da
              afirmação de que ninguém confessa Jesus como <span className="gr">κύριος</span> senão
              pelo Espírito.
            </p>
          </div>
          <div className="card">
            <b>Júnia em Rm 16.7</b>
            <p className="dim mt-s">
              No acusativo, masculino e feminino do nome coincidem — a morfologia
              sozinha não decide. Júnia era nome comum entre mulheres romanas e quase
              inexistente entre homens; João Crisóstomo, no século IV, a lia como mulher.
              A leitura masculina só se firma a partir do século XIII.
            </p>
          </div>
        </>
      )}

      {sub === "sons" && (
        <>
          <h2 className="sec">Vogais (7)</h2>
          <div className="chips">
            <div className="chip"><span className="g">ε ο</span><small>Sempre breves</small></div>
            <div className="chip"><span className="g">η ω</span><small>Sempre longas</small></div>
            <div className="chip"><span className="g">α ι υ</span><small>Dicronas</small></div>
          </div>

          <h2 className="sec">Ditongos</h2>
          <div className="dips">
            {DIPS.map(([g, a]) => (
              <div className="dip" key={g}><span className="g">{g}</span><small>{a}</small></div>
            ))}
          </div>
          <p className="dim mt">
            Impróprios (iota subscrito): <span className="gr">ᾳ ῃ ῳ</span> — o iota fica abaixo
            da vogal longa e não se pronuncia.
          </p>

          <h2 className="sec">Aspirações</h2>
          <div className="card">
            <b>Branda <span className="gr">᾿</span></b>
            <p className="dim mt-s">Não altera o som nem a transliteração. <span className="gr">ἀρχή</span> → <i>archē</i>, “princípio”.</p>
          </div>
          <div className="card">
            <b>Áspera <span className="gr">῾</span></b>
            <p className="dim mt-s">Som gutural de “r”; vira <b>h</b> na transliteração. <span className="gr">ὥρα</span> → <i>hōra</i> · <span className="gr">ῥῆμα</span> → <i>rhēma</i>.</p>
          </div>

          <h2 className="sec">Acentos</h2>
          <div className="chips">
            <div className="chip"><span className="g">ά</span><small>Agudo</small></div>
            <div className="chip"><span className="g">ὰ</span><small>Grave</small></div>
            <div className="chip"><span className="g">ᾶ</span><small>Circunflexo</small></div>
          </div>

          <h2 className="sec">Pontuação</h2>
          <div className="card">
            <table><tbody>
              <tr><th>Grego</th><th>Português</th></tr>
              <tr><td>ponto <b>.</b></td><td>ponto</td></tr>
              <tr><td>vírgula <b>,</b></td><td>vírgula</td></tr>
              <tr><td>ponto e vírgula <b>;</b></td><td>interrogação</td></tr>
              <tr><td>ponto alto <b>·</b></td><td>ponto e vírgula ou dois pontos</td></tr>
            </tbody></table>
          </div>

          <h2 className="sec">Silabação</h2>
          <div className="card"><ol className="rules">
            <li>Uma vogal no mínimo por sílaba; o ditongo fica em uma só sílaba.</li>
            <li>Cada sílaba começa com consoante, salvo quando impossível.</li>
            <li>A vogal inicial fica sozinha, salvo se formar ditongo ou vier seguida de duas consoantes.</li>
            <li>Duas consoantes seguidas se dividem, salvo quando iniciam a palavra.</li>
          </ol></div>

          <h2 className="sec">Transliteração</h2>
          <div className="card"><b className="lbl">ABNT</b>
            <p className="dim mt-s"><i>polymerōˆs kaì polytópōs pálai ho theòs lalḗsas</i> — aspirações, vogais longas e acentos.</p></div>
          <div className="card"><b className="lbl">SBL</b>
            <p className="dim mt-s"><i>polymerōs kai polytropōs palai ho theos lalēsas</i> — aspirações e vogais longas.</p></div>
          <div className="card"><b className="lbl">Simplificado</b>
            <p className="dim mt-s"><i>polymeros kai polytropos palai ho theos lalesas</i> — só as aspirações.</p></div>

          <div className="quote">
            <span className="gr acro">ΙΧΘΥΣ</span>
            <p>Acróstico de <i>Iēsoûs Christós Theoû Hyiós Sōtḗr</i> — “Jesus Cristo, Filho de Deus, Salvador”.</p>
          </div>
        </>
      )}

      {sub === "gram" && (
        <>
          <h2 className="sec">Os quatro casos</h2>
          <div className="chips two">
            <div className="chip left"><b>Nominativo</b><small>sujeito · <span className="gr">-ος</span></small></div>
            <div className="chip left"><b>Genitivo</b><small>posse · <span className="gr">-ου</span></small></div>
            <div className="chip left"><b>Dativo</b><small>objeto indireto · <span className="gr">-ῳ</span></small></div>
            <div className="chip left"><b>Acusativo</b><small>objeto direto · <span className="gr">-ον</span></small></div>
          </div>

          <h2 className="sec">2ª declinação</h2>
          <div className="card"><table><tbody>
            <tr><th /><th className="gr">λόγος sg</th><th className="gr">pl</th><th className="gr">βιβλίον sg</th><th className="gr">pl</th></tr>
            <tr><td className="tag">N</td><td className="g">λόγος</td><td className="g">λόγοι</td><td className="g">βιβλίον</td><td className="g">βιβλία</td></tr>
            <tr><td className="tag">G</td><td className="g">λόγου</td><td className="g">λόγων</td><td className="g">βιβλίου</td><td className="g">βιβλίων</td></tr>
            <tr><td className="tag">D</td><td className="g">λόγῳ</td><td className="g">λόγοις</td><td className="g">βιβλίῳ</td><td className="g">βιβλίοις</td></tr>
            <tr><td className="tag">A</td><td className="g">λόγον</td><td className="g">λόγους</td><td className="g">βιβλίον</td><td className="g">βιβλία</td></tr>
          </tbody></table></div>

          <h2 className="sec">Artigo definido</h2>
          <div className="card"><table><tbody>
            <tr><th /><th>M sg</th><th>M pl</th><th>N sg</th><th>N pl</th></tr>
            <tr><td className="tag">N</td><td className="g">ὁ</td><td className="g">οἱ</td><td className="g">τό</td><td className="g">τά</td></tr>
            <tr><td className="tag">G</td><td className="g">τοῦ</td><td className="g">τῶν</td><td className="g">τοῦ</td><td className="g">τῶν</td></tr>
            <tr><td className="tag">D</td><td className="g">τῷ</td><td className="g">τοῖς</td><td className="g">τῷ</td><td className="g">τοῖς</td></tr>
            <tr><td className="tag">A</td><td className="g">τόν</td><td className="g">τούς</td><td className="g">τό</td><td className="g">τά</td></tr>
          </tbody></table></div>

          <div className="quote">
            <span className="gr">ὁ θεὸς λέγει τὸν λόγον τῷ δούλῳ</span>
            <p>“Deus fala a palavra ao servo” — nominativo, acusativo e dativo.</p>
          </div>

          <h2 className="sec">Preposições</h2>
          <div className="card"><table><tbody>
            <tr><th>Prep.</th><th>Caso</th><th>Sentido e exemplo</th></tr>
            {PREPS.map(([p, c, s, n, ex], k) => (
              <tr key={k}>
                <td className="g">{p}</td><td className="c">{c}</td>
                <td>{s}{n ? <span className="dim"> ({n})</span> : null}<br />
                  <span className="gr dim ex">{ex}</span></td>
              </tr>
            ))}
          </tbody></table></div>

          <h2 className="sec">Pronomes pessoais</h2>
          <div className="card"><table><tbody>
            <tr><th>Nom.</th><th>Gen.</th><th>Dat.</th><th>Acus.</th></tr>
            <tr><td className="g">ἐγώ</td><td className="g">ἐμοῦ</td><td className="g">ἐμοί</td><td className="g">ἐμέ</td></tr>
            <tr><td className="g">σύ</td><td className="g">σοῦ</td><td className="g">σοί</td><td className="g">σέ</td></tr>
            <tr><td className="g">αὐτός</td><td className="g">αὐτοῦ</td><td className="g">αὐτῷ</td><td className="g">αὐτόν</td></tr>
            <tr><td className="g">ἡμεῖς</td><td className="g">ἡμῶν</td><td className="g">ἡμῖν</td><td className="g">ἡμᾶς</td></tr>
            <tr><td className="g">ὑμεῖς</td><td className="g">ὑμῶν</td><td className="g">ὑμῖν</td><td className="g">ὑμᾶς</td></tr>
            <tr><td className="g">αὐτοί</td><td className="g">αὐτῶν</td><td className="g">αὐτοῖς</td><td className="g">αὐτούς</td></tr>
          </tbody></table>
          <p className="dim mt">Demonstrativos: <span className="gr">οὗτος</span> este · <span className="gr">ἐκεῖνος</span> aquele. <span className="gr">τίς</span> quem? · <span className="gr">τις</span> alguém · <span className="gr">οὐδείς</span> ninguém.</p></div>

          <h2 className="sec">Presente do indicativo ativo</h2>
          <div className="card"><table><tbody>
            <tr><th>Pes.</th><th className="gr">λύω — solto</th><th className="gr">εἰμί — sou</th></tr>
            <tr><td>1 sg</td><td className="g">λύω</td><td className="g">εἰμί</td></tr>
            <tr><td>2 sg</td><td className="g">λύεις</td><td className="g">εἶ</td></tr>
            <tr><td>3 sg</td><td className="g">λύει</td><td className="g">ἐστί(ν)</td></tr>
            <tr><td>1 pl</td><td className="g">λύομεν</td><td className="g">ἐσμέν</td></tr>
            <tr><td>2 pl</td><td className="g">λύετε</td><td className="g">ἐστέ</td></tr>
            <tr><td>3 pl</td><td className="g">λύουσι(ν)</td><td className="g">εἰσί(ν)</td></tr>
          </tbody></table>
          <p className="dim mt">O verbo marca pessoa e número na terminação, por isso o pronome sujeito é opcional. <span className="gr">εἰμί</span> é de ligação: o complemento vai no nominativo.</p></div>

          <div className="card"><ol className="rules">
            <li>Negação: <span className="gr">οὐ</span> antes de consoante, <span className="gr">οὐκ</span> antes de vogal, <span className="gr">οὐχ</span> antes de aspiração áspera; <span className="gr">μή</span> nega ordens.</li>
            <li>A ordem das palavras é livre; quem define a função é o caso.</li>
            <li>No léxico o verbo aparece na 1ª pessoa do singular do presente.</li>
          </ol></div>

          <div className="quote">
            <span className="gr">ἐγώ εἰμι ἡ ὁδὸς καὶ ἡ ἀλήθεια καὶ ἡ ζωή</span>
            <p>“Eu sou o caminho, a verdade e a vida” — três complementos no nominativo.</p>
          </div>
        </>
      )}

      {sub === "lex" && (
        <>
          <div className="stats">
            <div className="stat"><b>5.436</b><small>palavras diferentes no NT</small></div>
            <div className="stat"><b>137.328</b><small>total de palavras</small></div>
            <div className="stat"><b>1.934</b><small>ocorrem uma única vez</small></div>
            <div className="stat solid"><b>170 = 72%</b><small>as palavras com +100 ocorrências cobrem 72% do NT</small></div>
          </div>

          <h2 className="sec">Buscar</h2>
          <input
            className="search" type="search" value={term}
            onChange={(e) => setTerm(e.target.value)}
            placeholder="Grego ou português…"
            autoComplete="off" autoCapitalize="off"
          />
          <div className="filters">
            {CATS.map(([k, label]) => (
              <button key={k} className={cat === k ? "on" : ""} onClick={() => setCat(k)}>{label}</button>
            ))}
          </div>
          {words.length === 0 && <p className="dim">Nada encontrado.</p>}
          {words.map(([g, pt, n]) => (
            <div className="wd" key={g}>
              <span className="gr">{g}</span>
              <span className="pt">{pt}</span>
              <span className="n">{n.toLocaleString("pt-BR")}</span>
            </div>
          ))}
        </>
      )}
    </section>
  );
}
