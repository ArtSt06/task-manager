import { Router } from "express";
import {
  getAllTasks,
  createTask,
  updateTask,
  deleteTask,
} from "@controllers/taskController";

const taskRoutes = Router();

taskRoutes.get("/tasks", getAllTasks);
taskRoutes.post("/tasks", createTask);
taskRoutes.patch("/tasks/:id", updateTask);
taskRoutes.delete("/tasks/:id", deleteTask);

export default taskRoutes;
