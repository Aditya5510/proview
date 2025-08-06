const express = require("express");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const router = express.Router();

// @route   GET /auth/google
// @desc    Auth with Google
// @access  Public
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// @route   GET /auth/google/callback
// @desc    Google auth callback
// @access  Public
router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  (req, res) => {
    // Generate JWT token
    const token = jwt.sign(
      {
        userId: req.user._id,
        email: req.user.email,
        username: req.user.username,
      },
      process.env.JWT_SECRET,
      { expiresIn: "30d" }
    );

    // Redirect to frontend with token
    // Detect if running locally (development server uses port 5000)
    const isLocal =
      req.get("host")?.includes("localhost") ||
      req.get("host")?.includes("127.0.0.1");
    const frontendURL = isLocal
      ? "http://localhost:5173"
      : "https://proview-7pk6.vercel.app";

    console.log("OAuth Callback Debug:");
    console.log("Host:", req.get("host"));
    console.log("Is Local:", isLocal);
    console.log("Frontend URL:", frontendURL);

    // Redirect with token as query parameter
    res.redirect(
      `${frontendURL}/auth/callback?token=${token}&user=${encodeURIComponent(
        JSON.stringify({
          userId: req.user._id,
          email: req.user.email,
          username: req.user.username,
          image: req.user.image,
        })
      )}`
    );
  }
);

// @route   POST /auth/logout
// @desc    Logout user
// @access  Public
router.post("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ error: "Logout failed" });
    }
    res.json({ message: "Logged out successfully" });
  });
});

module.exports = router;
