import { describe, it, expect } from "@jest/globals";
import uiReducer, {
  openTaskForm,
  closeTaskForm,
  showConfirm,
  closeConfirm,
} from "@store/features/ui/uiSlice";

describe("uiSlice", () => {
  const initialState = {
    taskForm: {
      isOpen: false,
      editingTaskId: null,
    },
    confirm: {
      isOpen: false,
      message: "",
      title: "",
      confirmText: "",
      cancelText: "",
    },
  };

  it("should return initial state", () => {
    expect(uiReducer(undefined, { type: "@@INIT" })).toEqual(initialState);
  });

  describe("taskForm", () => {
    it("should open task form with editingTaskId", () => {
      const state = uiReducer(
        initialState,
        openTaskForm({ editingTaskId: "task-1" }),
      );

      expect(state.taskForm.isOpen).toBe(true);
      expect(state.taskForm.editingTaskId).toBe("task-1");
    });

    it("should close task form", () => {
      const stateWithOpen = uiReducer(
        initialState,
        openTaskForm({ editingTaskId: "task-1" }),
      );
      const closedState = uiReducer(stateWithOpen, closeTaskForm());

      expect(closedState.taskForm.isOpen).toBe(false);
      expect(closedState.taskForm.editingTaskId).toBeNull();
    });
  });

  describe("confirm", () => {
    it("should show confirm with provided options", () => {
      const state = uiReducer(
        initialState,
        showConfirm({
          message: "Подтвердите действие",
          title: "Подтверждение",
          confirmText: "Да",
          cancelText: "Нет",
        }),
      );

      expect(state.confirm.isOpen).toBe(true);
      expect(state.confirm.message).toBe("Подтвердите действие");
      expect(state.confirm.title).toBe("Подтверждение");
      expect(state.confirm.confirmText).toBe("Да");
      expect(state.confirm.cancelText).toBe("Нет");
    });

    it("should use default values when options are not provided", () => {
      const state = uiReducer(initialState, showConfirm({ message: "Test" }));

      expect(state.confirm.isOpen).toBe(true);
      expect(state.confirm.message).toBe("Test");
      expect(state.confirm.title).toBe("Модальное окно");
      expect(state.confirm.confirmText).toBe("Подтвердить");
      expect(state.confirm.cancelText).toBe("Отмена");
    });

    it("should close confirm", () => {
      const stateWithConfirm = uiReducer(
        initialState,
        showConfirm({ message: "Test" }),
      );
      const closedState = uiReducer(stateWithConfirm, closeConfirm());

      expect(closedState.confirm.isOpen).toBe(false);
      expect(closedState.confirm.message).toBe("Test");
      expect(closedState.confirm.title).toBe("Модальное окно");
    });
  });
});
