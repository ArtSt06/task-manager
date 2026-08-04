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
  onConfirm: () => void;
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
    onConfirm: () => {},
  },
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    openTaskForm: (state, action: PayloadAction<string | null>) => {
      state.taskForm.isOpen = true;
      state.taskForm.editingTaskId = action.payload;
    },
    closeTaskForm: (state) => {
      state.taskForm.isOpen = false;
      state.taskForm.editingTaskId = null;
    },

    showConfirm: (state, action: PayloadAction<ConfirmState>) => {
      state.confirm.isOpen = true;
      state.confirm.onConfirm = action.payload.onConfirm;
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
