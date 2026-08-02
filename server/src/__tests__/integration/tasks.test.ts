import request from "supertest";

import { mockToken, mockUid, createTestTask, expectUnauthorized } from "@tests/helpers";

import Task from "@models/TaskModel";
import app from "@/index";

describe("Tasks API", () => {
  describe("GET /tasks", () => {
    test("should return 401 without token", async () => {
      const res = await request(app).get("/api/tasks");

      expectUnauthorized(res);
    });

    test("should return empty array for new user", async () => {
      const res = await request(app)
        .get("/api/tasks")
        .set("Authorization", `Bearer ${mockToken}`);

      expect(res.status).toBe(200);
      expect(res.body.tasks).toEqual([]);
    });

    test("should return tasks for authenticated user", async () => {
      await createTestTask("Task 1");
      await createTestTask("Task 2");

      const res = await request(app)
        .get("/api/tasks")
        .set("Authorization", `Bearer ${mockToken}`);

      expect(res.status).toBe(200);
      expect(res.body.tasks).toHaveLength(2);
      expect(res.body.tasks[0].title).toBe("Task 2");
      expect(res.body.tasks[0].firebaseUid).toBe(mockUid);
    });

    test("should filter tasks by status", async () => {
      await createTestTask("Task 1", { status: "todo" });
      await createTestTask("Task 2", { status: "done" });

      const res = await request(app)
        .get("/api/tasks?status=todo")
        .set("Authorization", `Bearer ${mockToken}`);

      expect(res.status).toBe(200);
      expect(res.body.tasks).toHaveLength(1);
      expect(res.body.tasks[0].title).toBe("Task 1");
    });

    test("should filter tasks by priority", async () => {
      await createTestTask("Task 1", { priority: "low" });
      await createTestTask("Task 2", { priority: "high" });

      const res = await request(app)
        .get("/api/tasks?priority=high")
        .set("Authorization", `Bearer ${mockToken}`);

      expect(res.status).toBe(200);
      expect(res.body.tasks).toHaveLength(1);
      expect(res.body.tasks[0].title).toBe("Task 2");
    });

    test("should search tasks by title", async () => {
      await createTestTask("Task 1");
      await createTestTask("Very different task title");

      const res = await request(app)
        .get("/api/tasks?search=different")
        .set("Authorization", `Bearer ${mockToken}`);
      expect(res.status).toBe(200);
      expect(res.body.tasks).toHaveLength(1);
      expect(res.body.tasks[0].title).toBe("Very different task title");
    });
  });

  describe("POST /tasks", () => {
    test("should return 401 without token", async () => {
      const res = await request(app)
        .post("/api/tasks")
        .send({ title: "Task 1" });

      expectUnauthorized(res);
    });

    test("should create a task with default priority and status", async () => {
      const res = await request(app)
        .post("/api/tasks")
        .set("Authorization", `Bearer ${mockToken}`)
        .send({ title: "Task 1" });

      expect(res.status).toBe(201);
      expect(res.body.task).toMatchObject({
        title: "Task 1",
        priority: "medium",
        status: "todo",
        firebaseUid: mockUid,
      });
      expect(res.body.task).toHaveProperty("_id");
    });

    test("should create a task with custom fields", async () => {
      const res = await request(app)
        .post("/api/tasks")
        .set("Authorization", `Bearer ${mockToken}`)
        .send({
          title: "Task 1",
          priority: "high",
          status: "inProgress",
          description: "Custom description",
          deadline: "2026-12-31",
        });

      expect(res.status).toBe(201);
      expect(res.body.task).toMatchObject({
        title: "Task 1",
        priority: "high",
        status: "inProgress",
        description: "Custom description",
        firebaseUid: mockUid,
      });
      expect(res.body.task.deadline).toBe("2026-12-31T00:00:00.000Z");
    });

    test("should return 400 if title is empty", async () => {
      const res = await request(app)
        .post("/api/tasks")
        .set("Authorization", `Bearer ${mockToken}`)
        .send({ title: "   " });

      expect(res.status).toBe(400);
      expect(res.body.message).toBe("Название задачи обязательно");
    });

    test("should return 400 if title is missing", async () => {
      const res = await request(app)
        .post("/api/tasks")
        .set("Authorization", `Bearer ${mockToken}`)
        .send({});

      expect(res.status).toBe(400);
      expect(res.body.message).toBe("Название задачи обязательно");
    });
  });

  describe("PATCH /tasks/:id", () => {
    test("should return 401 without token", async () => {
      const res = await request(app)
        .patch("/api/tasks/123")
        .send({ title: "Task 1" });

      expectUnauthorized(res);
    });

    test("should update a task", async () => {
      const task = await createTestTask("Task 1");

      const res = await request(app)
        .patch(`/api/tasks/${task._id}`)
        .set("Authorization", `Bearer ${mockToken}`)
        .send({ title: "Task 2", priority: "high" });

      expect(res.status).toBe(200);
      expect(res.body.task).toMatchObject({
        title: "Task 2",
        priority: "high",
        status: "todo",
        firebaseUid: mockUid,
      });
    });

    test("should partially update a task", async () => {
      const task = await createTestTask("Task 1", { priority: "low" });

      const res = await request(app)
        .patch(`/api/tasks/${task._id}`)
        .set("Authorization", `Bearer ${mockToken}`)
        .send({ status: "done" });

      expect(res.status).toBe(200);
      expect(res.body.task).toMatchObject({
        title: "Task 1",
        priority: "low",
        status: "done",
      });
    });

    test("should return 404 if task not found", async () => {
      const res = await request(app)
        .patch("/api/tasks/wrongId")
        .set("Authorization", `Bearer ${mockToken}`)
        .send({ title: "Updated" });

      expect(res.status).toBe(404);
      expect(res.body.message).toBe("Задача не найдена");
    });

    test("should return 404 if task belongs to another user", async () => {
      const otherTask = await Task.create({
        firebaseUid: "other-user-456",
        title: "Task 1",
      });

      const res = await request(app)
        .patch(`/api/tasks/${otherTask._id}`)
        .set("Authorization", `Bearer ${mockToken}`)
        .send({ title: "Task 2" });

      expect(res.status).toBe(404);
    });
  });

  describe("DELETE /tasks/:id", () => {
    test("should return 401 without token", async () => {
      const res = await request(app).delete("/api/tasks/123");

      expectUnauthorized(res);
    });

    test("should delete a task", async () => {
      const task = await createTestTask("Task 1");

      const res = await request(app)
        .delete(`/api/tasks/${task._id}`)
        .set("Authorization", `Bearer ${mockToken}`);

      expect(res.status).toBe(200);
      expect(res.body.message).toBe("Задача успешно удалена");

      const deleted = await Task.findById(task._id);
      expect(deleted).toBeNull();
    });

    test("should return 404 if task not found", async () => {
      const res = await request(app)
        .delete("/api/tasks/wrongId")
        .set("Authorization", `Bearer ${mockToken}`);

      expect(res.status).toBe(404);
      expect(res.body.message).toBe("Задача не найдена");
    });

    test("should return 404 if task belongs to another user", async () => {
      const otherTask = await Task.create({
        firebaseUid: "other-user-456",
        title: "Task 1",
      });

      const res = await request(app)
        .delete(`/api/tasks/${otherTask._id}`)
        .set("Authorization", `Bearer ${mockToken}`);

      expect(res.status).toBe(404);
    });
  });

  describe("DELETE /tasks", () => {
    test("should return 401 without token", async () => {
      const res = await request(app).delete("/api/tasks");

      expectUnauthorized(res);
    });

    test("should delete all tasks of the user", async () => {
      await createTestTask("Task 1");
      await createTestTask("Task 2");
      await createTestTask("Task 3");

      await Task.create({
        firebaseUid: "other-user-456",
        title: "Task 4",
      });

      const res = await request(app)
        .delete("/api/tasks")
        .set("Authorization", `Bearer ${mockToken}`);

      expect(res.status).toBe(200);
      expect(res.body.message).toBe("Задач удалено: 3");

      const myTasks = await Task.find({ firebaseUid: mockUid });
      expect(myTasks).toHaveLength(0);

      const otherTasks = await Task.find({ firebaseUid: "other-user-456" });
      expect(otherTasks).toHaveLength(1);
    });

    test("should return 200 even if no tasks to delete", async () => {
      const res = await request(app)
        .delete("/api/tasks")
        .set("Authorization", `Bearer ${mockToken}`);

      expect(res.status).toBe(200);
      expect(res.body.message).toBe("Задач удалено: 0");
    });
  });
});
