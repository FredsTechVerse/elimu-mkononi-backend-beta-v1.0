const functions = require("firebase-functions");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { authenticateToken } = require("./controllers/Authorization");
const app = express();
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const routes = [
  { path: "/chapter", route: require("./routes/ChapterRoute") },
  { path: "/message", route: require("./routes/MessageRoute") },
  { path: "/email", route: require("./routes/EmailRoute") },
  { path: "/lesson", route: require("./routes/LessonRoute") },
  { path: "/video", route: require("./routes/VideoRoute") },
  { path: "/file", route: require("./routes/fileHandlerRoute") },
  { path: "/resources", route: require("./routes/ResourcesRoute") },
  { path: "/course", route: require("./routes/CourseRoute") },
  { path: "/notes", route: require("./routes/NotesRoute") },
  { path: "/unit", route: require("./routes/UnitRoute") },
  { path: "/auth", route: require("./routes/AuthRoute") },
  { path: "/student", route: require("./routes/StudentRoute") },
  { path: "/tutor", route: require("./routes/TutorRoute") },
  { path: "/viewer", route: require("./routes/ViewerRoute") },
  { path: "/admin-viewer", route: require("./routes/AdminViewerRoute") },
  { path: "/admin", route: require("./routes/AdminRoute") },
  { path: "/oAuth", route: require("./routes/OAuthRoute") },
];

// CONNECTION TO DATABASE,
//========================
mongoose.set("strictQuery", false);
mongoose
  .connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to the database");
  });

// CONECTION TEST
//================
const db = mongoose.connection;

db.on("error", function (err) {
  console.error("Database error:", err);
});

process.on("SIGINT", async () => {
  try {
    await mongoose.connection.close();
    process.exit(0);
  } catch (err) {
    process.exit(1);
  }
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
app.use(cors(corsOptions));
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
// app.use(authenticateToken);

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
