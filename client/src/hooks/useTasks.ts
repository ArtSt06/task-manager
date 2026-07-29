import { useEffect, useCallback } from "react";

import { useAction } from "@hooks/useAction";
import { getTasks } from "@api/tasks";

interface UseTasksOptions {
  status?: string;
  priority?: string;
  search?: string;
}

export const useTasks = (options?: UseTasksOptions) => {
  const fetchTasks = useCallback(() => getTasks(options), [options]);

  const { execute, loading, error, data } = useAction(fetchTasks);

  useEffect(() => {
    execute();
  }, [execute]);

  return {
    tasks: data || [],
    loading,
    error,
    refetch: execute,
  };
};
