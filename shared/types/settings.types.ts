import type { Priority, Status } from "@shared/types/task.types";

export type Theme = "light" | "dark" | "system";

export interface Settings {
  theme: Theme;

  defaultPriority: Priority;
  defaultStatus: Exclude<Status, "done">;

  confirmDelete: boolean;
}
