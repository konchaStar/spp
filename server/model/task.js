export default (sequelize, Sequelize) => {
    const Task = sequelize.define("tasks", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        title: {
            type: Sequelize.STRING
        },
        status: {
            type: Sequelize.STRING
        },
        dueDate: {
            type: Sequelize.STRING
        },
        file: {
            type: Sequelize.STRING
        }
    });

    return Task;
};