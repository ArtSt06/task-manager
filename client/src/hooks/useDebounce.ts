import { useCallback, useRef, useEffect } from "react";

type CallbackFunction = (...args: unknown[]) => void;

export const useDebounce = (callback: CallbackFunction, delay: number) => {
  const timeoutRef = useRef<number | null>(null);
  const callbackRef = useRef<CallbackFunction>(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  const debounced = useCallback(
    (...args: unknown[]) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        callbackRef.current(...args);
      }, delay);
    },
    [delay],
  );

  const cancel = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  useEffect(() => {
    return cancel;
  }, [cancel]);

  return { debounced, cancel };
};
