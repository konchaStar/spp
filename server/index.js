import express from "express";
import cors from "cors";
import multer from "multer";
import path from "path";
import db from "./model/index.js";
import { get } from "./controller.js";
import { create } from "./controller.js";
import { deleteTask } from "./controller.js";
import { getByStatus } from "./controller.js";
import { update } from "./controller.js";

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

db.sequelize.sync()
    .then(() => {
        console.log("Synced db.");
    })
    .catch((err) => {
        console.log("Failed to sync db: " + err.message);
    });

app.get('/', (req, res) => {
    get(req, res);
});

app.post("/add", upload.single("file"), (req, res) => {
    const file = req.file ? req.file.filename : null;
    console.log(req.body);
    create(req, res, file);
});

app.get("/uploads/:filename", (req, res) => {
    const fileName = req.params.filename;
    const filePath = path.join(process.cwd(), "uploads", fileName);
    res.status(200).sendFile(filePath);
});

app.delete("/delete/:id", (req, res) => {
    deleteTask(req, res);
});

app.get("/filter/:filter", (req, res) => {
    getByStatus(req, res);
});

app.put("/update/:id", (req, res) => {
    update(req, res);
});

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});