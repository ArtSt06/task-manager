import { apiClient } from "./client";
import type {
  Task,
  TaskListResponse,
  TaskMutationResponse,
} from "@shared/types";

const TASKS_ENDPOINT = "/tasks";

export const getTasks = async (params?: {
  status?: string;
  priority?: string;
  search?: string;
}): Promise<Task[]> => {
  const response = await apiClient.get<TaskListResponse>(
    TASKS_ENDPOINT,
    params,
  );
  return response.tasks || [];
};

export const createTask = async (
  taskData: Partial<Task>,
): Promise<TaskMutationResponse> => {
  return apiClient.post<TaskMutationResponse>(TASKS_ENDPOINT, taskData);
};

export const updateTask = async (
  id: string,
  updates: Partial<Task>,
): Promise<TaskMutationResponse> => {
  return apiClient.patch<TaskMutationResponse>(
    `${TASKS_ENDPOINT}/${id}`,
    updates,
  );
};

export const deleteTask = async (id: string): Promise<TaskMutationResponse> => {
  return apiClient.delete<TaskMutationResponse>(`${TASKS_ENDPOINT}/${id}`);
};
