import { useState } from "react";

import { useAppDispatch, useAppSelector } from "@store/reduxHooks";
import { removeAllTasks } from "@store/features/tasks/tasksSlice";
import { selectAllTasks } from "@store/features/tasks/tasksSelectors";
import { exportTasksToJson } from "@utils/taskExport";

import "./DataManagement.scss";

const DataManagement = () => {
  const dispatch = useAppDispatch();
  const tasks = useAppSelector(selectAllTasks);
  const [isLoading, setIsLoading] = useState(false);

  const handleExport = () => {
    exportTasksToJson(tasks);
  };

  const handleClearAll = async () => {
    if (
      !window.confirm(
        "Вы уверены, что хотите удалить все задачи? Это действие необратимо.",
      )
    )
      return;

    setIsLoading(true);

    try {
      await dispatch(removeAllTasks()).unwrap();
      alert("Все задачи удалены");
    } catch {
      alert("Не удалось удалить задачи");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="data-management">
      <div className="settings-section">
        <h3>Управление данными</h3>

        <div className="setting-group actions">
          <button
            className="btn-outline"
            onClick={handleExport}
            disabled={isLoading}
          >
            Экспортировать задачи (JSON)
          </button>

          <button
            className="btn-danger"
            onClick={handleClearAll}
            disabled={isLoading}
          >
            Очистить все задачи
          </button>
        </div>
      </div>
    </div>
  );
};

export default DataManagement;
