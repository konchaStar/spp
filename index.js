const express = require("express");
const bodyParser = require("body-parser");
const multer = require("multer");
const path = require("path");

const app = express();
const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    cb(null, "uploads/");
  },
  filename: (_, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "uploads")));

let tasks = [];

app.get("/", (req, res) => {
  res.render("index", { tasks });
});

app.post("/add", upload.single("file"), (req, res) => {
  const { title, status, dueDate } = req.body;
  const file = req.file ? req.file.filename : null;
  tasks.push({ title, status, dueDate, file });
  res.redirect("/");
});

app.post("/filter", (req, res) => {
  const { status } = req.body;
  const filteredTasks = tasks.filter((task) => task.status === status);
  res.render("index", { tasks: filteredTasks, filter: status });
});

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});