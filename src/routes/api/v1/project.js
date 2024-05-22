const express = require("express");
const projectController = require("../../../controllers/project/project.controller");
const { JWTAuth } = require("../../../middleware");

const router = express.Router();

router.post("/create", [JWTAuth.verifyToken], projectController.createProject);

module.exports = router;
