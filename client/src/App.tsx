import { lazy, useEffect } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import { AuthProvider } from "@contexts/AuthContext";

import { useAppSelector } from "@store/reduxHooks";
import { selectTheme } from "@store/features/ui/uiSelectors";

import PrivateRoute from "@components/common/PrivateRoute";
import AppLayout from "@components/layout/AppLayout";
import TaskFormModal from "@components/tasks/TaskFormModal";
import LoginPage from "@pages/LoginPage";
import RegisterPage from "@pages/RegisterPage";

const TasksPage = lazy(() => import("@pages/TasksPage"));
const StatisticsPage = lazy(() => import("@pages/StatisticsPage"));
const SettingsPage = lazy(() => import("@pages/SettingsPage"));

const App = () => {
  const theme = useAppSelector(selectTheme);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const router = createBrowserRouter([
    {
      path: "/sign-in",
      element: <LoginPage />,
    },
    {
      path: "/sign-up",
      element: <RegisterPage />,
    },
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

  return (
    <AuthProvider>
      <RouterProvider router={router} />
      <TaskFormModal />
    </AuthProvider>
  );
};

export default App;
