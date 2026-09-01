import { useCallback, useEffect, useState } from "react";

const KEY = "koine:react:v1";

const INITIAL = {
  done: {},        // { "0-1": true }  →  tarefa-lição
  xp: 0,
  streak: 0,
  last: null,      // último dia de estudo, "AAAA-MM-DD"
  voice: true,
  theme: "light",
  stats: {},       // { indiceDaLetra: { seen, wrong } }
  reviews: [],     // histórico de rodadas: { d, total, wrong }
};

const today = () => new Date().toISOString().slice(0, 10);
const yesterday = () => new Date(Date.now() - 864e5).toISOString().slice(0, 10);

function read() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return INITIAL;
    const s = { ...INITIAL, ...JSON.parse(raw) };
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

  const completeLesson = useCallback((t, l) => {
    setState((s) => {
      const key = `${t}-${l}`;
      const first = !s.done[key];
      return { ...s, done: { ...s.done, [key]: true }, xp: s.xp + (first ? 15 : 5) };
    });
  }, []);

  // registra cada resposta da revisão geral, por letra
  const recordAnswer = useCallback((letterIndex, ok) => {
    setState((s) => {
      const cur = s.stats[letterIndex] || { seen: 0, wrong: 0 };
      return {
        ...s,
        stats: {
          ...s.stats,
          [letterIndex]: { seen: cur.seen + 1, wrong: cur.wrong + (ok ? 0 : 1) },
        },
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

  const clearStats = useCallback(() => {
    setState((s) => ({ ...s, stats: {}, reviews: [] }));
  }, []);

  const toggle = useCallback((field) => {
    setState((s) => ({ ...s, [field]: !s[field] }));
  }, []);

  const setTheme = useCallback((theme) => setState((s) => ({ ...s, theme })), []);

  const reset = useCallback(() => setState({ ...INITIAL }), []);

  return { state, touchDay, completeLesson, recordAnswer, recordReview,
           clearStats, toggle, setTheme, reset };
}

// --- consultas derivadas -----------------------------------------------------

export const isDone = (s, t, l) => !!s.done[`${t}-${l}`];
export const taskCount = (s, t) => [0, 1, 2, 3, 4].filter((l) => isDone(s, t, l)).length;
export const taskFull = (s, t) => taskCount(s, t) === 5;
export const taskOpen = (s, t) => t === 0 || taskFull(s, t - 1);

export function nextSpot(s) {
  for (let t = 0; t < 8; t++)
    for (let l = 0; l < 5; l++) if (!isDone(s, t, l)) return [t, l];
  return null;
}
