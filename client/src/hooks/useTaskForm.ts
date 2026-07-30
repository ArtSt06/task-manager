import type { Priority, Status } from "@shared/types";
import type { Task } from "@shared/types";

import { useEffect, useReducer } from "react";

type FormField = "title" | "description" | "priority" | "status" | "deadline";
type FormFieldValue = string | Priority | Status;

interface FormState {
  title: string;
  description: string;
  priority: Priority;
  status: Status;
  deadline: string;
}

const ACTION = {
  SET_FIELD: "SET_FIELD",
  RESET: "RESET",
  SET_ALL: "SET_ALL",
} as const;

type FormAction =
  | { type: typeof ACTION.SET_FIELD; field: FormField; value: FormFieldValue }
  | { type: typeof ACTION.RESET }
  | { type: typeof ACTION.SET_ALL; payload: FormState };

const initialFormState: FormState = {
  title: "",
  description: "",
  priority: "medium",
  status: "todo",
  deadline: "",
};

const formReducer = (state: FormState, action: FormAction): FormState => {
  switch (action.type) {
    case ACTION.SET_FIELD:
      return { ...state, [action.field]: action.value };
    case ACTION.RESET:
      return { ...initialFormState };
    case ACTION.SET_ALL:
      return { ...action.payload };
    default:
      return state;
  }
};

export const useTaskForm = (editingTask?: Task | null) => {
  const [formData, dispatch] = useReducer(formReducer, initialFormState);
  const isEdit = !!editingTask;

  useEffect(() => {
    if (editingTask) {
      dispatch({
        type: ACTION.SET_ALL,
        payload: {
          title: editingTask.title,
          description: editingTask.description || "",
          priority: editingTask.priority,
          status: editingTask.status,
          deadline: editingTask.deadline
            ? editingTask.deadline.slice(0, 10)
            : "",
        },
      });
    } else {
      dispatch({ type: ACTION.RESET });
    }
  }, [editingTask]);

  const handleChange = (field: FormField) => (value: FormFieldValue) => {
    dispatch({ type: ACTION.SET_FIELD, field, value });
  };

  const resetForm = () => {
    dispatch({ type: ACTION.RESET });
  };

  const getPayload = () => ({
    title: formData.title.trim(),
    description: formData.description.trim() || undefined,
    priority: formData.priority,
    status: formData.status,
    deadline: formData.deadline
      ? new Date(formData.deadline).toISOString()
      : undefined,
  });

  const isValid = () => formData.title.trim().length > 0;

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
