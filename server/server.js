const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const cors = require("cors");
const session = require("express-session");
const passport = require("./config/passport");

const app = express();
const bodyParser = require("body-parser");

const users = require("./routes/users");
const auth = require("./routes/auth");

const httpServer = require("http").createServer(app);

mongoose.connect(
  process.env.MONGO_URI,
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => {
    console.log("MongoDB connected");
  }
);

httpServer.listen(process.env.PORT || 5000, () => {
  console.log("Listening");
});

app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:5173", "https://proview-7pk6.vercel.app"],
    credentials: true,
  })
);

app.use(
  session({
    secret: process.env.SESSION_SECRET || "your-secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/api/users", users);
app.use("/auth", auth);
