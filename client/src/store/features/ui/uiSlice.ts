import type { PayloadAction } from "@reduxjs/toolkit";

import { createSlice } from "@reduxjs/toolkit";

interface Modal {
  isOpen: boolean;
}

interface TaskFormState extends Modal {
  editingTaskId: string | null;
}

interface ConfirmState extends Modal {
  message: string;
  title?: string;
  confirmText?: string;
  cancelText?: string;
}

interface UIState {
  taskForm: TaskFormState;
  confirm: ConfirmState;
}

const initialState: UIState = {
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

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    openTaskForm: (
      state,
      action: PayloadAction<Omit<TaskFormState, "isOpen">>,
    ) => {
      state.taskForm.isOpen = true;
      state.taskForm.editingTaskId = action.payload.editingTaskId;
    },
    closeTaskForm: (state) => {
      state.taskForm.isOpen = false;
      state.taskForm.editingTaskId = null;
    },

    showConfirm: (
      state,
      action: PayloadAction<Omit<ConfirmState, "isOpen">>,
    ) => {
      state.confirm.isOpen = true;
      state.confirm.message = action.payload.message;
      state.confirm.title = action.payload.title || "Модальное окно";
      state.confirm.confirmText = action.payload.confirmText || "Подтвердить";
      state.confirm.cancelText = action.payload.cancelText || "Отмена";
    },
    closeConfirm: (state) => {
      state.confirm.isOpen = false;
    },
  },
});

export const { openTaskForm, closeTaskForm, showConfirm, closeConfirm } =
  uiSlice.actions;

export default uiSlice.reducer;
