import express from "express";
import cors from "cors";
import multer from "multer";
import path from "path";
import db from "./model/index.js";
import controller from "./controller.js"

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

app.get('/', controller.get);

app.post("/add", upload.single("file"), controller.create);

app.get("/uploads/:filename", (req, res) => {
    const fileName = req.params.filename;
    const filePath = path.join(process.cwd(), "uploads", fileName);
    res.status(200).sendFile(filePath);
});

app.delete("/delete/:id", controller.deleteTask);

app.get("/filter/:filter", controller.getByStatus);

app.put("/update/:id", controller.updatec);

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});