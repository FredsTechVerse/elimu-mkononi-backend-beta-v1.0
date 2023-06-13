const functions = require("firebase-functions");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
require("dotenv").config();

const routes = [
  { path: "/chapter", route: require("./routes/ChapterRoute") },
  { path: "/lesson", route: require("./routes/LessonRoute") },
  { path: "/s3Direct", route: require("./routes/s3UploadRoute") },
  { path: "/resources", route: require("./routes/ResourcesRoute") },
  { path: "/course", route: require("./routes/CourseRoute") },
  { path: "/notes", route: require("./routes/NotesRoute") },
  { path: "/unit", route: require("./routes/UnitRoute") },
  { path: "/auth", route: require("./routes/AuthRoute") },
];

// CONNECTION TO DATABASE,
//========================
mongoose.connect(process.env.DATABASE_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// CONNECTION TEST
//=================
const db = mongoose.connection;
// CONNECTION ERROR HANDLING
db.on("open", function (ref) {
  connected = true;
  console.log("open connection to mongo server.");
});

db.on("connected", function (ref) {
  connected = true;
  console.log("connected to mongo server.");
});

db.on("disconnected", function (ref) {
  connected = false;
  console.log("disconnected from mongo server.");
});

db.on("close", function (ref) {
  connected = false;
  console.log("close connection to mongo server");
});

db.on("error", function (err) {
  connected = false;
  if (err.code == "ESERVFAIL") {
    console.log("Network Error");
  } else {
    console.log("error connection to mongo server!");
  }
});

db.on("reconnect", function (ref) {
  connected = true;
  console.log("reconnect to mongo server.");
});

//CORS CONFIGURATION
//===================
const corsOptions = {
  origin: "*",
  methods: ["GET", "POST", "PUT"],
  allowedHeaders: "*",
};

// MIDDLEWARE DECLARATION
//=========================
app.use(cors(corsOptions)); // ROUTES DEFINATION
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

routes.forEach((route) => {
  app.use(route.path, route.route);
});

app.get("/", (req, res) => {
  res.status(200).json({ message: "Hello from warmup server." });
});

// app.listen("3000", () => {
//   console.log("Listening on port 3000");
// });

exports.app = functions.https.onRequest(app);
