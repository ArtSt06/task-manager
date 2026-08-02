import { DecodedIdToken } from "firebase-admin/auth";

import request from "supertest";

import app from "@/index";

export const mockUid = "mock-user-123";
export const mockToken = "mock-token";

export const mockDecodedToken: DecodedIdToken = {
  uid: mockUid,
  email: "test@example.com",
  aud: "mock-aud",
  auth_time: Math.floor(Date.now() / 1000),
  exp: Math.floor(Date.now() / 1000) + 3600,
  firebase: {
    identities: { email: ["test@example.com"] },
    sign_in_provider: "password",
  },
  iat: Math.floor(Date.now() / 1000),
  iss: "mock-iss",
  sub: mockUid,
};

export const createTestTask = async (title: string, overrides = {}) => {
  const res = await request(app)
    .post("/api/tasks")
    .set("Authorization", `Bearer ${mockToken}`)
    .send({ title, ...overrides });
  return res.body.task;
};

export const expectUnauthorized = (res: request.Response) => {
  expect(res.status).toBe(401);
  expect(res.body.message).toBe("Необходима авторизация");
};
