import { useEffect } from "react";

import { useAppDispatch, useAppSelector } from "@store/reduxHooks";
import { fetchTasks } from "@store/features/tasks/tasksSlice";
import {
  selectAllTasks,
  selectTasksLoading,
  selectTasksError,
  selectTasksFilters,
} from "@store/features/tasks/tasksSelectors";

import TasksList from "@components/tasks/TasksList";
import Loader from "@components/common/Loader";

import "./TasksPage.scss";

const TasksPage = () => {
  const dispatch = useAppDispatch();
  const tasks = useAppSelector(selectAllTasks);
  const loading = useAppSelector(selectTasksLoading);
  const error = useAppSelector(selectTasksError);
  const filters = useAppSelector(selectTasksFilters);

  useEffect(() => {
    dispatch(fetchTasks(filters));
  }, [dispatch, filters]);

  if (loading) return <Loader fullPage text="Загрузка задач..." />;

  if (error) return <div className="error">Ошибка: {error}</div>;

  return (
    <div className="tasks-page">
      <h2>Список задач</h2>

      <TasksList tasks={tasks} />
    </div>
  );
};

export default TasksPage;
