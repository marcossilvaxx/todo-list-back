const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const port = 5000;

app.use(cors());
app.use(bodyParser.json());

let tasks = [];
let taskIdCounter = 1;

app.get("/tasks", (req, res) => {
  res.json(tasks);
});

// Endpoint para criar uma nova tarefa
app.post("/tasks", (req, res) => {
  const { date, description, checked } = req.body;
  if (!date || !description) {
    return res
      .status(400)
      .json({ message: "Date and description are required" });
  }

  const newTask = {
    id: taskIdCounter++,
    date,
    description,
    checked: !!checked,
  };
  tasks.push(newTask);
  res.status(201).json(newTask);
});

app.put("/tasks/:id", (req, res) => {
  const taskId = parseInt(req.params.id);
  const { date, description, checked } = req.body;

  if (!date || !description) {
    return res
      .status(400)
      .json({ message: "Date and description are required" });
  }

  const taskIndex = tasks.findIndex((task) => task.id === taskId);
  if (taskIndex === -1) {
    return res.status(404).json({ message: "Task not found" });
  }

  tasks[taskIndex] = { id: taskId, date, description, checked: !!checked };
  res.json(tasks[taskIndex]);
});

app.delete("/tasks/:id", (req, res) => {
  const taskId = parseInt(req.params.id);
  const taskIndex = tasks.findIndex((task) => task.id === taskId);

  if (taskIndex === -1) {
    return res.status(404).json({ message: "Task not found" });
  }

  tasks.splice(taskIndex, 1);
  res.status(204).send();
});

app.patch("/tasks/:id/checked", (req, res) => {
  const taskId = parseInt(req.params.id);
  const { checked } = req.body;

  const taskIndex = tasks.findIndex((task) => task.id === taskId);
  if (taskIndex === -1) {
    return res.status(404).json({ message: "Task not found" });
  }

  tasks[taskIndex].checked = !!checked;
  res.json(tasks[taskIndex]);
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
