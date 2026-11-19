# Κοινή — Grego Instrumental

App em React para aprender o alfabeto grego do Novo Testamento em trilha guiada:
8 tarefas de 3 letras, 5 lições por tarefa, com áudio em português.

## Rodar localmente

Requer Node.js 18 ou superior.

```bash
npm install
npm run dev
```

Abre em `http://localhost:5173`. Para testar no celular na mesma rede Wi-Fi:

```bash
npm run dev -- --host
```

O terminal mostra um endereço de rede (algo como `http://192.168.0.10:5173`) que
você abre no navegador do telefone.

## Publicar

```bash
npm run build
```

Gera a pasta `dist/`, que é só HTML, CSS e JS estáticos. Como o `base` está em
`"./"`, ela funciona em qualquer lugar: raiz de domínio, subpasta ou GitHub Pages.

**Vercel ou Netlify** — conecte o repositório. Ambos detectam Vite sozinhos.
Se pedirem configuração: comando `npm run build`, diretório `dist`.

**Netlify Drop** — arraste a pasta `dist` para `app.netlify.com/drop`. Sem conta,
sem terminal, sai no ar com URL própria.

**GitHub Pages** — publique o conteúdo de `dist` no branch `gh-pages`.

## Instalar no celular

Depois de publicado, abra a URL no telefone.

- **iPhone (Safari)** — botão de compartilhar → Adicionar à Tela de Início.
- **Android (Chrome)** — o próprio navegador oferece "Instalar app".

Em ambos abre em tela cheia, sem barra de navegador. O service worker guarda os
arquivos na primeira visita, então funciona sem conexão depois disso.

## Estrutura

```
src/
  data.js       conteúdo das fichas, tarefas e gerador de exercícios
  store.js      progresso em localStorage, ofensiva, XP
  speech.js     seleção da voz feminina em pt-BR
  App.jsx       cabeçalho, abas, orquestração
  Path.jsx      trilha e folha de lições
  Lesson.jsx    motor de lição em tela cheia
  Reference.jsx aba de consulta
  styles.css    paleta e componentes
public/
  manifest.webmanifest, sw.js, ícones
```

## Notas

O layout é travado em 480px e centralizado, então mantém proporção de celular em
qualquer tela. Em monitores largos aparece como um cartão sobre fundo neutro.

O áudio usa a Web Speech API com voz em português do Brasil e fala apenas o nome
da letra. Se o aparelho não tiver voz portuguesa instalada, o app segue
funcionando em silêncio.

O progresso mora no `localStorage` do navegador. Limpar os dados do site apaga.

## Publicar no Cloudflare Workers

O arquivo `wrangler.jsonc` já está configurado para servir a pasta `dist` como
site estático. No painel do Cloudflare, ao conectar o repositório:

- **Build command:** `npm run build`
- **Deploy command:** `npx wrangler deploy`
- **Project name:** precisa ser igual ao `name` do `wrangler.jsonc` (`gregokoine`)

Se mudar o nome do projeto no painel, mude também no `wrangler.jsonc`.

Pelo terminal, `npm run deploy` faz build e publicação de uma vez.

## Texto bíblico

A aba Novo Testamento usa o **SBL Greek New Testament (SBLGNT)**, © 2010 Society
of Biblical Literature e Logos Bible Software, sob licença Creative Commons
Attribution 4.0 (ver `LICENSE-SBLGNT.txt`). A atribuição aparece no rodapé da aba,
como a licença exige.

A análise morfológica vem do **MorphGNT: SBLGNT Edition**, ed. J. K. Tauber,
sob licença CC BY-SA 3.0 (ver `LICENSE-MorphGNT.md`). Ela fornece lema, classe
gramatical e análise de cada uma das 137.554 palavras do NT.

O **aparato crítico do SBLGNT** traz 6.934 unidades de variação em 4.468
versículos, mostrando onde o texto adotado difere de Westcott-Hort, Tregelles,
Nestle-Aland 28 e Robinson-Pierpont.

Os dados vivem em `src/nt.json` (texto, 1,7 MB), `src/morf.json` (morfologia,
1,1 MB) e `src/aparato.json` (variantes, 461 KB), carregados por `import()` dinâmico. Viram pacotes separados que só baixam
quando o usuário abre a aba — o carregamento inicial do app não muda.

As glosas em português cobrem os 300 lemas mais frequentes, que correspondem a
79% das ocorrências do texto. Para ampliar, basta acrescentar entradas em
`GLOSAS`, no arquivo que gerou `morf.json`.

## Novidades da versão 4

- **Análise de frases**: versículos reais do NT em que o aluno toca na palavra que
  está no caso pedido. Gerado automaticamente da morfologia — 795 versículos
  elegíveis, filtrados por tamanho e por cobertura do glossário.
- **Revisão espaçada estendida**: além das letras, entram as palavras dos módulos
  já estudados, com o mesmo sorteio ponderado por erro.
- **Aba bíblica ligada ao progresso**: palavras já estudadas ficam marcadas, cada
  capítulo mostra quanto do seu vocabulário o app traduz, há busca por grego ou
  por português, e controle de tamanho de fonte.
- Marcas editoriais do aparato (⸀ ⸂) saíram da exibição; o losango de variante
  ganhou área de toque adequada.

## Revisão para a prova — João 1:1-10

O cartão "Revisão para a prova", no topo da aba Estudar, abre 18 seções de
exercícios sobre a análise de João 1:1-10 enviada pelo professor: uma por
versículo, sete por tema (regras, casos, preposições, verbos, αὐτός,
vocabulário, tradução) e um simulado geral.

O conteúdo fica em `src/revisaoJo1.js`: cada palavra do texto com a análise do
professor, mais as perguntas de regra em `MANUAIS`. Os exercícios (múltipla
escolha, tocar na palavra, montar a tradução) são gerados dali; a tela é
`src/Revisao.jsx`. O melhor resultado de cada seção vai para `rev` no progresso.

## Pendência importante

As 300 glosas em português, a tabela de pronúncia figurada e os 12 devocionais
foram escritos sem revisão de um professor de grego. Antes de usar com outras
pessoas, esse conteúdo precisa ser conferido.
