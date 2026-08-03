import type { RootState } from "@store/index";

export const selectSettings = (state: RootState) => state.settings;
export const selectTheme = (state: RootState) => state.settings.theme;
export const selectDefaultPriority = (state: RootState) =>
  state.settings.defaultPriority;
export const selectDefaultStatus = (state: RootState) =>
  state.settings.defaultStatus;
export const selectConfirmDelete = (state: RootState) =>
  
  state.settings.confirmDelete;
export const selectSettingsLoading = (state: RootState) =>
  state.settings.loading;
export const selectSettingsError = (state: RootState) => state.settings.error;
