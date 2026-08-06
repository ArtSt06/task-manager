import type { Priority, Status, Task } from "@shared/types";

import { useState, useEffect, useCallback } from "react";

import { useAppSelector } from "@store/reduxHooks";
import {
  selectDefaultPriority,
  selectDefaultStatus,
} from "@store/features/settings/settingsSelectors";

type FormField = "title" | "description" | "priority" | "status" | "deadline";
type FormFieldValue = string | Priority | Status;

interface FormState {
  title: string;
  description: string;
  priority: Priority;
  status: Status;
  deadline: string;
}

const createEmptyForm = (priority: Priority, status: Status): FormState => ({
  title: "",
  description: "",
  priority,
  status,
  deadline: "",
});

export const useTaskForm = (editingTask?: Task | null) => {
  const defaultPriority = useAppSelector(selectDefaultPriority);
  const defaultStatus = useAppSelector(selectDefaultStatus);

  const [formData, setFormData] = useState<FormState>(
    createEmptyForm(defaultPriority, defaultStatus),
  );
  const isEdit = !!editingTask;

  useEffect(() => {
    if (editingTask) {
      setFormData({
        title: editingTask.title,
        description: editingTask.description || "",
        priority: editingTask.priority,
        status: editingTask.status,
        deadline: editingTask.deadline ? editingTask.deadline.slice(0, 10) : "",
      });
    } else {
      setFormData(createEmptyForm(defaultPriority, defaultStatus));
    }
  }, [editingTask, defaultPriority, defaultStatus]);

  const handleChange = useCallback(
    (field: FormField) => (value: FormFieldValue) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
    },
    [],
  );

  const resetForm = useCallback(() => {
    setFormData(createEmptyForm(defaultPriority, defaultStatus));
  }, [defaultPriority, defaultStatus]);

  const getPayload = useCallback(() => {
    return {
      title: formData.title.trim(),
      description: formData.description.trim() || undefined,
      priority: formData.priority,
      status: formData.status,
      deadline: formData.deadline
        ? new Date(formData.deadline).toISOString()
        : null,
    };
  }, [formData]);

  const isValid = useCallback(() => {
    return formData.title.trim().length > 0;
  }, [formData.title]);

  return {
    formData,
    isEdit,
    handleChange,
    resetForm,
    getPayload,
    isValid,
  };
};

export default useTaskForm;
