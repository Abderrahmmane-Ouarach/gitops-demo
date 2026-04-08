const request = require("supertest");
const app = require("./app");

describe("Task Manager API", () => {

  it("GET /health returns ok", async () => {
    const res = await request(app).get("/health");
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe("ok");
  });

  it("GET /tasks returns empty array", async () => {
    const res = await request(app).get("/tasks");
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual([]);
  });

  it("POST /tasks creates a task", async () => {
    const res = await request(app)
      .post("/tasks")
      .send({ title: "learn docker" });
    expect(res.statusCode).toBe(201);
    expect(res.body.title).toBe("learn docker");
    expect(res.body.id).toBeDefined();
  });

  it("DELETE /tasks/:id removes a task", async () => {
    const post = await request(app)
      .post("/tasks")
      .send({ title: "to be deleted" });
    const id = post.body.id;

    const del = await request(app).delete(`/tasks/${id}`);
    expect(del.statusCode).toBe(204);
  });

});