import type { PayloadAction } from "@reduxjs/toolkit";
import type { Task } from "@shared/types";

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  deleteAllTasks,
} from "@api/tasks";

export const fetchTasks = createAsyncThunk(
  "tasks/fetchTasks",
  async (filters?: { status?: string; priority?: string; search?: string }) => {
    return await getTasks(filters);
  },
);

export const addTask = createAsyncThunk(
  "tasks/addTask",
  async (taskData: Partial<Task>) => {
    const response = await createTask(taskData);
    return response.task!;
  },
);

export const editTask = createAsyncThunk(
  "tasks/editTask",
  async ({ id, updates }: { id: string; updates: Partial<Task> }) => {
    const response = await updateTask(id, updates);
    return response.task!;
  },
);

export const removeTask = createAsyncThunk(
  "tasks/removeTask",
  async (id: string) => {
    await deleteTask(id);
    return id;
  },
);

export const removeAllTasks = createAsyncThunk(
  "tasks/removeAllTasks",
  async () => {
    await deleteAllTasks();
  },
);

interface TasksState {
  items: Task[];
  loading: boolean;
  error: string | null;
  filters: {
    status?: string;
    priority?: string;
    search?: string;
  };
}

const initialState: TasksState = {
  items: [],
  loading: false,
  error: null,
  filters: {},
};

const tasksSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    setFilters: (
      state,
      action: PayloadAction<{
        status?: string;
        priority?: string;
        search?: string;
      }>,
    ) => {
      state.filters = action.payload;
    },
    clearFilters: (state) => {
      state.filters = {};
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Ошибка загрузки задач";
      })
      .addCase(addTask.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
      })
      .addCase(editTask.fulfilled, (state, action) => {
        const index = state.items.findIndex(
          (task) => task._id === action.payload._id,
        );
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(removeTask.fulfilled, (state, action) => {
        state.items = state.items.filter((task) => task._id !== action.payload);
      })
      .addCase(removeAllTasks.fulfilled, (state) => {
        state.items = [];
        state.filters = {};
      })
      .addCase(removeAllTasks.rejected, (state, action) => {
        state.error = action.error.message || "Ошибка удаления задач";
      });
  },
});

export const { setFilters, clearFilters } = tasksSlice.actions;
export default tasksSlice.reducer;
