import express from "express";
import cors from "cors";
import multer from "multer";
import path from "path";

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
let id = 0;
let tasks = [];

app.get("/", (req, res) => {
  res.status(200).json(tasks);
});

app.get("/uploads/:filename", (req, res) => {
  const fileName = req.params.filename;
  const filePath = path.join(process.cwd(), "uploads", fileName);
  res.status(200).sendFile(filePath);
});

app.post("/add", upload.single("file"), (req, res) => {
  const { title, status, dueDate } = req.body;
  const file = req.file ? req.file.filename : null;
  const task = { title, status, dueDate, file };
  tasks.push(task);
  task.id = id++;
  res.status(200).json(task);
});

app.delete("/delete/:id", (req, res) => {
  const id = req.params.id;
  tasks = tasks.filter((task) => task.id !== +id);
  res.status(200).json(tasks);
});

app.get("/filter/:filter", (req, res) => {
  const filter = req.params.filter;
  const filteredTasks = tasks.filter((task) => task.status === filter);
  res.status(200).json(filteredTasks);
});

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});