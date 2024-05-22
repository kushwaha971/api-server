const express = require("express");
const router = express.Router();
const user = require("./user");
const project = require("./project");
const deployment = require("./deployment");

router.use("/project", project);
router.use("/user", user);
router.use("/deployment", deployment);
module.exports = router;
