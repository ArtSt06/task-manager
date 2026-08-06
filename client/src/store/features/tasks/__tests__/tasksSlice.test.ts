import type { Task, TaskMutationResponse } from "@shared/types";

import { describe, it, expect, jest, beforeEach } from "@jest/globals";

import tasksReducer, {
  fetchTasks,
  addTask,
  editTask,
  removeTask,
  removeAllTasks,
  setFilters,
  clearFilters,
} from "@store/features/tasks/tasksSlice";

import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  deleteAllTasks,
} from "@api/tasks";

jest.mock("@api/tasks", () => ({
  getTasks: jest.fn(),
  createTask: jest.fn(),
  updateTask: jest.fn(),
  deleteTask: jest.fn(),
  deleteAllTasks: jest.fn(),
}));

const mockedGetTasks = getTasks as jest.MockedFunction<typeof getTasks>;
const mockedCreateTask = createTask as jest.MockedFunction<typeof createTask>;
const mockedUpdateTask = updateTask as jest.MockedFunction<typeof updateTask>;
const mockedDeleteTask = deleteTask as jest.MockedFunction<typeof deleteTask>;
const mockedDeleteAllTasks = deleteAllTasks as jest.MockedFunction<
  typeof deleteAllTasks
>;

const mockTask: Task = {
  _id: "task-1",
  title: "Test task",
  description: "Description",
  priority: "medium",
  status: "todo",
  deadline: null,
  createdAt: "2025-01-10T08:00:00Z",
  updatedAt: "2025-01-10T08:00:00Z",
};

const mockMutationResponse: TaskMutationResponse = {
  task: mockTask,
  message: "Успешно",
};

describe("tasksSlice", () => {
  const initialState = {
    items: [],
    loading: false,
    error: null,
    filters: {},
  };

  it("should return initial state", () => {
    expect(tasksReducer(undefined, { type: "@@INIT" })).toEqual(initialState);
  });

  describe("synchronous reducers", () => {
    it("should set filters", () => {
      const state = tasksReducer(initialState, setFilters({ status: "todo" }));

      expect(state.filters).toEqual({ status: "todo" });
    });

    it("should clear filters", () => {
      const stateWithFilters = tasksReducer(
        initialState,
        setFilters({ status: "todo", priority: "high" }),
      );
      const clearedState = tasksReducer(stateWithFilters, clearFilters());

      expect(clearedState.filters).toEqual({});
    });
  });

  describe("async thunks", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    describe("fetchTasks", () => {
      it("should set loading true when pending", () => {
        const action = { type: fetchTasks.pending.type };
        const state = tasksReducer(initialState, action);

        expect(state.loading).toBe(true);
        expect(state.error).toBeNull();
      });

      it("should set tasks on fulfilled", async () => {
        const mockTasks = [mockTask];
        mockedGetTasks.mockResolvedValue(mockTasks);

        const action = await fetchTasks.fulfilled(mockTasks, "", {});
        const state = tasksReducer(initialState, action);

        expect(state.loading).toBe(false);
        expect(state.items).toEqual(mockTasks);
      });

      it("should set error on rejected", () => {
        const error = new Error("Ошибка загрузки");
        const action = { type: fetchTasks.rejected.type, error };

        const state = tasksReducer(initialState, action);
        expect(state.loading).toBe(false);
        expect(state.error).toBe("Ошибка загрузки");
      });
    });

    describe("addTask", () => {
      it("should add task on fulfilled", async () => {
        mockedCreateTask.mockResolvedValue(mockMutationResponse);

        const action = await addTask.fulfilled(mockTask, "", { title: "Test" });
        const state = tasksReducer(initialState, action);

        expect(state.items).toHaveLength(1);
        expect(state.items[0]).toEqual(mockTask);
      });
    });

    describe("editTask", () => {
      it("should update task on fulfilled", async () => {
        const updatedTask = { ...mockTask, title: "Обновлённая задача" };
        const updatedMutationResponse: TaskMutationResponse = {
          task: updatedTask,
          message: "Успешно",
        };
        mockedUpdateTask.mockResolvedValue(updatedMutationResponse);

        const stateWithTask = {
          ...initialState,
          items: [mockTask],
        };

        const action = await editTask.fulfilled(updatedTask, "", {
          id: "task-1",
          updates: { title: "Обновлённая задача" },
        });
        const state = tasksReducer(stateWithTask, action);

        expect(state.items[0].title).toBe("Обновлённая задача");
      });

      it("should not update if task not found", async () => {
        const updatedTask = { ...mockTask, title: "Обновлённая задача" };
        const updatedMutationResponse: TaskMutationResponse = {
          task: updatedTask,
          message: "Успешно",
        };
        mockedUpdateTask.mockResolvedValue(updatedMutationResponse);

        const action = await editTask.fulfilled(updatedTask, "", {
          id: "non-existent",
          updates: { title: "Обновлённая задача" },
        });
        const state = tasksReducer(initialState, action);

        expect(state.items).toHaveLength(0);
      });
    });

    describe("removeTask", () => {
      it("should remove task on fulfilled", async () => {
        const deleteResponse: TaskMutationResponse = {
          task: mockTask,
          message: "Удалено",
        };
        mockedDeleteTask.mockResolvedValue(deleteResponse);

        const stateWithTask = {
          ...initialState,
          items: [mockTask],
        };

        const action = await removeTask.fulfilled("task-1", "", "task-1");
        const state = tasksReducer(stateWithTask, action);

        expect(state.items).toHaveLength(0);
      });
    });

    describe("removeAllTasks", () => {
      it("should clear items and filters on fulfilled", async () => {
        const deleteAllResponse: TaskMutationResponse = {
          task: null,
          message: "Все удалены",
        };
        mockedDeleteAllTasks.mockResolvedValue(deleteAllResponse);

        const stateWithTasksAndFilters = {
          ...initialState,
          items: [mockTask],
          filters: { status: "todo" },
        };

        const action = { type: removeAllTasks.fulfilled.type };
        const state = tasksReducer(stateWithTasksAndFilters, action);

        expect(state.items).toHaveLength(0);
        expect(state.filters).toEqual({});
      });

      it("should set error on rejected", () => {
        const error = new Error("Ошибка удаления");
        const action = { type: removeAllTasks.rejected.type, error };
        const state = tasksReducer(initialState, action);
        
        expect(state.loading).toBe(false);
        expect(state.error).toBe("Ошибка удаления");
      });
    });
  });
});
