import db from "./model/index.js";

const Task = db.tasks;

const Op = db.Sequelize.Op;

export const create = (req, res, file) => {
    const { title, dueDate, status } = req.body;
    Task.create({ title, dueDate, status, file })
        .then((data) => res.status(200).json(data));
};

export const get = (req, res) => {
    Task.findAll()
        .then((data) => res.status(200).json(data));
};

export const getByStatus = (req, res) => {
    Task.findAll({ where: { status: req.params.filter } })
        .then((data) => res.status(200).json(data));
};

export const update = (req, res) => {
    const id = req.params.id;
    const { title, status, dueDate } = req.body;
    Task.update({ title, status, dueDate }, { where: { id } })
        .then((data) => res.status(201).json({ id }))
};

export const deleteTask = (req, res) => {
    const id = req.params.id;
    Task.destroy({ where: { id: id } })
        .then(num => {
            res.status(201).json({ id });
        });
};