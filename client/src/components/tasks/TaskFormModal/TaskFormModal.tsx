import toast from "react-hot-toast";

import { useState, useEffect } from "react";
import DatePicker, { registerLocale } from "react-datepicker";
import { ru } from "date-fns/locale/ru";

import { useAppDispatch, useAppSelector } from "@store/reduxHooks";
import { addTask, editTask } from "@store/features/tasks/tasksSlice";
import { selectAllTasks } from "@store/features/tasks/tasksSelectors";
import useTaskForm from "@hooks/useTaskForm";
import { formatISODate, parseISODate, formatDate } from "@utils/date";

import Modal from "@components/common/Modal";
import CustomSelect from "@components/common/CustomSelect";

import {
  PRIORITIES,
  STATUSES,
  PRIORITY_LABELS,
  STATUS_LABELS,
} from "@shared/constants";

import { FaTimes } from "react-icons/fa";

import "react-datepicker/dist/react-datepicker.css";

import "./TaskFormModal.scss";

registerLocale("ru", ru);

interface TaskFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingTaskId: string | null;
}

const priorityOptions = PRIORITIES.map((priority) => ({
  value: priority,
  label: PRIORITY_LABELS[priority],
}));

const statusOptions = STATUSES.map((status) => ({
  value: status,
  label: STATUS_LABELS[status],
}));

const MAX_TITLE_LENGTH = 100;
const MAX_DESCRIPTION_LENGTH = 500;
const MAX_DESCRIPTION_LINES = 10;

const TaskFormModal = ({
  isOpen,
  onClose,
  editingTaskId,
}: TaskFormModalProps) => {
  const dispatch = useAppDispatch();
  const allTasks = useAppSelector(selectAllTasks);
  const editingTask = allTasks.find((task) => task._id === editingTaskId);

  const { formData, isEdit, handleChange, getPayload, isValid, resetForm } =
    useTaskForm(editingTask);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen && !editingTaskId) {
      resetForm();
    }
  }, [isOpen, editingTaskId, resetForm]);

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = async (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!isValid()) {
      toast.error("Название задачи обязательно");
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
      toast.success(isEdit ? "Задача обновлена" : "Задача создана");
      resetForm();
      handleClose();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Ошибка при сохранении задачи",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const modalTitle = isEdit ? "Редактировать задачу" : "Создать задачу";

  const onClearDeadline = () => {
    handleChange("deadline")("");
  };

  const handleDateChange = (date: Date | null) => {
    if (!date) {
      handleChange("deadline")("");
      return;
    }
    const selectedDate = formatISODate(date);
    if (selectedDate === formData.deadline) {
      return;
    }
    handleChange("deadline")(selectedDate);
  };

  const handleTitleChange = (value: string) => {
    if (value.length <= MAX_TITLE_LENGTH) {
      handleChange("title")(value);
    } else {
      toast.error(`Максимальная длина названия: ${MAX_TITLE_LENGTH} символов`);
    }
  };

  const handleDescriptionChange = (value: string) => {
    if (value.length > MAX_DESCRIPTION_LENGTH) {
      toast.error(
        `Максимальная длина описания: ${MAX_DESCRIPTION_LENGTH} символов`,
      );
      return;
    }
    const lines = value.split("\n").length;
    if (lines > MAX_DESCRIPTION_LINES) {
      toast.error(
        `Описание не может содержать более ${MAX_DESCRIPTION_LINES} строк`,
      );
      return;
    }
    handleChange("description")(value);
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={modalTitle}>
      <form className="task-form" onSubmit={handleSubmit}>
        <div className="form-group title">
          <label className="group-label" htmlFor="title">
            Название
          </label>

          <input
            id="title"
            type="text"
            value={formData.title}
            onChange={(event) => handleTitleChange(event.target.value)}
            placeholder="Введите название задачи"
            required
            disabled={isSubmitting}
            maxLength={MAX_TITLE_LENGTH + 1}
          />
        </div>

        <div className="additional-task-options">
          <div className="form-group">
            <label className="group-label" htmlFor="priority">
              Приоритет
            </label>

            <CustomSelect
              id="priority"
              value={formData.priority}
              onChange={handleChange("priority")}
              options={priorityOptions}
              disabled={isSubmitting}
            />
          </div>

          <div className="form-group">
            <label className="group-label" htmlFor="status">
              Статус
            </label>

            <CustomSelect
              id="status"
              value={formData.status}
              onChange={handleChange("status")}
              options={statusOptions}
              disabled={isSubmitting}
            />
          </div>
        </div>

        <div className="form-group description">
          <label className="group-label" htmlFor="description">
            Описание
          </label>

          <textarea
            id="description"
            value={formData.description}
            onChange={(event) => handleDescriptionChange(event.target.value)}
            placeholder="Дополнительная информация"
            rows={3}
            disabled={isSubmitting}
            maxLength={MAX_DESCRIPTION_LENGTH + 1}
          />
        </div>

        <div className="form-group deadline">
          <div className="deadline-header">
            <label className="group-label" htmlFor="deadlineOutput">
              Дедлайн
            </label>

            <output
              className="deadline-output"
              htmlFor="deadline"
              id="deadlineOutput"
            >
              {formData.deadline
                ? formatDate(formData.deadline)
                : "Выберите дату"}
            </output>

            {formData.deadline && !isSubmitting && (
              <button
                type="button"
                className="deadline-clear"
                onClick={onClearDeadline}
                aria-label="Очистить дату"
                tabIndex={0}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    onClearDeadline();
                  }
                }}
              >
                <FaTimes />
              </button>
            )}
          </div>

          <div className="calendar-wrapper">
            <DatePicker
              id="deadline"
              selected={
                formData.deadline ? parseISODate(formData.deadline) : undefined
              }
              onChange={handleDateChange}
              minDate={new Date()}
              disabled={isSubmitting}
              inline={true}
              fixedHeight
              adjustDateOnChange={false}
              dateFormat="dd/MM/yyyy"
              locale="ru"
              className="custom-datepicker"
            />
          </div>
        </div>

        <div className="form-actions">
          <button
            type="button"
            onClick={handleClose}
            disabled={isSubmitting}
            tabIndex={0}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                handleClose();
              }
            }}
          >
            Отмена
          </button>

          <button
            type="submit"
            disabled={isSubmitting}
            tabIndex={0}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
              }
            }}
          >
            {isSubmitting ? "Сохранение..." : isEdit ? "Сохранить" : "Создать"}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default TaskFormModal;
