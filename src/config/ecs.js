const { ECSClient, RunTaskCommand } = require("@aws-sdk/client-ecs");

const ecsClient = new ECSClient({
  region: "ap-south-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const config = {
  CLUSTER: process.env.AWS_ECS_CLUSTER,
  TASK: process.env.AWS_ECS_TASK,
};

async function runEcsTask({ gitURL, projectId, deploymentId }) {
  console.log({ gitURL, projectId, deploymentId });
  const command = new RunTaskCommand({
    cluster: config.CLUSTER,
    taskDefinition: config.TASK,
    launchType: "FARGATE",
    count: 1,
    networkConfiguration: {
      awsvpcConfiguration: {
        assignPublicIp: "ENABLED",
        subnets: [
          "subnet-025366e7d14579273",
          "subnet-09cd1b154b024c1a6",
          "subnet-04ebf59bec810c585",
        ],
        securityGroups: ["sg-0665c541304c3a881"],
      },
    },
    overrides: {
      containerOverrides: [
        {
          name: "builder-image",
          environment: [
            { name: "GIT_REPOSITORY__URL", value: gitURL },
            { name: "PROJECT_ID", value: projectId },
            { name: "DEPLOYMENT_ID", value: deploymentId },
          ],
        },
      ],
    },
  });

  return ecsClient.send(command);
}

module.exports = { runEcsTask };
