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
  { path: "/lesson", route: require("./routes/LessonRoute") },
  { path: "/file", route: require("./routes/fileHandlerRoute") },
  { path: "/resources", route: require("./routes/ResourcesRoute") },
  { path: "/course", route: require("./routes/CourseRoute") },
  { path: "/notes", route: require("./routes/NotesRoute") },
  { path: "/unit", route: require("./routes/UnitRoute") },
  { path: "/auth", route: require("./routes/AuthRoute") },
  { path: "/student", route: require("./routes/StudentRoute") },
  { path: "/tutor", route: require("./routes/TutorRoute") },
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
  })
  .catch((err) => {
    console.error("Error connecting to the database:", err);
  });

// CONECTION TEST
//================
const db = mongoose.connection;

db.on("disconnected", function () {
  console.log("Server disconnected from the database");
  // Handle reconnection logic here if needed
});

db.on("close", function () {
  console.log("Server connection to the database closed");
  // Implement any additional cleanup or graceful shutdown logic here
});

db.on("error", function (err) {
  console.error("Database error:", err);
  // Handle the error appropriately, such as logging, reconnecting, etc.
  if (err.code === "ESERVFAIL") {
    // Handle specific error case
  } else {
    // Handle other error cases
  }
});

// Implement graceful shutdown logic (Basically when we kill server via ctrl+c)
process.on("SIGINT", async () => {
  try {
    await mongoose.connection.close();
    console.log("Database connection closed through app termination");
    process.exit(0);
  } catch (err) {
    console.error("Error while closing database connection:", err);
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
