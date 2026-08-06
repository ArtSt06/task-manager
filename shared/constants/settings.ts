import type { Theme, Settings } from "../types/settings.types";

export const THEMES: Theme[] = ["light", "dark", "system"];

export const THEME_LABELS: Record<Theme, string> = {
  light: "Светлая",
  dark: "Тёмная",
  system: "Системная",
};

export const DEFAULT_SETTINGS: Settings = {
  theme: "system",

  defaultPriority: "medium",
  defaultStatus: "todo",

  confirmDelete: true,
};
