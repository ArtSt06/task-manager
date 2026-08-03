import type { Task } from "@shared/types";

export const exportTasksToJson = (tasks: Task[]) => {
  const cleanedTasks = tasks.map(({ _id, ...rest }) => rest);
  const data = JSON.stringify(cleanedTasks, null, 2);
  const blob = new Blob([data], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = `tasks_${new Date().toISOString().slice(0, 10)}.json`;
  link.click();

  URL.revokeObjectURL(url);
};
