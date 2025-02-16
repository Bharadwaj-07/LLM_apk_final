

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const ProfileRoutes = require('./Routes/ProfileRouter');
const AttendanceRoutes = require('./Routes/AttendanceRouter');
const cookieParser = require('cookie-parser');

const coursesAvailableRouter = require('./Routes/CoursesAvailableRouter');
const CreateClassRouter = require('./Routes/CreateClassRouter');
const JoinClassRouter = require('./Routes/JoinClassRoute');
const marksRouter = require('./Routes/MarksRouter');
const QuizRouter = require('./Routes/QuizRouter');
const App = express();
const noticeRoutes = require('./Routes/noticeRoutes');
const DetailsRoutes = require('./Routes/DetailsRouter');
const maxMarksRoutes = require('./Routes/MaxMarksRouter');

// Middleware


App.use(express.json());
App.use(cookieParser());


mongoose.connect(process.env.mongo_URL).then(
    () => {
        console.log('connected to database');
    }
)
    .catch((err) => {
        console.log(`Could not connect to db ` + err);
    })

// mongoose
//   .connect("mongodb://127.0.0.1:27017/DB", {
//     useNewUrlParser: true,
//     useUnifiedTopology: true
//   })
//   .then(() => {
//     console.log('Connected to MongoDB successfully!');
//   })
//   .catch((error) => {
//     console.error('Error connecting to MongoDB:', error.message);
//   });

const conn = mongoose.connection;
conn.on("error", (err) => console.error.bind(console, "DB connection error"));
conn.once('open', () => { console.log("Connected to DataBase.") });

App.use('/api/Users', ProfileRoutes);
App.use('/coursesAvailable', coursesAvailableRouter.router);
App.use('/createClass', CreateClassRouter);
App.use('/joinClass', JoinClassRouter);
App.use('/marks', marksRouter);
App.use('/quiz', QuizRouter);
App.use('/api/Attendance', AttendanceRoutes);
App.use("/maxmarks", maxMarksRoutes);
App.use('/api/notices', noticeRoutes);
App.use('/details', DetailsRoutes);
mongo_URL="mongodb+srv://eswarsaipashavula:pass@cluster0.uybc8.mongodb.net/db?retryWrites=true&w=majority&appName=Cluster0"

const PORT = process.env.PORT || 5000;
App.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
