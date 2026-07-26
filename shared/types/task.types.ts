export type Priority = "low" | "medium" | "high";
export type Status = "todo" | "inProgress" | "done";

export interface Task {
  _id: string;
  title: string;
  description?: string;
  priority: Priority;
  status: Status;
  deadline?: string;
  completed?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TaskListResponse {
  tasks: Task[];
}

export interface TaskMutationResponse {
  message: string;
  task?: Task;
}
