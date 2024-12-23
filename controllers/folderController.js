const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const multer = require("multer");
const path = require("path");

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Set the folder for file storage
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
  }
});

// Remove the redundant 'upload' declaration
const upload = multer({ storage: storage });

// Get all folders for the user
const getFolders = async (req, res) => {
    if (!req.user) {
        return res.redirect('/');
    }

    try {
        const folders = await prisma.folder.findMany({
            where: { userId: req.user.id },
            include: { files: true },
        });

        res.render('folders', { folders });
    } catch (error) {
        console.error("Error fetching folders:", error);
        res.status(500).send("Error fetching folders.");
    }
};

// Create a new folder
const createFolder = async (req, res) => {
    if (!req.user) {
        return res.redirect('/');
    }

    try {
        const folder = await prisma.folder.create({
            data: {
                name: req.body.name,
                userId: req.user.id,
            },
        });

        res.redirect('/folders');
    } catch (error) {
        console.error("Error creating folder:", error);
        res.status(500).send("Error creating folder.");
    }
};

// Update folder name
const updateFolder = async (req, res) => {
    if (!req.user) {
        return res.redirect('/');
    }

    try {
        await prisma.folder.update({
            where: { id: parseInt(req.params.id) },
            data: { name: req.body.name },
        });

        res.redirect('/folders');
    } catch (error) {
        console.error("Error updating folder:", error);
        res.status(500).send("Error updating folder.");
    }
};

// Delete a folder
const deleteFolder = async (req, res) => {
    if (!req.user) {
        return res.redirect('/');
    }

    try {
        await prisma.folder.delete({
            where: { id: parseInt(req.params.id) },
        });

        res.redirect('/folders');
    } catch (error) {
        console.error("Error deleting folder:", error);
        res.status(500).send("Error deleting folder.");
    }
};

// Upload a file to a specific folder
const uploadToFolder = [
    upload.single("file"), // Handle single file uploads
    async (req, res) => {
      if (!req.user) {
        return res.redirect("/");
      }
  
      if (!req.file) {
        return res.status(400).send("No file uploaded.");
      }
  
      try {
        // Save file details in the database
        const fileRecord = await prisma.file.create({
          data: {
            filename: req.file.originalname,
            url: req.file.path, // Local file path
            userId: req.user.id,
            folderId: parseInt(req.params.id),
          },
        });
  
        res.redirect(`/folders/${req.params.id}`);
      } catch (error) {
        console.error("Error uploading file:", error);
        res.status(500).send("Error uploading file.");
      }
    },
];

// Get file details
const getFileDetails = async (req, res) => {
    if (!req.user) {
        return res.redirect('/');
    }

    try {
        const file = await prisma.file.findUnique({
            where: { id: parseInt(req.params.fileId) },
        });

        if (!file) {
            return res.status(404).send("File not found.");
        }

        res.render('fileDetails', { file });
    } catch (error) {
        console.error("Error fetching file details:", error);
        res.status(500).send("Error fetching file details.");
    }
};

module.exports = {
    getFolders,
    createFolder,
    updateFolder,
    deleteFolder,
    uploadToFolder,
    getFileDetails,
};
