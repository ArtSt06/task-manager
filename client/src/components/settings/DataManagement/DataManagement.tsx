import toast from "react-hot-toast";

import { useState } from "react";

import { useAppDispatch, useAppSelector } from "@store/reduxHooks";
import { removeAllTasks } from "@store/features/tasks/tasksSlice";
import { selectAllTasks } from "@store/features/tasks/tasksSelectors";
import { exportTasksToJson } from "@utils/taskExport";
import { useConfirm } from "@contexts/ConfirmContext";

import "./DataManagement.scss";

const DataManagement = () => {
  const dispatch = useAppDispatch();
  const tasks = useAppSelector(selectAllTasks);
  const [isLoading, setIsLoading] = useState(false);
  const { confirm } = useConfirm();

  const handleExport = () => {
    exportTasksToJson(tasks);
  };

  const handleClearAll = async () => {
    const confirmed = await confirm(
      "Вы уверены, что хотите удалить все задачи? Это действие необратимо.",
      {
        title: "Удаление всех задач",
        confirmText: "Удалить",
        cancelText: "Отмена",
      },
    );

    if (!confirmed) return;

    setIsLoading(true);

    try {
      await dispatch(removeAllTasks()).unwrap();
      toast.success("Все задачи удалены");
    } catch {
      toast.error("Не удалось удалить задачи");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="settings-container data-management">
      <section className="settings-section">
        <h3 className="section-title">Управление данными</h3>

        <div className="setting-group action">
          <label className="group-label" htmlFor="exportJSON">
            Экспорт задач в формате JSON
          </label>

          <button id="exportJSON" onClick={handleExport} disabled={isLoading}>
            Экспортировать задачи
          </button>
        </div>

        <div className="setting-group action">
          <label className="group-label" htmlFor="clearAll">
            Очистка текущего списка задач
          </label>

          <button
            id="clearAll"
            className="button-danger"
            onClick={handleClearAll}
            disabled={isLoading}
          >
            Удалить все задачи
          </button>
        </div>
      </section>
    </div>
  );
};

export default DataManagement;
