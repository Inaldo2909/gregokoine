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
