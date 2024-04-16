const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  try {

    const token = req.headers["x-access-token"];
    // console.log(token)
    if (!token) {
      throw new Error("No token provided");
    }
    const { userId } = jwt.verify(token, process.env.TOKEN_KEY);

    req.body = {
      ...req.body,
      userId,
    };

    return next();
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};



module.exports = { verifyToken };
