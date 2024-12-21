const bcrypt = require('bcryptjs');
const passport = require("passport");
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const path = require('path');
const multer = require("multer");

// Set storage engine for Multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/"); // Set the folder where files should be stored
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
    }
});

// Initialize Multer with storage options
const upload = multer({ storage: storage });

const signUpGet = (req, res) => {
    res.render('sign-up-form'); // sign up page goes here
};

const signUpPost = async (req, res, next) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        await prisma.user.create({
            data: {
                username: req.body.username,
                password: hashedPassword,
            },
        });
        res.redirect('/');
    } catch (err) {
        return next(err);
    }
};

const logInPost = passport.authenticate("local", { 
    successRedirect: "/",
    failureRedirect: "/"
});

const logOutGet = (req, res) => {
    req.logout((err) => {
        if(err) {
            return next(err);
        }
        res.render('log-out');
    }); // passport method to clear users session data
};

const uploadGet = async (req, res) => {
    if (!req.user) {
        return res.redirect('/'); // Redirect to login if user is not authenticated
    }

    try {
        // Fetch files uploaded by the authenticated user
        const userFiles = await prisma.file.findMany({
            where: { userId: req.user.id }, // Get files for the current authenticated user
            orderBy: { createdAt: 'desc' }, // Order files by most recent
        });

        res.render('upload', { userFiles }); // Pass files to the view
    } catch (error) {
        console.error("Error fetching files from database:", error);
        res.status(500).send("Error fetching files.");
    }
};


// Multer middleware to handle file upload
const uploadFile = upload.single('file'); // Expect a single file with the name 'file'

// Handle POST request after the file is uploaded
const uploadPost = async (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }

    if (!req.user) {
        return res.status(401).send('Unauthorized. Please log in.');
    }

    try {
        // Save file info in the database
        await prisma.file.create({
            data: {
                filename: req.file.filename,
                path: req.file.path,
                userId: req.user.id, // Store the reference to the authenticated user
            }
        });

        console.log(`File uploaded: ${req.file.filename}`);
        res.redirect('/upload');
    } catch (error) {
        console.error("Error saving file to the database:", error);
        res.status(500).send("Error saving file to the database.");
    }
};

module.exports = {
    signUpGet,
    signUpPost,
    logInPost,
    logOutGet,
    uploadGet,
    uploadPost,
    uploadFile,
};
