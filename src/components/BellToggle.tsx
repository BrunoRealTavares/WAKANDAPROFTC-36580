"use client";

import { useEffect, useState, useSyncExternalStore } from "react";

const STORAGE_KEY = "wp_robo_revelado";
const CHANGE_EVENT = "wp-bell-change";

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener(CHANGE_EVENT, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(CHANGE_EVENT, callback);
  };
}

function getSnapshot() {
  try {
    return localStorage.getItem(STORAGE_KEY) === "1";
  } catch {
    return false;
  }
}

function getServerSnapshot() {
  return false;
}

/**
 * BellToggle — sino "avise-me" para a revelação do robô.
 * A preferência fica apenas no localStorage do visitante (sem e-mail,
 * sem cookies, sem coleta de dados) e é sincronizada entre abas.
 */
export function BellToggle() {
  const ativo = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const [mostrarAviso, setMostrarAviso] = useState(false);

  const toggle = () => {
    const novo = !ativo;
    try {
      localStorage.setItem(STORAGE_KEY, novo ? "1" : "0");
    } catch {
      // localStorage indisponível — segue com o estado em memória
    }
    window.dispatchEvent(new Event(CHANGE_EVENT));
    if (novo) setMostrarAviso(true);
  };

  useEffect(() => {
    if (!mostrarAviso) return;
    const t = setTimeout(() => setMostrarAviso(false), 4000);
    return () => clearTimeout(t);
  }, [mostrarAviso]);

  return (
    <div className="relative inline-block">
      <button
        type="button"
        onClick={toggle}
        className={`relative rounded-full p-2 transition-colors ${
          ativo
            ? "bg-[var(--wp-gold)] text-[var(--wp-void)]"
            : "bg-[var(--wp-edge)] text-[var(--wp-silver-mute)] hover:bg-[var(--wp-graphite)] hover:text-[var(--wp-white)]"
        }`}
        aria-pressed={ativo}
        aria-label={
          ativo
            ? "Desativar aviso de revelação do robô"
            : "Avisar quando o robô for revelado"
        }
      >
        <svg
          className="h-5 w-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.343C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          />
        </svg>
        {ativo && (
          <span
            aria-hidden="true"
            className="absolute -right-1 -top-1 h-2 w-2 animate-pulse rounded-full bg-[var(--wp-red)]"
          />
        )}
      </button>

      {mostrarAviso && (
        <div
          role="status"
          className="absolute -top-9 right-0 z-50 whitespace-nowrap rounded border border-[var(--wp-edge)] bg-[var(--wp-coal)] px-3 py-2 text-xs text-[var(--wp-silver-mute)] shadow-lg"
        >
          Avisaremos quando o Vibranium for revelado.
        </div>
      )}
    </div>
  );
}
