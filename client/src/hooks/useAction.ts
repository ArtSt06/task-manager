import { useState, useCallback } from "react";

type AsyncAction<T, Args extends unknown[]> = (...args: Args) => Promise<T>;

interface ActionResult<T> {
  success: boolean;
  data: T | null;
  error: string | null;
}

export const useAction = <T, Args extends unknown[] = unknown[]>(
  action: AsyncAction<T, Args>,
) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<T | null>(null);

  const execute = useCallback(
    async (...args: Args): Promise<ActionResult<T>> => {
      setLoading(true);
      setError(null);
      
      try {
        const result = await action(...args);
        setData(result);
        return { success: true, data: result, error: null };
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Произошла ошибка";
        setError(message);
        return { success: false, data: null, error: message };
      } finally {
        setLoading(false);
      }
    },
    [action],
  );

  return { execute, loading, error, data };
};
