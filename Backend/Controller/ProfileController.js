const res = require("express/lib/response")
const jwt = require("jsonwebtoken");
const Persons = require("../models/Profile");
const LoginDetails = require("../models/LoginDetails");
const RefreshToken = require("../models/RefreshToken");
mongoose = require("mongoose");
require('dotenv').config();

exports.availability = async (req, res) => {

    let Name = req.body.Name;
    console.log("Name", Name);
    const fieldName = req.body.fieldName;
    console.log(req.body);
    console.log(Name, fieldName);
    Name = Name.toLowerCase();
    try {
        // const Person = await Persons.findOne({ fieldName:Uname });
        const Person = await Persons.findOne({ [fieldName]: Name });
        console.log(Person);
        console.log(fieldName, Name);
        if (Person) {
            return res.json({ available: false });
        }
        return res.json({ available: true });
    }
    catch (e) {

        console.log(e);
    }
}
exports.login = async (req, res) => {
    let { uname: Uname, passwd: password } = req.body;
    Uname = Uname.toLowerCase();
    try {
        const Person = await LoginDetails.findOne({ "Username": Uname });
        console.log("preson", Person);
        if (Person) {

            if (Person.Password === password) {
                const accessToken = jwt.sign({ Uname },
                    process.env.ACCESS_TOKEN_SECRET,
                    { expiresIn: '10s' });
                const refreshToken = jwt.sign({ Uname }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '1d' });
                const tokenEntry = new RefreshToken({
                    token: refreshToken,
                    userId: Uname,
                    expiresAt: new Date(Date.now() + 86400000)
                });
                await tokenEntry.save();

                return res.status(200)
                    .json({
                        accessToken,
                        refreshToken,
                        message: 'Login Successful',
                        verified: true,
                    });
            }
            else {
                return res.json({ verified: false });
            }
        }
        return res.json({ verified: false });
    }
    catch (e) {
        console.log(e);
        return res.json({ verified: false });

    }
}

exports.store = async (req, res) => {
    console.log("Request received:", req.body);
    let { Uname, password, Number, email, Age, College, Name, DOB } = req.body;

    Uname = Uname.toLowerCase();
    email = email.toLowerCase();
    College = College.toLowerCase();
    const User = new Persons({
        uname: Uname,
        number: Number,
        email: email,
        age: Age,
        college: College,
        name: Name,
        DOB: DOB,
    });
    const Login = new LoginDetails({
        Username: Uname,
        Password: password,
    });
    console.log("login details:", Login);

    try {
        console.log("Attempting to save user:", User);
        await User.save();
        console.log("User saved successfully");
        console.log("Attempting to save user:", Login);
        await Login.save();
        console.log("Login details saved successfully");
        res.status(200).send({ message: "User details saved successfully" });
    } catch (error) {
        console.error("Error saving user:", error);
        res.status(500).send({ message: "Error saving user details", error: error.message });
    }
}
exports.getCourses = async (req, res) => {
    // console.log(res);
    try {
        console.log("Username", req.Uname);
        const courses = await Persons.findOne({ uname: req.uname.Uname });
        console.log("Courses", courses);
        res.status(200).send(courses.courses);
    }
    catch (e) {
        console.log("error at courses", e);
        res.status(500).send({ message: "Error fetching courses", error: e.message });
    }
}
exports.logout = async (req, res) => {
    const { refreshToken } = req.body;
    if (!refreshToken) {
        return res.status(400).json({ message: "Logout" });
    }
    try {
        await RefreshToken.deleteOne({ token: refreshToken });
        res.status(200).json({ message: "Logout Successful" });
    }
    catch (e) {
        console.log(e);
        res.status(500).json({ message: "Error logging out", error: e.message });
    }
}
exports.refresh = async (req, res) => {

    const user = req.body.uname;
    const refreshToken = req.body.refreshToken;
    console.log("User refresh:", user);
    console.log("Refresh Token:", refreshToken);
    if (!refreshToken) {
        return res.status(400).json('Refresh Token is required');

    }
    if (!await RefreshToken.findOne({ token: refreshToken })) {
        return res.status(403).json('Invalid Refresh Token');
    }

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json('Invalid Refresh Token');
        }
        const generateAccessToken = (user) => {
            return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);
        };
        // After successful verification, generate a new access token
        const accessToken = generateAccessToken(user);
        return res.json({ accessToken });
    });
}