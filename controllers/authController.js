// controllers/authController.js
const bcrypt = require('bcryptjs');
const passport = require("passport");
const pool = require('../db/pool');


const signUpGet = (req, res) => {
    res.render('sign-up-form'); // sign up page goes here
};

const signUpPost = (req, res, next) => {
    // using bcrypt to hash the password
    bcrypt.hash(req.body.password, 10, async (err, hashedPassword) => {
        if (err) {
            return next(err);
        }
        try {
            await pool.query("INSERT INTO users (username, password) VALUES ($1, $2)", [
                req.body.username,
                hashedPassword
            ]);
            res.redirect("/");
        } catch (err) {
            return next(err);
        }
    });
};

const logInPost = passport.authenticate("local", { // checks the local strategy in passport.js 
    successRedirect: "/",
    failureRedirect: "/"
});








module.exports = {
    signUpGet,
    signUpPost,
    logInPost
};
