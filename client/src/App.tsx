import { lazy, useLayoutEffect } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AuthProvider } from "@contexts/AuthContext";
import { useAppSelector } from "@store/reduxHooks";
import {
  selectTheme,
  selectSettingsLoading,
} from "@store/features/settings/settingsSelectors";
import PrivateRoute from "@components/common/PrivateRoute";
import AppLayout from "@components/layout/AppLayout";
import TaskFormModal from "@components/tasks/TaskFormModal";
import Loader from "@components/common/Loader";
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
  const theme = useAppSelector(selectTheme);
  const settingsLoading = useAppSelector(selectSettingsLoading);

  useLayoutEffect(() => {
    applyTheme(theme);
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = (e: MediaQueryListEvent) => {
      if (theme === "system") {
        document.documentElement.setAttribute(
          "data-theme",
          e.matches ? "dark" : "light",
        );
      }
    };
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, [theme]);

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
            { index: true, element: <TasksPage /> },
            { path: "statistics", element: <StatisticsPage /> },
            { path: "settings", element: <SettingsPage /> },
          ],
        },
      ],
    },
  ]);

  if (settingsLoading) {
    return <Loader fullPage text="Загрузка настроек..." />;
  }

  return (
    <>
      <RouterProvider router={router} />
      <TaskFormModal />
    </>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;
