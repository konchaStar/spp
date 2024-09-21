import express from "express";
import cors from "cors";
import multer from "multer";
import path from "path";
import db from "./model/index.js";
import controller from "./controller.js"
import cookieParser from "cookie-parser";
import { authMiddleware } from "./authMiddleware.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const app = express();
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());
app.use(cookieParser());

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

app.post('/reg', async (req, res) => {
    const { userName, password } = req.body;
    if (!controller.getUserByUserName(userName)) {
        const hash = await bcrypt.hash(password, 10);
        controller.createUser({ userName, password: hash });
        const token = jwt.sign({ userName, password: hash }, 'asjdkdl-fjjjfjfj-suusudi-mksdj', {
            expiresIn: '1m',
        });
        res.cookie('token', token, { httpOnly: true });
        res.status(200).json({ message: "created" });
    } else {
        res.status(401).json({ message: "User already exists" });
    }
})

app.post('/login', async (req, res) => {
    const { userName, password } = req.body;
    const user = await controller.getUserByUserName(userName);
    if (user) {
        const match = await bcrypt.compare(password, user.password);
        if (match) {
            const token = jwt.sign({ userName, password: user.password }, 'asjdkdl-fjjjfjfj-suusudi-mksdj', {
                expiresIn: '1m',
            });
            res.cookie('token', token, { httpOnly: true });
            res.status(200).json({ message: 'Logged' });
        } else {
            res.status(400).json({ message: "Invalid password" });
        }
    } else {
        res.status(400).json({ message: "User doesn't exists" });
    }
});

app.get('/', authMiddleware, controller.get);

app.post("/add", authMiddleware, upload.single("file"), controller.create);

app.get("/uploads/:filename", authMiddleware, (req, res) => {
    const fileName = req.params.filename;
    const filePath = path.join(process.cwd(), "uploads", fileName);
    res.status(200).sendFile(filePath);
});

app.delete("/delete/:id", authMiddleware, controller.deleteTask);

app.get("/filter/:filter", authMiddleware, controller.getByStatus);

app.put("/update/:id", authMiddleware, controller.update);

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});