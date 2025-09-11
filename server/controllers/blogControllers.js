const Blog = require("../models/Blog");

const createBlog = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { title, content, image, videoUrl } = req.body;

    if (!title) {
      return res.status(400).json({ error: "Title is required" });
    }

    const blog = await Blog.create({
      user: userId,
      title,
      content: content || "",
      image,
      videoUrl,
    });

    return res.json({ success: true, blog });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

const getMyBlogs = async (req, res) => {
  try {
    const userId = req.user.userId;
    const blogs = await Blog.find({ user: userId })
      .populate("user", "name email profile")
      .sort({ createdAt: -1 })
      .lean();
    return res.json({ success: true, blogs });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

const deleteBlog = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { blogId } = req.body;
    if (!blogId) {
      return res.status(400).json({ error: "blogId is required" });
    }
    const blog = await Blog.findOne({ _id: blogId, user: userId });
    if (!blog) {
      return res.status(404).json({ error: "Blog not found" });
    }
    await blog.deleteOne();
    return res.json({ success: true });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

const getUserRecentBlogs = async (req, res) => {
  try {
    const { userId } = req.params;
    const blogs = await Blog.find({ user: userId })
      .populate("user", "name email profile")
      .sort({ createdAt: -1 })
      .limit(2)
      .lean();
    return res.json({ success: true, blogs });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

const getUserAllBlogs = async (req, res) => {
  try {
    const { userId } = req.params;
    const blogs = await Blog.find({ user: userId })
      .populate("user", "name email profile")
      .sort({ createdAt: -1 })
      .lean();
    return res.json({ success: true, blogs });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

const getBlogById = async (req, res) => {
  try {
    const { blogId } = req.params;
    const userId = req.user?.userId; // Optional - for authenticated users

    const blog = await Blog.findById(blogId)
      .populate("user", "name email profile")
      .lean();
    if (!blog) return res.status(404).json({ error: "Blog not found" });

    // Check if user has already viewed this blog by querying the database directly
    if (userId) {
      const hasViewed = await Blog.findOne({
        _id: blogId,
        viewedBy: userId,
      });

      if (!hasViewed) {
        // User hasn't viewed this blog before, increment view count
        await Blog.findByIdAndUpdate(blogId, {
          $inc: { views: 1 },
          $addToSet: { viewedBy: userId },
        });
        blog.views = (blog.views || 0) + 1;
      }
    } else {
      // For anonymous users, increment view count (no tracking)
      await Blog.findByIdAndUpdate(blogId, { $inc: { views: 1 } });
      blog.views = (blog.views || 0) + 1;
    }

    return res.json({ success: true, blog });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

const likeBlog = async (req, res) => {
  try {
    const { blogId } = req.params;
    const userId = req.user.userId;

    const blog = await Blog.findById(blogId);
    if (!blog) return res.status(404).json({ error: "Blog not found" });

    const isLiked = blog.likedBy.includes(userId);

    if (isLiked) {
      // Unlike
      await Blog.findByIdAndUpdate(blogId, {
        $pull: { likedBy: userId },
        $inc: { likes: -1 },
      });
    } else {
      // Like
      await Blog.findByIdAndUpdate(blogId, {
        $addToSet: { likedBy: userId },
        $inc: { likes: 1 },
      });
    }

    const updatedBlog = await Blog.findById(blogId).lean();
    return res.json({
      success: true,
      liked: !isLiked,
      likes: updatedBlog.likes,
    });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

module.exports = {
  createBlog,
  getMyBlogs,
  deleteBlog,
  getUserRecentBlogs,
  getUserAllBlogs,
  getBlogById,
  likeBlog,
};
