import { useCallback, useEffect, useState } from "react";

const KEY = "koine:react:v1";

const INITIAL = {
  done: {},        // { "0-1": true }  →  tarefa-lição
  xp: 0,
  streak: 0,
  last: null,      // último dia de estudo, "AAAA-MM-DD"
  voice: true,
  theme: "light",
  free: true,      // tudo liberado; desligue para seguir a ordem das lições
  dev: null,       // último devocional concluído: { d: "AAAA-MM-DD", idx }
  stats: {},       // { indiceDaLetra: { seen, wrong } }
  reviews: [],     // histórico de rodadas: { d, total, wrong }
  rev: {},         // revisão para a prova: { secao: { n, melhor } }, melhor em %
};

const today = () => new Date().toISOString().slice(0, 10);
const yesterday = () => new Date(Date.now() - 864e5).toISOString().slice(0, 10);

function read() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return INITIAL;
    const s = { ...INITIAL, ...JSON.parse(raw) };
    // versões antigas guardavam a letra como número; agora a chave é textual
    if (s.stats) {
      const conv = {};
      for (const [k, v] of Object.entries(s.stats)) conv[/^\d+$/.test(k) ? "L" + k : k] = v;
      s.stats = conv;
    }
    // ofensiva expira se o aluno pulou um dia inteiro
    if (s.last && s.last !== today() && s.last !== yesterday()) s.streak = 0;
    return s;
  } catch {
    return INITIAL;
  }
}

export function useStore() {
  const [state, setState] = useState(read);

  useEffect(() => {
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch {}
  }, [state]);

  useEffect(() => {
    document.documentElement.dataset.theme = state.theme;
  }, [state.theme]);

  const touchDay = useCallback(() => {
    setState((s) => {
      const t = today();
      if (s.last === t) return s;
      return { ...s, streak: (s.last === yesterday() ? s.streak : 0) + 1, last: t };
    });
  }, []);

  const completeLesson = useCallback((t, l, moduleId) => {
    setState((s) => {
      const key = moduleId ? `${moduleId}:${t}-${l}` : `${t}-${l}`;
      const first = !s.done[key];
      return { ...s, done: { ...s.done, [key]: true }, xp: s.xp + (first ? 15 : 5) };
    });
  }, []);

  // registra cada resposta da revisão geral, por letra
  const recordAnswer = useCallback((chave, ok) => {
    setState((s) => {
      const cur = s.stats[chave] || { seen: 0, wrong: 0 };
      return {
        ...s,
        stats: { ...s.stats, [chave]: { seen: cur.seen + 1, wrong: cur.wrong + (ok ? 0 : 1) } },
      };
    });
  }, []);

  // fecha uma rodada de revisão e guarda as últimas 30
  const recordReview = useCallback((total, wrong) => {
    setState((s) => ({
      ...s,
      xp: s.xp + Math.max(0, (total - wrong) * 2),
      reviews: [...s.reviews, { d: today(), total, wrong }].slice(-30),
    }));
  }, []);

  // fecha uma rodada da revisão para a prova: conta a rodada e guarda o melhor %
  const recordRevisao = useCallback((secao, total, wrong) => {
    setState((s) => {
      const pct = total ? Math.round(((total - wrong) / total) * 100) : 0;
      const cur = (s.rev || {})[secao] || { n: 0, melhor: 0 };
      return {
        ...s,
        xp: s.xp + Math.max(0, (total - wrong) * 2),
        rev: { ...(s.rev || {}), [secao]: { n: cur.n + 1, melhor: Math.max(cur.melhor, pct) } },
      };
    });
  }, []);

  // exporta o progresso como um código único, para levar entre aparelhos e origens
  const exportJSON = useCallback(() => {
    const payload = { v: 1, at: new Date().toISOString(), state };
    const texto = JSON.stringify(payload);
    // base64 seguro para UTF-8 (o grego dos nomes não sobrevive ao btoa cru)
    return "KOINE1:" + btoa(unescape(encodeURIComponent(texto)));
  }, [state]);

  // importa um código gerado acima; devolve mensagem de erro ou null se deu certo
  const importJSON = useCallback((codigo) => {
    try {
      const limpo = codigo.trim().replace(/\s/g, "");
      if (!limpo.startsWith("KOINE1:")) return "Código não reconhecido.";
      const texto = decodeURIComponent(escape(atob(limpo.slice(7))));
      const { state: novo } = JSON.parse(texto);
      if (!novo || typeof novo.done !== "object") return "Código incompleto ou corrompido.";
      setState({ ...INITIAL, ...novo });
      return null;
    } catch {
      return "Não consegui ler esse código.";
    }
  }, []);

  const doneDevocional = useCallback((idx) => {
    setState((s) => ({ ...s, dev: { d: today(), idx }, xp: s.xp + 10 }));
  }, []);

  const clearStats = useCallback(() => {
    setState((s) => ({ ...s, stats: {}, reviews: [] }));
  }, []);

  const toggle = useCallback((field) => {
    setState((s) => ({ ...s, [field]: !s[field] }));
  }, []);

  const setTheme = useCallback((theme) => setState((s) => ({ ...s, theme })), []);

  const reset = useCallback(() => setState({ ...INITIAL }), []);

  return { state, touchDay, completeLesson, recordAnswer, recordReview, recordRevisao,
           clearStats, doneDevocional, exportJSON, importJSON, toggle, setTheme, reset };
}

// --- consultas derivadas -----------------------------------------------------

export const isDone = (s, t, l) => !!s.done[`${t}-${l}`];

// módulos genéricos usam chave prefixada, para não colidir com o alfabeto
export const mDone  = (s, id, t, l) => !!s.done[`${id}:${t}-${l}`];
export const mCount = (s, id, t) => [0, 1, 2, 3].filter((l) => mDone(s, id, t, l)).length;
export const mFull  = (s, id, t) => mCount(s, id, t) === 4;
export const mOpen  = (s, id, t) => s.free || t === 0 || mFull(s, id, t - 1);
export function mNext(s, id, nTasks) {
  for (let t = 0; t < nTasks; t++)
    for (let l = 0; l < 4; l++) if (!mDone(s, id, t, l)) return [t, l];
  return null;
}
export const taskCount = (s, t) => [0, 1, 2, 3, 4].filter((l) => isDone(s, t, l)).length;
export const taskFull = (s, t) => taskCount(s, t) === 5;
export const taskOpen = (s, t) => s.free || t === 0 || taskFull(s, t - 1);
export const lessonOpen = (s, t, l) => s.free || l === 0 || isDone(s, t, l - 1);

export function nextSpot(s) {
  for (let t = 0; t < 8; t++)
    for (let l = 0; l < 5; l++) if (!isDone(s, t, l)) return [t, l];
  return null;
}
