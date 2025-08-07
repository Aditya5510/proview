const express = require("express");
const router = express.Router();
const passport = require("passport");
const jwt = require("jsonwebtoken");

const isLocal = process.env.NODE_ENV !== "production";
const frontendURL = isLocal
  ? "http://localhost:5173"
  : "https://proview-7pk6.vercel.app";

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: `${frontendURL}/login`,
    session: false,
  }),
  (req, res) => {
    try {
      if (!req.user) {
        console.error("No user object in request");
        return res.redirect(`${frontendURL}/login?error=no_user`);
      }

      if (!process.env.TOKEN_KEY) {
        console.error("TOKEN_KEY environment variable is not set");
        // Use a fallback secret if TOKEN_KEY is not set
        const fallbackSecret = "your-fallback-secret-key-for-development";
        console.warn(
          "Using fallback secret - this should be fixed in production"
        );
      }

      const token = jwt.sign(
        {
          userId: req.user._id,
          email: req.user.email,
          username: req.user.username,
        },
        process.env.TOKEN_KEY || "your-fallback-secret-key-for-development",
        { expiresIn: "30d" }
      );

      const userData = {
        userId: req.user._id,
        email: req.user.email,
        username: req.user.username,
        image: req.user.image || req.user.profile,
      };

      res.redirect(
        `${frontendURL}/auth/callback?token=${token}&user=${encodeURIComponent(
          JSON.stringify(userData)
        )}`
      );
    } catch (error) {
      console.error("Error in Google OAuth callback:", error);
      res.redirect(`${frontendURL}/login?error=auth_failed`);
    }
  }
);

module.exports = router;
