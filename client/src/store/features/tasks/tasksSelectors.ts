import type { RootState } from "@store/index";

export const selectAllTasks = (state: RootState) => state.tasks.items;
export const selectTasksLoading = (state: RootState) => state.tasks.loading;
export const selectTasksError = (state: RootState) => state.tasks.error;
export const selectTasksFilters = (state: RootState) => state.tasks.filters;
