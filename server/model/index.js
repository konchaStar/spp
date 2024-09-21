import { config } from "../config/db.config.js";
import Sequelize from "sequelize";
import tasks from "./task.js";
import users from "./user.js";

const sequelize = new Sequelize(config.DB, config.USER, config.PASSWORD, {
  host: config.HOST,
  dialect: config.dialect,

  pool: {
    max: config.pool.max,
    min: config.pool.min,
    acquire: config.pool.acquire,
    idle: config.pool.idle
  }
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.tasks = tasks(sequelize, Sequelize);
db.users = users(sequelize, Sequelize);

export default db;