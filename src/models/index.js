const Sequelize = require("sequelize");
const dbConfig = require("../config/db.config");
const sequelize = new Sequelize(dbConfig.DB_URI, {
  dialect: "postgres",
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.User = require("./user/user.model")(sequelize, Sequelize);
db.Project = require("./project/project.model")(sequelize, Sequelize);
db.Deployment = require("./deployment/deployment.model")(sequelize, Sequelize);

//Mapping Project with user
db.Project.belongsTo(db.User, { foreignKey: "user_id" });
db.User.hasMany(db.Project, {
  foreignKey: "user_id",
  as: "user_project",
});

// Mapping Deployment with project

db.Deployment.belongsTo(db.Project, { foreignKey: "project_id" });
db.Project.hasMany(db.Deployment, {
  foreignKey: "project_id",
  as: "project_deployment",
});

module.exports = db;
