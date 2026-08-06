import { lazy, useLayoutEffect } from "react";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";

import { Toaster } from "react-hot-toast";

import { AuthProvider } from "@contexts/AuthContext";
import { ConfirmProvider, useConfirm } from "@contexts/ConfirmContext";
import { useAppDispatch, useAppSelector } from "@store/reduxHooks";

import {
  selectTheme,
  selectSettingsLoading,
} from "@store/features/settings/settingsSelectors";
import { selectTaskForm, selectConfirm } from "@store/features/ui/uiSelectors";
import { closeTaskForm } from "@store/features/ui/uiSlice";

import PrivateRoute from "@components/common/PrivateRoute";
import AppLayout from "@components/layout/AppLayout";
import TaskFormModal from "@components/tasks/TaskFormModal";
import ConfirmModal from "@components/common/ConfirmModal";
import Loader from "@components/common/Loader";
import ErrorDisplay from "@components/common/ErrorDisplay";
import LoginPage from "@pages/LoginPage";
import RegisterPage from "@pages/RegisterPage";

const TasksPage = lazy(() => import("@pages/TasksPage"));
const StatisticsPage = lazy(() => import("@pages/StatisticsPage"));
const SettingsPage = lazy(() => import("@pages/SettingsPage"));

const applyTheme = (theme: "light" | "dark" | "system") => {
  if (theme === "system") {
    const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    document.documentElement.setAttribute(
      "data-theme",
      isDark ? "dark" : "light",
    );
  } else {
    document.documentElement.setAttribute("data-theme", theme);
  }
};

const AppContent = () => {
  const dispatch = useAppDispatch();
  const theme = useAppSelector(selectTheme);
  const settingsLoading = useAppSelector(selectSettingsLoading);
  const taskForm = useAppSelector(selectTaskForm);
  const confirmState = useAppSelector(selectConfirm);

  const { handleConfirm, handleCancel, handleClose } = useConfirm();

  useLayoutEffect(() => {
    applyTheme(theme);
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = (event: MediaQueryListEvent) => {
      if (theme === "system") {
        document.documentElement.setAttribute(
          "data-theme",
          event.matches ? "dark" : "light",
        );
      }
    };
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, [theme]);

  const handleCloseTaskForm = () => {
    dispatch(closeTaskForm());
  };

  const router = createBrowserRouter([
    { path: "/sign-in", element: <LoginPage /> },
    { path: "/sign-up", element: <RegisterPage /> },
    {
      path: "/",
      element: <PrivateRoute />,
      children: [
        {
          path: "/",
          element: <AppLayout />,
          children: [
            { index: true, element: <Navigate to="/tasks" replace /> },
            {
              path: "tasks",
              element: <TasksPage />,
              errorElement: (
                <ErrorDisplay
                  fullPage
                  title="Упс!"
                  message="Страница задач недоступна"
                />
              ),
            },
            {
              path: "statistics",
              element: <StatisticsPage />,
              errorElement: (
                <ErrorDisplay
                  fullPage
                  title="Упс!"
                  message="Страница статистики недоступна"
                />
              ),
            },
            {
              path: "settings",
              element: <SettingsPage />,
              errorElement: (
                <ErrorDisplay
                  fullPage
                  title="Упс!"
                  message="Страница настроек недоступна"
                />
              ),
            },
          ],
        },
      ],
    },
  ]);

  if (settingsLoading) {
    return <Loader text="Загрузка пользовательских настроек..." />;
  }

  return (
    <>
      <RouterProvider router={router} />

      <TaskFormModal
        isOpen={taskForm.isOpen}
        onClose={handleCloseTaskForm}
        editingTaskId={taskForm.editingTaskId}
      />

      <ConfirmModal
        isOpen={confirmState.isOpen}
        onClose={handleClose}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
        title={confirmState.title}
        message={confirmState.message}
        confirmText={confirmState.confirmText}
        cancelText={confirmState.cancelText}
      />

      <Toaster
        position="bottom-right"
        toastOptions={{
          duration: 3000,
          className: "custom-toast",
          success: {
            className: "custom-toast-success",
          },
          error: {
            className: "custom-toast-error",
          },
        }}
      />
    </>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <ConfirmProvider>
        <AppContent />
      </ConfirmProvider>
    </AuthProvider>
  );
};

export default App;
