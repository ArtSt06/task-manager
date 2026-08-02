import { Response } from "express";

import { AuthRequest } from "@middleware/auth";
import { cache } from "@utils/cache";

import Task from "@models/TaskModel";

const handleError = (res: Response, error: unknown) => {
  console.error(error);
  const message =
    error instanceof Error ? error.message : "Внутренняя ошибка сервера";
  res.status(500).json({ message });
};

const invalidateStatisticsCache = (firebaseUid: string) => {
  cache.clear(`statistics-${firebaseUid}`);
};

export const getAllTasks = async (req: AuthRequest, res: Response) => {
  try {
    const firebaseUid = req.user!.uid;
    const { status, priority, search } = req.query;

    const filters: any = { firebaseUid: firebaseUid };

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

export const createTask = async (req: AuthRequest, res: Response) => {
  try {
    const firebaseUid = req.user!.uid;
    const { title, description, priority, status, deadline } = req.body;

    if (!title?.trim()) {
      res.status(400).json({ message: "Название задачи обязательно" });
      return;
    }

    const task = new Task({
      firebaseUid: firebaseUid,
      title: title.trim(),
      description: description?.trim(),
      priority: priority,
      status: status,
      deadline: deadline ? new Date(deadline) : undefined,
    });

    const savedTask = await task.save();
    invalidateStatisticsCache(firebaseUid);
    res
      .status(201)
      .json({ message: "Задача успешно создана", task: savedTask });
  } catch (error) {
    handleError(res, error);
  }
};

export const updateTask = async (req: AuthRequest, res: Response) => {
  try {
    const firebaseUid = req.user!.uid;
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

    const updatedTask = await Task.findOneAndUpdate(
      { _id: id, firebaseUid: firebaseUid},
      updates,
      { new: true, runValidators: true },
    );

    if (!updatedTask) {
      res.status(404).json({ message: "Задача не найдена" });
      return;
    }

    invalidateStatisticsCache(firebaseUid);
    res.json({ message: "Задача успешно обновлена", task: updatedTask });
  } catch (error) {
    handleError(res, error);
  }
};

export const deleteTask = async (req: AuthRequest, res: Response) => {
  try {
    const firebaseUid = req.user!.uid;
    const { id } = req.params;

    const deletedTask = await Task.findOneAndDelete({
      _id: id,
      firebaseUid: firebaseUid,
    });

    if (!deletedTask) {
      res.status(404).json({ message: "Задача не найдена" });
      return;
    }

    invalidateStatisticsCache(firebaseUid);
    res.json({ message: "Задача успешно удалена" });
  } catch (error) {
    handleError(res, error);
  }
};

export const deleteAllTasks = async (req: AuthRequest, res: Response) => {
  try {
    const firebaseUid = req.user!.uid;
    
    const result = await Task.deleteMany({ firebaseUid });
    invalidateStatisticsCache(firebaseUid);
    res.json({ message: `Удалено ${result.deletedCount} задач` });
  } catch (error) {
    handleError(res, error);
  }
};
