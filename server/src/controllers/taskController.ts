import { Request, Response } from "express";

export const getAllTasks = async (req: Request, res: Response) => {
  res.json({ tasks: [] });
};

export const createTask = async (req: Request, res: Response) => {
  res.status(201).json({ message: "Task created" });
};

export const updateTask = async (req: Request, res: Response) => {
  res.json({ message: "Task updated" });
};

export const deleteTask = async (req: Request, res: Response) => {
  res.json({ message: "Task deleted" });
};
