const express = require("express");
const router = express.Router();
const userControllers = require("../controllers/userControllers");
const { verifyToken } = require("../middleware/auth");

router.post("/register", userControllers.register);
router.post("/login", userControllers.login);
router.post("/addLink", verifyToken, userControllers.AddLink);
router.post("/getLinks", verifyToken, userControllers.GetLinks);
router.post("/updateLink", verifyToken, userControllers.UpdateLink);
router.post("/deleteLink", verifyToken, userControllers.DeleteLink);
router.post("/updateImage", verifyToken, userControllers.UpdateImage);
router.get("/getLinks/:userId", userControllers.getLinks);
router.post("/updateColor", verifyToken, userControllers.UpdateColor);
router.post("/updateImage2", verifyToken, userControllers.UpdateCover);

// Customization routes
router.get("/customization", verifyToken, userControllers.getCustomization);
router.post("/customization", verifyToken, userControllers.updateCustomization);
router.get("/customization/:userId", userControllers.getPublicCustomization);

router.post("/like/:userId", userControllers.likeProfile);
router.get("/stats/:userId", userControllers.getProfileStats);

module.exports = router;
