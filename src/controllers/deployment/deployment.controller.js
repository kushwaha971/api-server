const { generateSlug } = require("random-word-slugs");
const { runEcsTask } = require("../../config/ecs");
const db = require("../../models");
const { Sequelize } = require("sequelize");
const { client } = require("../../config/kafka");
const deploymentController = {};

deploymentController.createDeployment = async (req, res) => {
  try {
    const { projectId } = req.body;

    const project = await db.Project.findByPk(projectId);

    console.log("Deployment", project.dataValues);
    if (!project) return res.status(404).json({ error: "Project Not Found!" });

    const deployment = await db.Deployment.create({
      project_id: projectId,
      status: "QUEUED",
    });

    if (deployment) {
      console.log("ddd--->", deployment, deployment.dataValues.id);
      const gitURL = project.dataValues.git_url;
      const deploymentId = deployment.dataValues.id;
      await runEcsTask({ gitURL, projectId, deploymentId });
      return res.json({
        status: "queued",
        data: { data: { deploymentId: deploymentId } },
      });
    }
  } catch (error) {
    console.error("Error creating ECS task:", error);
    return res.status(500).json({ error: "Failed to create ECS task" });
  }
};

deploymentController.getLogs = async (req, res) => {
  try {
    const id = req.params.id;
    const logs = await client.query({
      query: `SELECT event_id, deployment_id, log, timestamp from log_events where deployment_id = {deployment_id:String}`,
      query_params: {
        deployment_id: id,
      },
      format: "JSONEachRow",
    });

    const rawLogs = await logs.json();

    return res.json({ logs: rawLogs });
  } catch (error) {
    console.error("Error in getting logs:", error);
    return res.status(500).json({ error: "Error in getting logs", error });
  }
};

module.exports = deploymentController;
