import { lazy, useEffect } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import { useAppSelector } from "@store/reduxHooks";
import { selectTheme } from "@store/features/ui/uiSelectors";

import AppLayout from "@components/layout/AppLayout";
import TaskFormModal from "@components/tasks/TaskFormModal";

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
      path: "/",
      element: <AppLayout />,
      children: [
        { index: true, element: <TasksPage /> },
        { path: "statistics", element: <StatisticsPage /> },
        { path: "settings", element: <SettingsPage /> },
      ],
    },
  ]);

  return (
    <>
      <RouterProvider router={router} />
      <TaskFormModal />
    </>
  );
};

export default App;
