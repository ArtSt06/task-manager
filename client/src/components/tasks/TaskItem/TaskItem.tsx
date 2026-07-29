import type { Task } from "@shared/types";

import { useAction } from "@hooks/useAction";
import { deleteTask } from "@api/tasks";
import { formatDate } from "@utils/date";

import { PRIORITY_LABELS, STATUS_LABELS } from "@shared/constants";

import "./TaskItem.scss";

interface TaskItemProps {
  task: Task;
  onEdit: (task: Task) => void;
  onUpdate: () => void;
}

const TaskItem = ({ task, onEdit, onUpdate }: TaskItemProps) => {
  const { execute: deleteAction, loading: deleteLoading } =
    useAction(deleteTask);

  const handleDelete = async () => {
    if (!window.confirm(`Удалить задачу "${task.title}"?`)) return;

    const result = await deleteAction(task._id);

    if (result.success) {
      onUpdate();
    } else {
      alert(result.error);
    }
  };

  return (
    <div className={`task-item priority-${task.priority}`}>
      <div className="task-header">
        <h3>{task.title}</h3>

        <div className="task-badges">
          <span className={`priority priority-${task.priority}`}>
            {PRIORITY_LABELS[task.priority]}
          </span>

          <span className={`status status-${task.status}`}>
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
        <button onClick={() => onEdit(task)} disabled={deleteLoading}>
          Редактировать
        </button>

        <button onClick={handleDelete} disabled={deleteLoading}>
          {deleteLoading ? "Удаление..." : "Удалить"}
        </button>
      </div>
    </div>
  );
};

export default TaskItem;
