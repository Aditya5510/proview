const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Link = require("../models/Link");
const crypto = require("crypto");

const getUserDict = (token, user) => {
  return {
    token,
    username: user.username,
    userId: user._id,
    email: user.email,
    phone: user.phone,
    state: user.state,
    college: user.college,
    profile: user.profile,
    cover: user.cover,
  };
};

const buildToken = (user) => {
  return {
    userId: user._id,
  };
};

const generateVisitorId = (req) => {
  const ip = req.ip || req.connection.remoteAddress;
  const userAgent = req.get("User-Agent") || "";
  const combined = `${ip}-${userAgent}`;
  return crypto.createHash("md5").update(combined).digest("hex");
};

const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!(username && email && password)) {
      throw new Error("All input required");
    }
    const normalizedEmail = email.toLowerCase();
    const hashedPassword = await bcrypt.hash(password, 10);
    const existingUser = await User.findOne({
      email: normalizedEmail,
    });
    if (existingUser) {
      throw new Error("Email and username must be unique");
    }

    const user = await User.create({
      username,
      email: normalizedEmail,
      password: hashedPassword,
    });
    const token = jwt.sign(buildToken(user), process.env.TOKEN_KEY);

    return res.json({
      ...getUserDict(token, user),
      message: "Registered successfully",
    });
  } catch (err) {
    return res.status(400).json({
      error: err.message,
      message: "This is error while sending email from backend ",
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!(email && password)) {
      throw new Error("All input required");
    }

    const normalizedEmail = email.toLowerCase();

    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      throw new Error("Email or password incorrect");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new Error("Email or password incorrect");
    }
    const token = jwt.sign(buildToken(user), process.env.TOKEN_KEY);

    return res.json(getUserDict(token, user));
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

const AddLink = async (req, res) => {
  try {
    const { title, url, description } = req.body;
    const userId = req.user.userId;

    const user = await User.findById(userId).populate("Links");
    if (!user) {
      throw new Error("User not found");
    }

    for (const link of user.Links) {
      if (link.url === url) {
        throw new Error("Link already exists");
      }
    }

    for (const link of user.Links) {
      if (link.title === title) {
        throw new Error("Profile already exists");
      }
    }

    const link = await Link.create({
      title,
      url,
      description,
      user: userId,
    });
    user.Links.push(link);
    await user.save();

    return res.status(200).json({ succes: true, link });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

const GetLinks = (req, res) => {
  try {
    const userId = req.user.userId;
    User.findById(userId)
      .populate("Links")
      .exec((err, user) => {
        if (err) {
          return res.status(400).json({ error: "User not found" });
        }

        if (!user) {
          return res.status(404).json({ error: "User not found" });
        }

        return res.status(200).json(user.Links || []);
      });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

const UpdateLink = async (req, res) => {
  try {
    const { title, url, description } = req.body;
    const userId = req.user.userId;
    const user = await User.findById(userId).populate("Links");
    if (!user) {
      throw new Error("User not found");
    }

    const tobedelete = user.Links.filter((link) => link.title === title);

    const link = user.Links.find((link) => link.title === title);
    if (!link) {
      throw new Error("Link not found");
    }

    link.title = title;
    link.url = url;
    link.description = description;
    await link.save();
    return res.status(200).json({ success: true, link });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

const DeleteLink = async (req, res) => {
  try {
    const { title } = req.body;
    const userId = req.user.userId;
    const user = await User.findById(userId).populate("Links");
    if (!user) {
      throw new Error("User not found");
    }

    const link = user.Links.find((link) => link.title === title);
    if (!link) {
      throw new Error("Link not found");
    }

    const index = user.Links.indexOf(link);
    user.Links.splice(index, 1);
    await link.remove();
    await user.save();

    return res.status(200).json({ success: true });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

const UpdateImage = async (req, res) => {
  try {
    const { profile } = req.body;
    const userId = req.user.userId;
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }
    user.profile = profile;
    await user.save();
    return res.status(200).json({ success: true });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

const getLinks = (req, res) => {
  try {
    const { userId } = req.params;
    const visitorId = generateVisitorId(req);

    User.findById(userId)
      .populate("Links")
      .exec(async (err, user) => {
        if (err) {
          return res.status(400).json({ error: "User not found" });
        }

        if (!user) {
          return res.status(404).json({ error: "User not found" });
        }

        if (!user.viewedBy.includes(visitorId)) {
          user.viewedBy.push(visitorId);
          user.views = user.viewedBy.length;
          await user.save();
        }

        return res.status(200).json(user);
      });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

const likeProfile = async (req, res) => {
  try {
    const { userId } = req.params;
    const visitorId = generateVisitorId(req);

    const user = await User.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    if (user.likedBy.includes(visitorId)) {
      user.likedBy = user.likedBy.filter((id) => id !== visitorId);
      user.likes = user.likedBy.length;
      await user.save();

      return res.status(200).json({
        success: true,
        liked: false,
        likes: user.likes,
        message: "Profile unliked successfully",
      });
    } else {
      user.likedBy.push(visitorId);
      user.likes = user.likedBy.length;
      await user.save();

      return res.status(200).json({
        success: true,
        liked: true,
        likes: user.likes,
        message: "Profile liked successfully",
      });
    }
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

const getProfileStats = async (req, res) => {
  try {
    const { userId } = req.params;
    const visitorId = generateVisitorId(req);

    const user = await User.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    const hasLiked = user.likedBy.includes(visitorId);

    return res.status(200).json({
      views: user.views,
      likes: user.likes,
      hasLiked: hasLiked,
    });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

const UpdateColor = async (req, res) => {
  try {
    const { color } = req.body;
    const userId = req.user.userId;
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }
    user.colour = color;
    await user.save();
    return res.status(200).json({ success: true });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

const UpdateCover = async (req, res) => {
  try {
    const { cover } = req.body;
    const userId = req.user.userId;
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }
    user.cover = cover;
    await user.save();
    return res.status(200).json({ success: true });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

module.exports = {
  register,
  login,
  AddLink,
  GetLinks,
  UpdateLink,
  DeleteLink,
  UpdateImage,
  getLinks,
  UpdateColor,
  UpdateCover,
  likeProfile,
  getProfileStats,
};
