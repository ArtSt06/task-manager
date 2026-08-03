import type { RootState } from "@store/index";

export const selectIsFormOpen = (state: RootState) => state.ui.isFormOpen;
export const selectEditingTaskId = (state: RootState) => state.ui.editingTaskId;
