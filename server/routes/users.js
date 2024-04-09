const express = require("express");
const router = express.Router();
const userControllers = require("../controllers/userControllers");
const { verifyToken } = require("../middleware/auth");


router.post("/register", userControllers.register);
router.post("/login", userControllers.login);
router.post("/addLink", verifyToken, userControllers.AddLink);
router.get("/getLinks", verifyToken, userControllers.GetLinks);
router.post("/updateLink", verifyToken, userControllers.UpdateLink);

module.exports = router;
