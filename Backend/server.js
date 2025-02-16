const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const ProfileRoutes=require('./routes/ProfileRouter');
const AttendanceRoutes=require('./routes/AttendanceRouter');
const cookieParser = require('cookie-parser');

const coursesAvailableRouter = require('./routes/CoursesAvailableRouter')
const CreateClassRouter = require('./routes/CreateClassRouter')
const JoinClassRouter = require('./routes/JoinClassRoute');
const marksRouter = require('./routes/MarksRouter')
const QuizRouter=require("./routes/QuizRouter")
const App = express();
const noticeRoutes = require('./routes/noticeRoutes');
const DetailsRoutes = require('./routes/DetailsRouter');
const maxMarksRoutes = require("./routes/MaxMarksRouter");


// Middleware
App.use(cors({
  origin: 'http://localhost:8081',
  credentials: true,
}
));

App.use(express.json());
App.use(cookieParser());


mongoose
    .connect("mongodb://127.0.0.1:27017/DB", {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => {
        console.log('Connected to MongoDB successfully!');
    })
    .catch((error) => {
        console.error('Error connecting to MongoDB:', error.message);
    });

const conn = mongoose.connection;
conn.on("error", (err) => console.error.bind(console, "DB connection error"));
conn.once('open', () => { console.log("Connected to DataBase.") });


App.use('/api/Users', ProfileRoutes)

App.use('/coursesAvailable', coursesAvailableRouter.router);
App.use('/createClass', CreateClassRouter);
App.use('/joinClass', JoinClassRouter);
App.use('/marks', marksRouter);
App.use('/quiz',QuizRouter);
App.use('/api/Attendance', AttendanceRoutes)
App.use("/maxmarks", maxMarksRoutes);
App.use('/api/notices', noticeRoutes);
App.use('/details',DetailsRoutes);
const GLOBAL_CONFIG=require("../components/global_config");
const PORT = 5000;
App.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});