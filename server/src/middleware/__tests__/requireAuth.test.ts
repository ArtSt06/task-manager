import { Response, NextFunction } from "express";
import { requireAuth } from "@middleware/requireAuth";
import { AuthRequest } from "@middleware/auth";

describe("requireAuth middleware", () => {
  let req: Partial<AuthRequest>;
  let res: Partial<Response>;
  let next: jest.Mock<NextFunction>;

  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    next = jest.fn();
  });

  test("should return 401 if req.user is undefined", () => {
    requireAuth(req as AuthRequest, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      message: "Отсутствует уникальный идентификатор пользователя",
    });
    expect(next).not.toHaveBeenCalled();
  });

  test("should return 401 if req.user.uid is missing", () => {
    req.user = {} as any;

    requireAuth(req as AuthRequest, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      message: "Отсутствует уникальный идентификатор пользователя",
    });
    expect(next).not.toHaveBeenCalled();
  });

  test("should call next if req.user.uid exists", () => {
    req.user = { uid: "mock-user-123", email: "test@example.com" };

    requireAuth(req as AuthRequest, res as Response, next);
    
    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });
});
