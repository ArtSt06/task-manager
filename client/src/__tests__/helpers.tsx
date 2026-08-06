import { render, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { configureStore } from "@reduxjs/toolkit";

import { AuthProvider } from "@contexts/AuthContext";

import tasksReducer from "@store/features/tasks/tasksSlice";
import uiReducer from "@store/features/ui/uiSlice";
import settingsReducer from "@store/features/settings/settingsSlice";

export const createTestStore = (preloadedState = {}) => {
  return configureStore({
    reducer: {
      tasks: tasksReducer,
      ui: uiReducer,
      settings: settingsReducer,
    },
    preloadedState,
  });
};

interface RenderWithAuthOptions {
  initialPath?: string;
  store?: ReturnType<typeof createTestStore>;
}

export const renderWithAuth = (
  routes: React.ReactNode,
  { initialPath = "/", store = createTestStore() }: RenderWithAuthOptions = {},
) => {
  return render(
    <Provider store={store}>
      <MemoryRouter initialEntries={[initialPath]}>
        <AuthProvider>{routes}</AuthProvider>
      </MemoryRouter>
    </Provider>,
  );
};

export const mockUser = {
  uid: "mock-uid-123",
  email: "test@example.com",
};

export const waitForElement = async (callback: () => unknown) => {
  return await waitFor(callback, { timeout: 3000 });
};
