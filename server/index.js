// const express = require("express");
// const bodyParser = require("body-parser");
// const multer = require("multer");
// const path = require("path");
import express from "express";
import cors from "cors";
import multer from "multer";

const app = express();
app.use(cors());
app.use(express.json());

const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    cb(null, "uploads/");
  },
  filename: (_, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

let tasks = [];

app.get("/", (req, res) => {
  res.status(200).json(tasks);
});

app.post("/add", upload.single("file"), (req, res) => {
  const { title, status, dueDate } = req.body;
  const file = req.file ? req.file.filename : null;
  const task = { title, status, dueDate, file };
  tasks.push(task);
  task.id = tasks.length - 1;
  res.status(200).json(task);
});

// app.post("/filter", (req, res) => {
//   const { status } = req.body;
//   const filteredTasks = tasks.filter((task) => task.status === status);
//   res.render("index", { tasks: filteredTasks });
// });

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});