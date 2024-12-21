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
    upload.single('file'),
    async (req, res) => {
        if (!req.user) {
            return res.redirect('/');
        }

        if (!req.file) {
            return res.status(400).send("No file uploaded.");
        }

        try {
            await prisma.file.create({
                data: {
                    filename: req.file.filename,
                    filepath: `/uploads/${req.file.filename}`,
                    userId: req.user.id,
                    folderId: parseInt(req.params.id),
                },
            });

            res.redirect('/folders');
        } catch (error) {
            console.error("Error uploading file to folder:", error);
            res.status(500).send("Error uploading file to folder.");
        }
    },
];

module.exports = {
    getFolders,
    createFolder,
    updateFolder,
    deleteFolder,
    uploadToFolder,
};
