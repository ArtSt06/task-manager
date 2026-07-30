import { configureStore } from "@reduxjs/toolkit";

import tasksReducer from "@store/features/tasks/tasksSlice";
import uiReducer from "@store/features/ui/uiSlice";

export const store = configureStore({
  reducer: {
    tasks: tasksReducer,
    ui: uiReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
