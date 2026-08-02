import type { Settings } from "@shared/types";

import request from "supertest";

import { mockToken, mockUid, expectUnauthorized } from "@tests/helpers";

import { DEFAULT_SETTINGS } from "@shared/constants";

import User from "@models/UserModel";
import app from "@/index";

describe("User Settings API", () => {
  describe("GET /user/settings", () => {
    test("should return 401 without token", async () => {
      const res = await request(app).get("/api/user/settings");

      expectUnauthorized(res);
    });

    test("should return default settings for new user", async () => {
      await User.deleteOne({ firebaseUid: mockUid });

      const res = await request(app)
        .get("/api/user/settings")
        .set("Authorization", `Bearer ${mockToken}`);

      expect(res.status).toBe(200);
      expect(res.body.settings).toEqual({
        theme: DEFAULT_SETTINGS.theme,
        defaultPriority: DEFAULT_SETTINGS.defaultPriority,
        defaultStatus: DEFAULT_SETTINGS.defaultStatus,
        confirmDelete: DEFAULT_SETTINGS.confirmDelete,
      });

      const user = await User.findOne({ firebaseUid: mockUid });
      expect(user).toBeDefined();
      expect(user!.settings).toEqual(res.body.settings);
    });

    test("should return existing settings for user", async () => {
      const customSettings: Settings = {
        theme: "dark",
        defaultPriority: "high",
        defaultStatus: "inProgress",
        confirmDelete: false,
      };

      await User.create({
        firebaseUid: mockUid,
        email: "test@example.com",
        settings: customSettings,
      });

      const res = await request(app)
        .get("/api/user/settings")
        .set("Authorization", `Bearer ${mockToken}`);

      expect(res.status).toBe(200);
      expect(res.body.settings).toEqual(customSettings);
    });
  });

  describe("PATCH /user/settings", () => {
    test("should return 401 without token", async () => {
      const res = await request(app)
        .patch("/api/user/settings")
        .send({ theme: "dark" });

      expectUnauthorized(res);
    });

    test("should update single field", async () => {
      await User.deleteOne({ firebaseUid: mockUid });

      await request(app)
        .get("/api/user/settings")
        .set("Authorization", `Bearer ${mockToken}`);

      const res = await request(app)
        .patch("/api/user/settings")
        .set("Authorization", `Bearer ${mockToken}`)
        .send({ theme: "dark" });

      expect(res.status).toBe(200);
      expect(res.body.settings.theme).toBe("dark");

      expect(res.body.settings.defaultPriority).toBe(
        DEFAULT_SETTINGS.defaultPriority,
      );
      expect(res.body.settings.defaultStatus).toBe(
        DEFAULT_SETTINGS.defaultStatus,
      );
      expect(res.body.settings.confirmDelete).toBe(
        DEFAULT_SETTINGS.confirmDelete,
      );
    });

    test("should update multiple fields", async () => {
      await User.deleteOne({ firebaseUid: mockUid });

      await request(app)
        .get("/api/user/settings")
        .set("Authorization", `Bearer ${mockToken}`);

      const res = await request(app)
        .patch("/api/user/settings")
        .set("Authorization", `Bearer ${mockToken}`)
        .send({
          theme: "light",
          defaultPriority: "low",
          defaultStatus: "todo",
          confirmDelete: false,
        });

      expect(res.status).toBe(200);
      expect(res.body.settings).toEqual({
        theme: "light",
        defaultPriority: "low",
        defaultStatus: "todo",
        confirmDelete: false,
      });
    });
  });

  describe("POST /user/settings/reset", () => {
    test("should return 401 without token", async () => {
      const res = await request(app).post("/api/user/settings/reset");

      expectUnauthorized(res);
    });

    test("should reset settings to default", async () => {
      await User.deleteOne({ firebaseUid: mockUid });
      await request(app)
        .get("/api/user/settings")
        .set("Authorization", `Bearer ${mockToken}`);

      await request(app)
        .patch("/api/user/settings")
        .set("Authorization", `Bearer ${mockToken}`)
        .send({ theme: "dark", defaultPriority: "high", confirmDelete: false });

      const res = await request(app)
        .post("/api/user/settings/reset")
        .set("Authorization", `Bearer ${mockToken}`);

      expect(res.status).toBe(200);
      expect(res.body.settings).toEqual(DEFAULT_SETTINGS);

      const user = await User.findOne({ firebaseUid: mockUid });
      expect(user!.settings).toEqual(res.body.settings);
    });
  });
});
