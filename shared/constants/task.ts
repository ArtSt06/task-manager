import { Priority, Status } from "../types/task.types";

export const PRIORITIES: Priority[] = ["low", "medium", "high"];
export const STATUSES: Status[] = ["todo", "inProgress", "done"];

export const PRIORITY_LABELS: Record<Priority, string> = {
  low: "Низкий",
  medium: "Средний",
  high: "Высокий",
};

export const STATUS_LABELS: Record<Status, string> = {
  todo: "К выполнению",
  inProgress: "В процессе",
  done: "Выполнено",
};
