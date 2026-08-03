import { useState } from "react";
import { useAppDispatch, useAppSelector } from "@store/reduxHooks";
import { addTask, editTask } from "@store/features/tasks/tasksSlice";
import { closeForm } from "@store/features/ui/uiSlice";
import {
  selectIsFormOpen,
  selectEditingTaskId,
} from "@store/features/ui/uiSelectors";
import { selectAllTasks } from "@store/features/tasks/tasksSelectors";
import useTaskForm from "@hooks/useTaskForm";

import Modal from "@components/common/Modal";
import CustomSelect from "@components/common/CustomSelect";

import {
  PRIORITIES,
  STATUSES,
  PRIORITY_LABELS,
  STATUS_LABELS,
} from "@shared/constants";

import "./TaskFormModal.scss";

const priorityOptions = PRIORITIES.map((priority) => ({
  value: priority,
  label: PRIORITY_LABELS[priority],
}));

const statusOptions = STATUSES.map((status) => ({
  value: status,
  label: STATUS_LABELS[status],
}));

const TaskFormModal = () => {
  const dispatch = useAppDispatch();
  const isOpen = useAppSelector(selectIsFormOpen);
  const editingTaskId = useAppSelector(selectEditingTaskId);
  const allTasks = useAppSelector(selectAllTasks);
  const editingTask = allTasks.find((task) => task._id === editingTaskId);

  const { formData, isEdit, handleChange, getPayload, isValid } =
    useTaskForm(editingTask);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleClose = () => dispatch(closeForm());

  const handleSubmit = async (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!isValid()) {
      alert("Название задачи обязательно");
      return;
    }

    setIsSubmitting(true);
    const payload = getPayload();

    try {
      if (isEdit && editingTask) {
        await dispatch(
          editTask({ id: editingTask._id, updates: payload }),
        ).unwrap();
      } else {
        await dispatch(addTask(payload)).unwrap();
      }
      handleClose();
    } catch (error) {
      alert(
        error instanceof Error ? error.message : "Ошибка при сохранении задачи",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const modalTitle = isEdit ? "Редактировать задачу" : "Создать задачу";

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={modalTitle}>
      <form className="task-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Название</label>
          <input
            id="title"
            type="text"
            value={formData.title}
            onChange={(e) => handleChange("title")(e.target.value)}
            placeholder="Введите название задачи"
            required
            disabled={isSubmitting}
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Описание</label>
          <textarea
            id="description"
            value={formData.description}
            onChange={(e) => handleChange("description")(e.target.value)}
            placeholder="Дополнительная информация"
            rows={3}
            disabled={isSubmitting}
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Приоритет</label>
            <CustomSelect
              value={formData.priority}
              onChange={handleChange("priority")}
              options={priorityOptions}
              disabled={isSubmitting}
            />
          </div>

          <div className="form-group">
            <label>Статус</label>
            <CustomSelect
              value={formData.status}
              onChange={handleChange("status")}
              options={statusOptions}
              disabled={isSubmitting}
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="deadline">Дедлайн</label>
          <input
            id="deadline"
            type="date"
            value={formData.deadline}
            onChange={(e) => handleChange("deadline")(e.target.value)}
            disabled={isSubmitting}
          />
        </div>

        <div className="form-actions">
          <button type="button" onClick={handleClose} disabled={isSubmitting}>
            Отмена
          </button>
          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Сохранение..." : isEdit ? "Сохранить" : "Создать"}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default TaskFormModal;
