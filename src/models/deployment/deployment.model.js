const status = require("./status");

module.exports = (sequelize, Sequelize) => {
  const Deployment = sequelize.define(
    "deployment",
    {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      status: {
        type: Sequelize.ENUM(
          "QUEUED",
          "PROGRESS",
          "READY",
          "FAIL",
          "NOT_STARTED"
        ),
        allowNull: false,
        defaultValue: "NOT_STARTED",
      },
    },
    {
      timestamps: true,
    }
  );

  return Deployment;
};
