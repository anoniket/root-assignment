import { useCallback, useEffect, useState } from "react";
import { clearStorage, loadFromStorage, saveToStorage } from "../lib/storage";
import { STEP_ORDER, type FormData, type PersistedState } from "./types";

const initial: PersistedState = {
  step: "account-type",
  data: {},
};

export function useSignupState() {
  const [state, setState] = useState<PersistedState>(() => {
    const stored = loadFromStorage<PersistedState>();
    if (!stored) return initial;
    if (!STEP_ORDER.includes(stored.step)) return initial;
    return stored;
  });

  useEffect(() => {
    saveToStorage(state);
  }, [state]);

  const goNext = useCallback((patch: Partial<FormData>) => {
    setState((prev) => {
      const idx = STEP_ORDER.indexOf(prev.step);
      const next = STEP_ORDER[Math.min(idx + 1, STEP_ORDER.length - 1)];
      return { step: next, data: { ...prev.data, ...patch } };
    });
  }, []);

  const goBack = useCallback(() => {
    setState((prev) => {
      const idx = STEP_ORDER.indexOf(prev.step);
      const prevStep = STEP_ORDER[Math.max(idx - 1, 0)];
      return { ...prev, step: prevStep };
    });
  }, []);

  const reset = useCallback(() => {
    clearStorage();
    setState(initial);
  }, []);

  const stepIndex = STEP_ORDER.indexOf(state.step);

  return {
    step: state.step,
    data: state.data,
    stepIndex,
    totalSteps: STEP_ORDER.length,
    goNext,
    goBack,
    reset,
  };
}
