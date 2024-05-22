module.exports = (sequelize, Sequelize) => {
  const Project = sequelize.define(
    "project",
    {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      git_url: {
        type: Sequelize.STRING,
      },
      domain: {
        type: Sequelize.STRING,
      },
      custome_domain: {
        type: Sequelize.STRING,
      },
    },
    {
      timestamps: true,
    }
  );

  return Project;
};
