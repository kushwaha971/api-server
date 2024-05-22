const express = require("express");
const userController = require("../../../controllers/user/user.controller");
const { JWTAuth } = require("../../../middleware");
const router = express.Router();

router.post("/signup", userController.signupUser);
router.post("/login", userController.loginUser);
router.put("/update", [JWTAuth.verifyToken], userController.updateUser);

module.exports = router;
