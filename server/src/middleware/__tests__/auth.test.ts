import { Response, NextFunction } from "express";

import { auth } from "@config/firebaseConfig";
import { authenticate, AuthRequest } from "@middleware/auth";
import { mockDecodedToken, mockToken } from "@tests/helpers";

describe("Authenticate middleware", () => {
  let req: Partial<AuthRequest>;
  let res: Partial<Response>;
  let next: jest.Mock<NextFunction>;

  beforeEach(() => {
    req = {
      headers: {},
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    next = jest.fn();
    jest.clearAllMocks();
  });

  test("should return 401 if Authorization header is missing", async () => {
    await authenticate(req as AuthRequest, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      message: "Необходима авторизация",
    });
    expect(next).not.toHaveBeenCalled();
  });

  test("should return 401 if Authorization header is not Bearer", async () => {
    req.headers = { authorization: "Basic token" };

    await authenticate(req as AuthRequest, res as Response, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      message: "Необходима авторизация",
    });
    expect(next).not.toHaveBeenCalled();
  });

  test("should return 401 if token is invalid", async () => {
    req.headers = { authorization: "Bearer invalid-token" };

    (auth.verifyIdToken as jest.Mock).mockRejectedValueOnce(
      new Error("Invalid token"),
    );
    await authenticate(req as AuthRequest, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      message: "Неверный или истёкший токен",
    });
    expect(next).not.toHaveBeenCalled();
  });

  test("should call next and set req.user if token is valid", async () => {
    req.headers = { authorization: `Bearer ${mockToken}` };

    (auth.verifyIdToken as jest.Mock).mockResolvedValueOnce(mockDecodedToken);
    await authenticate(req as AuthRequest, res as Response, next);

    expect(next).toHaveBeenCalled();
    expect(req.user).toEqual({
      uid: mockDecodedToken.uid,
      email: mockDecodedToken.email,
    });
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });
});
