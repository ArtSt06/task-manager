import type { Task, Priority, Status } from "@shared/types";

import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";

import { useAction } from "@hooks/useAction";
import { createTask, updateTask } from "@api/tasks";

import CustomSelect from "@components/common/CustomSelect";

import {
  PRIORITIES,
  STATUSES,
  PRIORITY_LABELS,
  STATUS_LABELS,
} from "@shared/constants";

import "./TaskFormModal.scss";

interface TaskFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialData?: Task | null;
}

const priorityOptions = PRIORITIES.map((priority) => ({
  value: priority,
  label: PRIORITY_LABELS[priority],
}));

const statusOptions = STATUSES.map((status) => ({
  value: status,
  label: STATUS_LABELS[status],
}));

const TaskFormModal = ({
  isOpen,
  onClose,
  onSuccess,
  initialData,
}: TaskFormModalProps) => {
  const isEdit = !!initialData;
  const modalRef = useRef<HTMLDivElement>(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<Priority>("medium");
  const [status, setStatus] = useState<Status>("todo");
  const [deadline, setDeadline] = useState("");

  const { execute: createAction, loading: createLoading } =
    useAction(createTask);

  const { execute: updateAction, loading: updateLoading } =
    useAction(updateTask);

  const loading = createLoading || updateLoading;

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setDescription(initialData.description || "");
      setPriority(initialData.priority);
      setStatus(initialData.status);
      setDeadline(
        initialData.deadline ? initialData.deadline.slice(0, 10) : "",
      );
    } else {
      setTitle("");
      setDescription("");
      setPriority("medium");
      setStatus("todo");
      setDeadline("");
    }
  }, [initialData, isOpen]);

  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    if (isOpen) {
      document.addEventListener("keydown", handleEsc);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  const handleOverlayClick = (event: React.MouseEvent) => {
    if (event.target === event.currentTarget) onClose();
  };

  const handleSubmit = async (event: React.SubmitEvent) => {
    event.preventDefault();
    if (!title.trim()) {
      alert("Название задачи обязательно");
      return;
    }

    const payload = {
      title: title.trim(),
      description: description.trim() || undefined,
      priority,
      status,
      deadline: deadline ? new Date(deadline).toISOString() : undefined,
    };

    const result =
      isEdit && initialData
        ? await updateAction(initialData._id, payload)
        : await createAction(payload);

    if (result.success) {
      onSuccess();
      onClose();
    } else {
      alert(result.error);
    }
  };

  if (!isOpen) return null;

  return createPortal(
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal" ref={modalRef}>
        <header className="modal-header">
          <h2>{isEdit ? "Редактировать задачу" : "Создать задачу"}</h2>

          <button className="modal-close" onClick={onClose}>
            ✕
          </button>
        </header>

        <form className="task-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">Название</label>

            <input
              id="title"
              type="text"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Введите название задачи"
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Описание</label>

            <textarea
              id="description"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Дополнительная информация"
              rows={3}
              disabled={loading}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Приоритет</label>

              <CustomSelect
                value={priority}
                onChange={(value) => setPriority(value as Priority)}
                options={priorityOptions}
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label>Статус</label>

              <CustomSelect
                value={status}
                onChange={(value) => setStatus(value as Status)}
                options={statusOptions}
                disabled={loading}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="deadline">Дедлайн</label>

            <input
              id="deadline"
              type="date"
              value={deadline}
              onChange={(event) => setDeadline(event.target.value)}
              disabled={loading}
            />
          </div>

          <div className="form-actions">
            <button type="button" onClick={onClose} disabled={loading}>
              Отмена
            </button>

            <button type="submit" disabled={loading}>
              {loading ? "Сохранение..." : isEdit ? "Сохранить" : "Создать"}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.getElementById("modalRoot") as HTMLElement,
  );
};

export default TaskFormModal;
