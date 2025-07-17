const express = require("express");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const router = express.Router();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    // Allow only images
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed!"), false);
    }
  },
});

// POST /api/upload
router.post("/", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // Upload to Cloudinary
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            resource_type: "image",
            folder: "shop-drive", // Organize uploads in a folder
            transformation: [
              { width: 1200, height: 800, crop: "limit" }, // Optimize image size
              { quality: "auto" }, // Auto optimize quality
              { fetch_format: "auto" }, // Auto format (WebP when supported)
            ],
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          },
        )
        .end(req.file.buffer);
    });

    res.json({
      message: "File uploaded successfully",
      url: result.secure_url,
      public_id: result.public_id,
    });
  } catch (error) {
    console.error("Error uploading file:", error);
    res.status(500).json({ message: "Failed to upload file" });
  }
});

// Error handler for multer
router.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({ message: "File too large (max 5MB)" });
    }
  }
  if (error.message === "Only image files are allowed!") {
    return res.status(400).json({ message: error.message });
  }
  next(error);
});

module.exports = router;
