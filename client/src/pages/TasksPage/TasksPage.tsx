import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@store/reduxHooks";
import { fetchTasks } from "@store/features/tasks/tasksSlice";
import {
  selectAllTasks,
  selectTasksLoading,
  selectTasksError,
} from "@store/features/tasks/tasksSelectors";
import TaskFilters from "@components/tasks/TaskFilters";
import TasksList from "@components/tasks/TasksList";
import Loader from "@components/common/Loader";
import "./TasksPage.scss";

const TasksPage = () => {
  const dispatch = useAppDispatch();
  const tasks = useAppSelector(selectAllTasks);
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

  if (error) {
    return (
      <div className="tasks-page">
        <h2>Список задач</h2>
        <TaskFilters filters={filters} onFilterChange={setFilters} />
        <div className="error">Ошибка: {error}</div>
      </div>
    );
  }

  return (
    <div className="tasks-page">
      <h2>Список задач</h2>
      <TaskFilters filters={filters} onFilterChange={setFilters} />
      <div className="tasks-content">
        {loading ? (
          <Loader text="Загрузка задач..." />
        ) : (
          <TasksList tasks={tasks} />
        )}
      </div>
    </div>
  );
};

export default TasksPage;
