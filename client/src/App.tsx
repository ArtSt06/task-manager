import { lazy, useState } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import { TasksProvider, useTasksContext } from "@contexts/TasksContext";

import AppLayout from "@components/layout/AppLayout";
import TaskFormModal from "@components/tasks/TaskFormModal";

const TasksPage = lazy(() => import("@pages/TasksPage"));
const StatisticsPage = lazy(() => import("@pages/StatisticsPage"));
const SettingsPage = lazy(() => import("@pages/SettingsPage"));

const AppContent = () => {
  const { refreshTasks } = useTasksContext();
  const [isFormOpen, setIsFormOpen] = useState(false);

  const handleOpenForm = () => {
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
  };

  const handleSuccess = () => {
    refreshTasks();
    setIsFormOpen(false);
  };

  const router = createBrowserRouter([
    {
      path: "/",
      element: <AppLayout onCreateTask={handleOpenForm} />,
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
      <TaskFormModal
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        onSuccess={handleSuccess}
        initialData={null}
      />
    </>
  );
};

const App = () => {
  return (
    <TasksProvider>
      <AppContent />
    </TasksProvider>
  );
};

export default App;
