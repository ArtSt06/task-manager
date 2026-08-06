import type { Task } from "@shared/types";

import { useState } from "react";

import { formatDate } from "@utils/date";

import { PRIORITY_LABELS, STATUS_LABELS } from "@shared/constants";

import {
  FaCheck,
  FaTrash,
  FaEllipsisV,
  FaCalendarAlt,
  FaClock,
} from "react-icons/fa";

import "./TaskItem.scss";

interface TaskItemProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete?: (id: string, title: string) => void;
  onToggleStatus?: (id: string, newStatus: Task["status"]) => void;
}

const TaskItem = ({
  task,
  onEdit,
  onDelete,
  onToggleStatus,
}: TaskItemProps) => {
  const [expanded, setExpanded] = useState(false);

  const handleDeleteClick = async () => {
    onDelete?.(task._id, task.title);
  };

  const handleToggleStatus = () => {
    const newStatus = task.status === "done" ? "todo" : "done";
    onToggleStatus?.(task._id, newStatus);
  };

  const toggleExpand = () => {
    setExpanded((prev) => !prev);
  };

  const statusClass = `status-${task.status}`;

  return (
    <div className={`task-item ${statusClass}`}>
      <div className="task-status-line" />

      <div className="task-row">
        <button
          type="button"
          className="toggle-status-button"
          onClick={handleToggleStatus}
          aria-label={
            task.status === "done" ? "Отменить выполнение" : "Выполнить"
          }
          title={task.status === "done" ? "Отменить выполнение" : "Выполнить"}
        >
          {task.status === "done" ? (
            <FaCheck className="icon-done" />
          ) : (
            <FaCheck className="icon-todo" />
          )}
        </button>

        <div
          className="task-title"
          onClick={toggleExpand}
          role="button"
          tabIndex={0}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              toggleExpand();
            }
          }}
          title={task.title}
        >
          {task.title}
        </div>

        <span className={`task-badge status ${statusClass}`}>
          {STATUS_LABELS[task.status]}
        </span>

        <span className={`task-badge priority priority-${task.priority}`}>
          {PRIORITY_LABELS[task.priority]}
        </span>

        <span
          className={`task-deadline ${!task.deadline ? "unset" : ""}`}
          title={task.deadline ? formatDate(task.deadline) : "Не установлен"}
        >
          {task.deadline ? (
            <>
              <FaCalendarAlt className="icon-deadline" />
              <span>{formatDate(task.deadline)}</span>
            </>
          ) : (
            "Не установлен"
          )}
        </span>

        <span className="task-created" title={formatDate(task.createdAt)}>
          <FaClock className="icon-created" />
          <span>{formatDate(task.createdAt)}</span>
        </span>

        <div className="task-actions">
          <button
            type="button"
            className="delete-button"
            onClick={handleDeleteClick}
            aria-label="Удалить"
            title="Удалить"
          >
            <FaTrash />
          </button>

          <button
            type="button"
            className="edit-button"
            onClick={() => onEdit(task)}
            aria-label="Редактировать"
            title="Редактировать"
          >
            <FaEllipsisV />
          </button>
        </div>
      </div>

      <div className={`task-description ${expanded ? "expanded" : ""}`}>
        {task.description || "Нет описания"}
      </div>
    </div>
  );
};

export default TaskItem;
