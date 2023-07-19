const functions = require("firebase-functions");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { authenticateToken } = require("./controllers/AuthController");
const app = express();
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const routes = [
  { path: "/chapter", route: require("./routes/ChapterRoute") },
  { path: "/lesson", route: require("./routes/LessonRoute") },
  { path: "/s3Direct", route: require("./routes/s3UploadRoute") },
  { path: "/resources", route: require("./routes/ResourcesRoute") },
  { path: "/course", route: require("./routes/CourseRoute") },
  { path: "/notes", route: require("./routes/NotesRoute") },
  { path: "/unit", route: require("./routes/UnitRoute") },
  { path: "/auth", route: require("./routes/AuthRoute") },
  { path: "/oAuth", route: require("./routes/OAuthRoute") },
];

// CONNECTION TO DATABASE,
//========================
mongoose.set("strictQuery", false);
mongoose.connect(process.env.DATABASE_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

//CORS CONFIGURATION
//===================
const corsOptions = {
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
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
app.use(authenticateToken);

routes.forEach((route) => {
  app.use(route.path, route.route);
});

app.get("/", (req, res) => {
  res.status(200).json({ message: "Hello from warmup server." });
});

app.listen("4000", () => {
  console.log("Listening on port 4000");
});

// exports.app = functions.https.onRequest(app);
