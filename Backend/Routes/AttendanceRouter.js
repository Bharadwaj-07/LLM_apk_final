const express = require("express")
const { getDates,getUsers,getAttendance,SetAttendance,checkAdmin,UserAttendance} = require('../Controller/AttendanceController');
const { set } = require("mongoose");
const router = express.Router()
function AuthenticateToken(req, res, next) {
    const token = req.headers['authorization'];
    console.log("token authentication", token);
    let Token = token.split(' ')[1];
    if (token == null) return res.sendStatus(401);
    uname = req.uname;
    console.log(uname);
    jwt.verify(Token, process.env.ACCESS_TOKEN_SECRET, (err, uname) => {
        if (err) {
            console.log("token failed");
            return res.status(401).json({ uname: uname });
        }
        console.log("token verified");
        req.uname = uname;
        next();
    });
}
jwt = require('jsonwebtoken');
router.post("/dates", getDates);
router.post("/students", getUsers);
router.get("/attendance", getAttendance);
router.post("/Admin",checkAdmin);
router.post("/attendance",SetAttendance);
router.post("/UserAttendance",UserAttendance);
module.exports = router