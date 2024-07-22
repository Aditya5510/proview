const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
// const path = require("path");
const app = express();
const bodyParser = require("body-parser");

const users = require("./routes/users");

dotenv.config();

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
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/api/users", users);

// if (process.env.NODE_ENV == "production") {
//   app.use(express.static(path.join(__dirname, "/client/build")));

//   app.get("*", (req, res) => {
//     res.sendFile(path.join(__dirname, "client/build", "index.html"));
//   });
// }
