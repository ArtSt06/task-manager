import type { PayloadAction } from "@reduxjs/toolkit";

import { createSlice } from "@reduxjs/toolkit";

interface UIState {
  isFormOpen: boolean;
  editingTaskId: string | undefined;
}

const initialState: UIState = {
  isFormOpen: false,
  editingTaskId: null,
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    openForm: (state, action: PayloadAction<string | undefined>) => {
      state.isFormOpen = true;
      state.editingTaskId = action.payload;
    },
    closeForm: (state) => {
      state.isFormOpen = false;
      state.editingTaskId = undefined;
    },
  },
});

export const { openForm, closeForm } = uiSlice.actions;
export default uiSlice.reducer;
