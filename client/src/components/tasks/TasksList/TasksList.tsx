import type { Task } from "@shared/types";

import toast from "react-hot-toast";

import { useAppDispatch, useAppSelector } from "@store/reduxHooks";
import { selectGroupedTasks } from "@store/features/tasks/tasksSelectors";
import { openTaskForm } from "@store/features/ui/uiSlice";
import { removeTask, editTask } from "@store/features/tasks/tasksSlice";
import { useConfirm } from "@contexts/ConfirmContext";

import TaskGroup from "@components/tasks/TaskGroup";

import "./TasksList.scss";

const TasksList = () => {
  const dispatch = useAppDispatch();
  const { confirm } = useConfirm();
  const groupedData = useAppSelector(selectGroupedTasks);

  const handleEdit = (task: Task) => {
    dispatch(openTaskForm({ editingTaskId: task._id }));
  };

  const handleDelete = async (id: string, title: string) => {
    const confirmed = await confirm(`Удалить задачу "${title}"?`, {
      title: "Удаление задачи",
      confirmText: "Удалить",
      cancelText: "Отмена",
    });

    if (confirmed) {
      try {
      await dispatch(removeTask(id)).unwrap();
      toast.success("Задача удалена");
    } catch (error) {
      toast.error("Ошибка при удалении:", error);
    }
      
    }
  };

  const handleToggleStatus = async (id: string, newStatus: Task["status"]) => {
    try {
      await dispatch(editTask({ id, updates: { status: newStatus } })).unwrap();
    } catch (error) {
      toast.error("Ошибка обновления статуса:", error);
    }
  };

  const allTasks = groupedData.groups
    .flatMap((group) => group.tasks)
    .concat(groupedData.noDeadline);

  if (allTasks.length === 0) {
    return (
      <div className="tasks-list">
        <div className="task-list-empty">
          <p>Задач пока нет</p>
          <span>Создайте первую задачу, нажав кнопку «Создать задачу»</span>
        </div>
      </div>
    );
  }

  return (
    <div className="tasks-list">
      <div className="task-list-header" aria-hidden="true">
        <div className="task-list-header-toggle" />

        <div className="task-list-header-title">Название</div>

        <div className="task-list-header-status">Статус</div>

        <div className="task-list-header-priority">Приоритет</div>

        <div className="task-list-header-deadline">Дедлайн</div>

        <div className="task-list-header-created">Создана</div>

        <div className="task-list-header-actions">Действия</div>
      </div>

      <div className="tasks-content">
        {groupedData.groups.map((group) => (
          <TaskGroup
            key={group.dateKey}
            dateKey={group.dateKey}
            displayDate={`Дедлайн - ${group.displayDate}`}
            tasks={group.tasks}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onToggleStatus={handleToggleStatus}
          />
        ))}

        {groupedData.noDeadline.length > 0 && (
          <TaskGroup
            dateKey="no-deadline"
            displayDate="Без дедлайна"
            tasks={groupedData.noDeadline}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onToggleStatus={handleToggleStatus}
          />
        )}
      </div>
    </div>
  );
};

export default TasksList;
