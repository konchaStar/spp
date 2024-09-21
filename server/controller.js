import db from "./model/index.js";

const Task = db.tasks;
const User = db.users;

//const Op = db.Sequelize.Op;

class Controller {
    create = (req, res) => {
        const { title, dueDate, status } = req.body;
        const file = req.file ? req.file.filename : null;
        Task.create({ title, dueDate, status, file })
            .then((data) => res.status(200).json(data));
    };

    get = (req, res) => {
        Task.findAll()
            .then((data) => res.status(200).json(data));
    };

    getByStatus = (req, res) => {
        Task.findAll({ where: { status: req.params.filter } })
            .then((data) => res.status(200).json(data));
    };

    update = (req, res) => {
        const id = req.params.id;
        const { title, status, dueDate } = req.body;
        Task.update({ title, status, dueDate }, { where: { id } })
            .then((data) => res.status(201).json({ id }))
    };
    
    deleteTask = (req, res) => {
        const id = req.params.id;
        Task.destroy({ where: { id: id } })
            .then(num => {
                res.status(201).json({ id });
            });
    };

    createUser = async (user) => {
        const newUser = await User.create(user);
        return newUser;
    };

    getUserByUserName = async (userName) => {
        const user = await User.findOne({where: {userName}});
        return user ? user : null;
    }
}

export default new Controller();