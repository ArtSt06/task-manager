import { Router } from "express";

import {
  getAllTasks,
  createTask,
  updateTask,
  deleteTask,
} from "@controllers/taskController";
import { authenticate } from "@middleware/auth";
import { requireAuth } from "@middleware/requireAuth";

const taskRoutes = Router();

taskRoutes.get("/tasks", authenticate, requireAuth, getAllTasks);
taskRoutes.post("/tasks", authenticate, requireAuth, createTask);
taskRoutes.patch("/tasks/:id", authenticate, requireAuth, updateTask);
taskRoutes.delete("/tasks/:id", authenticate, requireAuth, deleteTask);

export default taskRoutes;
