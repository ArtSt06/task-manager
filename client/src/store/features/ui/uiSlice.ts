import type { PayloadAction } from "@reduxjs/toolkit";

import { createSlice } from "@reduxjs/toolkit";

interface UIState {
  theme: "light" | "dark";
  isFormOpen: boolean;
  editingTaskId: string | undefined;
}

const initialState: UIState = {
  theme: (localStorage.getItem("theme") as "light" | "dark") || "light",
  isFormOpen: false,
  editingTaskId: null,
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.theme = state.theme === "light" ? "dark" : "light";
      localStorage.setItem("theme", state.theme);
      document.documentElement.setAttribute("data-theme", state.theme);
    },
    setTheme: (state, action: PayloadAction<"light" | "dark">) => {
      state.theme = action.payload;
      localStorage.setItem("theme", action.payload);
      document.documentElement.setAttribute("data-theme", action.payload);
    },
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

export const { toggleTheme, setTheme, openForm, closeForm } = uiSlice.actions;
export default uiSlice.reducer;
