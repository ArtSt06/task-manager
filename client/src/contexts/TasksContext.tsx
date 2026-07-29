import { createContext, useContext, useRef } from "react";
import type { ReactNode } from "react";

interface TasksContextValue {
  refreshTasks: () => void;
  setRefreshFunction: (fn: () => void) => void;
}

const TasksContext = createContext<TasksContextValue | null>(null);

export const TasksProvider = ({ children }: { children: ReactNode }) => {
  const refreshFunctionRef = useRef<() => void>(() => {});

  const setRefreshFunction = (fn: () => void) => {
    refreshFunctionRef.current = fn;
  };

  const refreshTasks = () => {
    refreshFunctionRef.current();
  };

  return (
    <TasksContext.Provider value={{ refreshTasks, setRefreshFunction }}>
      {children}
    </TasksContext.Provider>
  );
};

export const useTasksContext = () => {
  const context = useContext(TasksContext);
  if (!context) {
    throw new Error("useTasksContext must be used within TasksProvider");
  }
  return context;
};
