const express = require("express");
const app = express();
app.use(express.json());

let tasks = [];


app.get("/", (req, res) => {
  res.send("Task Manager API is running 🚀");
});

app.get("/health", (req, res) => {
  res.json({ status: "ok", version: "6.0" });
});

app.get("/tasks", (req, res) => {
  res.json(tasks);
});

app.post("/tasks", (req, res) => {
  const task = { id: Date.now(), title: req.body.title };
  tasks.push(task);
  res.status(201).json(task);
});

app.delete("/tasks/:id", (req, res) => {
  tasks = tasks.filter(t => t.id != req.params.id);
  res.sendStatus(204);
});

if (require.main === module) {
  app.listen(3000, () => console.log("Server running on port 3000"));
}

module.exports = app;