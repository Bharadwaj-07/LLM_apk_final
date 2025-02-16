const express = require("express")
const { availability, login, store, getCourses, logout, refresh } = require('../Controller/ProfileController')
const router = express.Router()
jwt = require('jsonwebtoken');
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
router.post("/check", availability);
router.post("/login", login);
router.post("/store", store);
router.post("/getCourses", AuthenticateToken, getCourses);
router.post("/logout", logout);
router.post("/refresh", refresh);
module.exports = router