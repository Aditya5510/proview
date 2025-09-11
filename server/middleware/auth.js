const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const token = req.headers["x-access-token"];

  if (!token) {
    return res.status(403).send("A token is required for authentication");
  }

  try {
    const secret =
      process.env.TOKEN_KEY || "your-fallback-secret-key-for-development";
    const decoded = jwt.verify(token, secret);
    req.user = decoded;
  } catch (err) {
    console.error("Token verification failed:", err.message);
    return res.status(401).send("Invalid Token");
  }
  return next();
};

const verifyTokenOptional = (req, res, next) => {
  const token = req.headers["x-access-token"];

  if (!token) {
    req.user = null;
    return next();
  }

  try {
    const secret =
      process.env.TOKEN_KEY || "your-fallback-secret-key-for-development";
    const decoded = jwt.verify(token, secret);
    req.user = decoded;
  } catch (err) {
    console.error("Token verification failed:", err.message);
    req.user = null;
  }
  return next();
};

module.exports = { verifyToken, verifyTokenOptional };
