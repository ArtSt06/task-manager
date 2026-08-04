import type { RootState } from "@store/index";
import type { Task } from "@shared/types";

import { createSelector } from "@reduxjs/toolkit";

import { formatDate } from "@utils/date";

export const selectAllTasks = (state: RootState) => state.tasks.items;
export const selectTasksFilters = (state: RootState) => state.tasks.filters;

export const selectTasksLoading = (state: RootState) => state.tasks.loading;
export const selectTasksError = (state: RootState) => state.tasks.error;

export const selectGroupedTasks = createSelector(
  [selectAllTasks],
  (tasks: Task[]) => {
    const groups: Record<
      string,
      { dateKey: string; displayDate: string; tasks: Task[] }
    > = {};
    const noDeadline: Task[] = [];

    tasks.forEach((task) => {
      if (task.deadline) {
        const dateKey = task.deadline.slice(0, 10);
        const displayDate = formatDate(task.deadline);

        if (!groups[dateKey]) {
          groups[dateKey] = { dateKey, displayDate, tasks: [] };
        }
        groups[dateKey].tasks.push(task);
      } else {
        noDeadline.push(task);
      }
    });

    const sortedGroups = Object.keys(groups)
      .sort()
      .map((key) => ({
        dateKey: key,
        displayDate: groups[key].displayDate,
        tasks: groups[key].tasks.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        ),
      }));

    const sortedNoDeadline = [...noDeadline].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );

    return {
      groups: sortedGroups,
      noDeadline: sortedNoDeadline,
    };
  },
);
