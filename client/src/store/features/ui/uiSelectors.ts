import type { RootState } from "@store/index";

export const selectTaskForm = (state: RootState) => state.ui.taskForm;

export const selectConfirm = (state: RootState) => state.ui.confirm;
