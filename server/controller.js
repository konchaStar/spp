import db from "./model/index.js";
import { io } from "./index.js";

const Task = db.tasks;
const User = db.users;

class Controller {
    create = (task) => {
        Task.create(task)
            .then((data) => io.emit("newTask", data));
    };

    get = () => {
        Task.findAll()
            .then((data) => io.emit("tasks", data));
    };

    getByStatus = (status) => {
        Task.findAll({ where: { status } })
            .then((data) => io.emit("filteredTasks", data));
    };

    update = (task) => {
        const id = task.id;
        Task.update({ task }, { where: { id } })
            .then((data) => io.emit("updatedTask", id));
    };

    deleteTask = (id) => {
        Task.destroy({ where: { id: id } })
            .then((num) => io.emit("deletedTask", id));
    };

    createUser = async (user) => {
        const newUser = await User.create(user);
        return newUser;
    };

    getUserByUserName = async (userName) => {
        const user = await User.findOne({ where: { userName } });
        return user ? user : null;
    }
}

export default new Controller();