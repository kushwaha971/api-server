const { generateSlug } = require("random-word-slugs");
const db = require("../../models");
const projectController = {};

projectController.createProject = async (req, res) => {
  try {
    const { name, git_url, user_id } = req.body;
    const project = await db.Project.create({
      name,
      git_url,
      custome_domain: generateSlug(),
      user_id,
    });

    return res.json({ status: "success", data: { project } });
  } catch (error) {
    console.error("Error creating ECS task:", error);
    return res.status(500).json({ error: "Failed to create ECS task" });
  }
};

module.exports = projectController;
