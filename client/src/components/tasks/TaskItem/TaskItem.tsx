import type { Task } from "@shared/types";

import { formatDate } from "@utils/date";
import { PRIORITY_LABELS, STATUS_LABELS } from "@shared/constants";

import { useAppDispatch, useAppSelector } from "@store/reduxHooks";
import { openForm } from "@store/features/ui/uiSlice";
import { removeTask } from "@store/features/tasks/tasksSlice";
import { selectConfirmDelete } from "@store/features/settings/settingsSelectors";

import "./TaskItem.scss";

interface TaskItemProps {
  task: Task;
}

const TaskItem = ({ task }: TaskItemProps) => {
  const dispatch = useAppDispatch();
  const confirmDelete = useAppSelector(selectConfirmDelete);

  const handleEdit = () => {
    dispatch(openForm(task._id));
  };

  const handleDelete = () => {
    if (confirmDelete) {
      if (!window.confirm(`Удалить задачу "${task.title}"?`)) return;
    }
    dispatch(removeTask(task._id));
  };

  return (
    <div className={`task-item priority-${task.priority}`}>
      <div className="task-header">
        <h3>{task.title}</h3>

        <div className="task-badges">
          <span className={`task-badge priority-${task.priority}`}>
            {PRIORITY_LABELS[task.priority]}
          </span>

          <span className={`task-badge status-${task.status}`}>
            {STATUS_LABELS[task.status]}
          </span>
        </div>
      </div>

      {task.description && (
        <p className="task-description">{task.description}</p>
      )}

      <div className="task-meta">
        {task.deadline && <span>{formatDate(task.deadline)}</span>}

        <span>{formatDate(task.createdAt)}</span>
      </div>

      <div className="task-actions">
        <button onClick={handleEdit}>Редактировать</button>

        <button onClick={handleDelete}>Удалить</button>
      </div>
    </div>
  );
};

export default TaskItem;
