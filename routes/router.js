// routes/authRoutes.js
const {Router} = require("express");
const router = Router();
const authController = require('../controllers/authController');

// Home route
router.get("/", (req, res) => {
    res.render("index", { user: req.user });
});
// Render the sign-up page
router.get("/sign-up", authController.signUpGet);
// Handle the sign-up form submission
router.post("/sign-up", authController.signUpPost);
// Handle log-in form submission
router.post("/log-in", authController.logInPost);

module.exports = router;
