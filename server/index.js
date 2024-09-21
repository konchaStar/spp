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
import { Server } from "socket.io";
import fs from "fs";

const app = express();
export const io = new Server(8080, {
    cors: {
        origin: 'http://localhost:5173',
    },
});

io.on('connection', (socket) => {

    const requireAuth = (callback) => {
        return (...args) => {
            const token = socket.handshake.auth.token;
            if (token) {
                try {
                    jwt.verify(token, 'asjdkdl-fjjjfjfj-suusudi-mksdj');
                    callback(...args);
                } catch (error) {
                    socket.emit("tokenError");
                }
            } else {
                socket.emit("tokenError");
            }
        };
    };

    socket.on('getTasks', requireAuth(controller.get));
    socket.on('addTask', requireAuth(controller.create));
    socket.on('deleteTask', requireAuth(controller.deleteTask));
    socket.on('getFilteredTasks', requireAuth(controller.getByStatus));
    socket.on('updateTask', requireAuth(controller.update));
    socket.on('uploadFile', requireAuth(uploadFile));
});

app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());
app.use(cookieParser());

const uploadFile = (data) => {
    const { fileName, fileData } = data;

    const filePath = path.join(process.cwd(), "uploads", fileName);
    fs.writeFile(filePath, fileData, 'base64', (err) => {
        io.emit("uploadedFile", fileName);
    });
}

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
        res.cookie('token', token);
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
            res.cookie('token', token);
            res.status(200).json({ message: 'Logged' });
        } else {
            res.status(400).json({ message: "Invalid password" });
        }
    } else {
        res.status(400).json({ message: "User doesn't exists" });
    }
});

app.get("/uploads/:filename", authMiddleware, (req, res) => {
    const fileName = req.params.filename;
    const filePath = path.join(process.cwd(), "uploads", fileName);
    res.status(200).sendFile(filePath);
});


const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});