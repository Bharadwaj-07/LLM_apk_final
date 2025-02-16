// const cors = require("cors");
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
// 🔹 Load .env variables

const ProfileRoutes = require("./Routes/ProfileRouter");
const AttendanceRoutes = require("./Routes/AttendanceRouter");
const coursesAvailableRouter = require("./Routes/CoursesAvailableRouter");
const CreateClassRouter = require("./Routes/CreateClassRouter");
const JoinClassRouter = require("./Routes/JoinClassRoute");
const marksRouter = require("./Routes/MarksRouter");
const QuizRouter = require("./Routes/QuizRouter");
const noticeRoutes = require("./Routes/noticeRoutes");
const DetailsRoutes = require("./Routes/DetailsRouter");
const maxMarksRoutes = require("./Routes/MaxMarksRouter");

const App = express();

// ✅ Middleware
App.use(express.json());
App.use(cookieParser());
const cors = require("cors");

App.use(cors({
  origin: "http://localhost:8081",  // Allow frontend origin
  methods: "GET, POST, PUT, DELETE, OPTIONS",
  allowedHeaders: "Content-Type, Authorization",
  credentials: true
}));





const mongoURL ="mongodb+srv://eswarsaipashavula:pass@cluster0.uybc8.mongodb.net/db?retryWrites=true&w=majority&appName=Cluster0";

mongoose
  .connect(mongoURL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("✅ Connected to MongoDB successfully!");
  })
  .catch((err) => {
    console.error("❌ Could not connect to MongoDB:", err.message);
  });

const conn = mongoose.connection;
conn.on("error", (err) => console.error("DB connection error:", err));
conn.once("open", () => console.log("✅ Connected to Database."));

// ✅ Routes
App.use("/api/Users", ProfileRoutes);
App.use("/coursesAvailable", coursesAvailableRouter.router);
App.use("/createClass", CreateClassRouter);
App.use("/joinClass", JoinClassRouter);
App.use("/marks", marksRouter);
App.use("/quiz", QuizRouter);
App.use("/api/Attendance", AttendanceRoutes);
App.use("/maxmarks", maxMarksRoutes);
App.use("/api/notices", noticeRoutes);
App.use("/details", DetailsRoutes);

// ✅ Server Port
const PORT = process.env.PORT || 5000;
App.listen(PORT, () => {
  console.log(`🚀 Server running on https://localhost:${PORT}`);
});