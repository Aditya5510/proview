const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/User");

module.exports = function (passport) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL:
          process.env.NODE_ENV === "production"
            ? "https://proview-backend-five.vercel.app/auth/google/callback"
            : "http://localhost:5000/auth/google/callback",
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          console.log("Google OAuth profile:", {
            id: profile.id,
            displayName: profile.displayName,
            email: profile.emails?.[0]?.value,
            photo: profile.photos?.[0]?.value,
          });

          let user = await User.findOne({ googleId: profile.id });

          if (user) {
            console.log("Existing user found:", user._id);
            return done(null, user);
          }

          console.log("Creating new user...");
          user = await User.create({
            googleId: profile.id,
            username: profile.displayName,
            email: profile.emails[0].value,
            image: profile.photos[0].value,
          });

          console.log("New user created:", user._id);
          return done(null, user);
        } catch (error) {
          console.error("Error in Google OAuth strategy:", error);
          return done(error, null);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (error) {
      done(error, null);
    }
  });
};
