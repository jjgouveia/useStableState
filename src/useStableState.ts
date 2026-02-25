import { useRef, useState, useCallback } from "react";
import { shallowEqual } from "./shallowEqual";

type CompareFn<T> = (a: T, b: T) => boolean;

export interface StableOptions<T> {
  compare?: CompareFn<T>;
}

export function useStableState<T>(
  initial: T | (() => T),
  options?: StableOptions<T>
) {
  const compare = options?.compare ?? shallowEqual;

  const [state, internalSetState] = useState<T>(initial);
  const stateRef = useRef(state);

  const setState = useCallback(
    (next: T | ((prev: T) => T)) => {
      const value =
        typeof next === "function"
          ? (next as (prev: T) => T)(stateRef.current)
          : next;

      if (!compare(stateRef.current, value)) {
        stateRef.current = value;
        internalSetState(value);
      }
    },
    [compare]
  );

  return [state, setState] as const;
}
