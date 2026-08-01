import { Response, NextFunction } from "express";

import { AuthRequest } from "@middleware/auth";

export const requireAuth = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  if (!req.user?.uid) {
    return res
      .status(401)
      .json({ message: "Отсутствует уникальный идентификатор пользователя" });
  }
  next();
};
