import { useState, useEffect } from "react";

import { useAppDispatch, useAppSelector } from "@store/reduxHooks";
import { fetchTasks } from "@store/features/tasks/tasksSlice";
import {
  selectTasksLoading,
  selectTasksError,
} from "@store/features/tasks/tasksSelectors";

import TaskFilters from "@components/tasks/TaskFilters";
import TasksList from "@components/tasks/TasksList";
import Loader from "@components/common/Loader";
import ErrorDisplay from "@components/common/ErrorDisplay";

import "./TasksPage.scss";

const TasksPage = () => {
  const dispatch = useAppDispatch();
  const loading = useAppSelector(selectTasksLoading);
  const error = useAppSelector(selectTasksError);

  const [filters, setFilters] = useState<{
    status?: string;
    priority?: string;
    search?: string;
  }>({});

  useEffect(() => {
    dispatch(fetchTasks(filters));
  }, [dispatch, filters]);

  const handleRetry = () => {
    dispatch(fetchTasks(filters));
  };

  if (error) {
    return (
      <ErrorDisplay
        title="Ошибка загрузки задач"
        message={error}
        fullPage={true}
        onRetry={handleRetry}
      />
    );
  }

  return (
    <div className="tasks-page page">
      <h2 className="page-title">Список задач</h2>

      <TaskFilters filters={filters} onFilterChange={setFilters} />

      {loading ? <Loader text="Загрузка задач..." /> : <TasksList />}
    </div>
  );
};

export default TasksPage;
