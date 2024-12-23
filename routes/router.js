const { Router } = require("express");
const router = Router();
const authController = require('../controllers/authController');
const folderController = require('../controllers/folderController'); // Import folder controller

// Home route
router.get("/", (req, res) => {
    res.render("index", { user: req.user });
});

// Authentication routes
router.get("/sign-up", authController.signUpGet);
router.post("/sign-up", authController.signUpPost);
router.post("/log-in", authController.logInPost);
router.get('/log-out', authController.logOutGet);

// File upload routes
router.get('/upload', authController.uploadGet);
router.post('/upload', authController.uploadPost);

// Folder routes
router.get('/folders', folderController.getFolders); // Get all folders for the user
router.post('/folders', folderController.createFolder); // Create a new folder
router.put('/folders/:id', folderController.updateFolder); // Update folder name
router.delete('/folders/:id', folderController.deleteFolder); // Delete a folder
router.post('/folders/:id/upload', folderController.uploadToFolder); // Upload file to a specific folder
router.get('/files/:fileId', folderController.getFileDetails); // View file details


module.exports = router;
