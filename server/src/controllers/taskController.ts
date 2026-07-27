import { Request, Response } from "express";
import Task from "@models/TaskModel";

const handleError = (res: Response, error: unknown) => {
  console.error(error);
  const message =
    error instanceof Error ? error.message : "Внутренняя ошибка сервера";
  res.status(500).json({ message });
};

export const getAllTasks = async (req: Request, res: Response) => {
  try {
    const { status, priority, search } = req.query;

    const filters: any = {};

    if (status) {
      filters.status = status;
    }
    if (priority) {
      filters.priority = priority;
    }
    if (search) {
      filters.title = { $regex: search, $options: "i" };
    }

    const tasks = await Task.find(filters).sort({ createdAt: -1 });
    res.json({ tasks });
  } catch (error) {
    handleError(res, error);
  }
};

export const createTask = async (req: Request, res: Response) => {
  try {
    const { title, description, priority, status, deadline } = req.body;

    if (!title?.trim()) {
      res.status(400).json({ message: "Название задачи обязательно" });
      return;
    }

    const task = new Task({
      title: title.trim(),
      description: description?.trim(),
      priority: priority,
      status: status,
      deadline: deadline ? new Date(deadline) : undefined,
    });

    const savedTask = await task.save();
    res
      .status(201)
      .json({ message: "Задача успешно создана", task: savedTask });
  } catch (error) {
    handleError(res, error);
  }
};

export const updateTask = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, description, priority, status, deadline } = req.body;

    const updates: any = {};

    if (title !== undefined) {
      updates.title = title.trim();
    }
    if (description !== undefined) {
      updates.description = description?.trim() || undefined;
    }
    if (priority) {
      updates.priority = priority;
    }
    if (status) {
      updates.status = status;
    }
    if (deadline !== undefined) {
      updates.deadline = deadline ? new Date(deadline) : null;
    }

    const updatedTask = await Task.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    if (!updatedTask) {
      res.status(404).json({ message: "Задача не найдена" });
      return;
    }

    res.json({ message: "Задача успешно обновлена", task: updatedTask });
  } catch (error) {
    handleError(res, error);
  }
};

export const deleteTask = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const deletedTask = await Task.findByIdAndDelete(id);

    if (!deletedTask) {
      res.status(404).json({ message: "Задача не найдена" });
      return;
    }

    res.json({ message: "Задача успешно удалена" });
  } catch (error) {
    handleError(res, error);
  }
};
