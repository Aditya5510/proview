const express = require("express");
const router = express.Router();
const { verifyToken, verifyTokenOptional } = require("../middleware/auth");
const blogControllers = require("../controllers/blogControllers");

router.post("/create", verifyToken, blogControllers.createBlog);
router.post("/delete", verifyToken, blogControllers.deleteBlog);
router.get("/me", verifyToken, blogControllers.getMyBlogs);
router.get("/recent/:userId", blogControllers.getUserRecentBlogs);
router.get("/all/:userId", blogControllers.getUserAllBlogs);
router.get("/one/:blogId", verifyTokenOptional, blogControllers.getBlogById);
router.post("/like/:blogId", verifyToken, blogControllers.likeBlog);

module.exports = router;
