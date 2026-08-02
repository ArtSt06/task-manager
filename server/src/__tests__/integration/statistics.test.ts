import request from "supertest";

import { mockToken, createTestTask, expectUnauthorized } from "@tests/helpers";

import app from "@/index";

describe("Statistics API", () => {
  describe("GET /statistics", () => {
    test("should return 401 without token", async () => {
      const res = await request(app).get("/api/statistics?period=week");

      expectUnauthorized(res);
    });

    test("should return correct structure with empty data", async () => {
      const res = await request(app)
        .get("/api/statistics?period=week")
        .set("Authorization", `Bearer ${mockToken}`);

      expect(res.status).toBe(200);
      expect(res.body).toMatchObject({
        statusDistribution: { todo: 0, inProgress: 0, done: 0 },
        priorityDistribution: { low: 0, medium: 0, high: 0 },
        timeline: expect.any(Array),
      });
      expect(res.body.timeline).toHaveLength(7);
    });

    test("should return correct statistics for tasks", async () => {
      await createTestTask("Task 1", { status: "todo", priority: "low" });
      await createTestTask("Task 2", {
        status: "inProgress",
        priority: "medium",
      });
      await createTestTask("Task 3", { status: "done", priority: "high" });
      await createTestTask("Task 4", { status: "done", priority: "low" });

      const tasksRes = await request(app)
        .get("/api/tasks")
        .set("Authorization", `Bearer ${mockToken}`);
      expect(tasksRes.status).toBe(200);
      expect(tasksRes.body.tasks).toHaveLength(4);

      const res = await request(app)
        .get("/api/statistics?period=week")
        .set("Authorization", `Bearer ${mockToken}`);

      expect(res.status).toBe(200);
      expect(res.body.statusDistribution).toEqual({
        todo: 1,
        inProgress: 1,
        done: 2,
      });
      expect(res.body.priorityDistribution).toEqual({
        low: 1,
        medium: 0,
        high: 1,
      });
      expect(res.body.timeline).toHaveLength(7);

      const today = new Date().toISOString().slice(0, 10);
      const todayPoint = res.body.timeline.find(
        (point: any) => point.date === today,
      );
      expect(todayPoint).toBeDefined();
      expect(todayPoint.created).toBe(4);
      expect(todayPoint.completed).toBe(2);
    });

    test("should return timeline for month period (30 days)", async () => {
      const res = await request(app)
        .get("/api/statistics?period=month")
        .set("Authorization", `Bearer ${mockToken}`);

      expect(res.status).toBe(200);
      expect(res.body.timeline).toHaveLength(30);
    });
  });
});
