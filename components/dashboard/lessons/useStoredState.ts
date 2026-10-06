"use client";

import { useCallback, useSyncExternalStore } from "react";

// Estado pequeno guardado no localStorage (aba aberta e checklist da missão), para o aluno
// não perder o lugar quando o celular recarrega a página ao voltar do GitHub.
// No servidor e sem localStorage disponível, usa o valor padrão — nada quebra.

const listeners = new Set<() => void>();
const memory = new Map<string, string>();

function read(key: string): string | null {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return memory.get(key) ?? null;
  }
}

function write(key: string, value: string) {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    memory.set(key, value);
  }
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  window.addEventListener("storage", listener);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", listener);
  };
}

export function useStoredState<T>(key: string, fallback: T): [T, (value: T) => void] {
  const raw = useSyncExternalStore(
    subscribe,
    () => read(key),
    () => null
  );

  let value = fallback;
  if (raw !== null) {
    try {
      value = JSON.parse(raw) as T;
    } catch {
      value = fallback;
    }
  }

  const set = useCallback((next: T) => write(key, JSON.stringify(next)), [key]);
  return [value, set];
}
