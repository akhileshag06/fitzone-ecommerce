const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const { protect, adminOrDealer } = require('../middleware/auth');
const { uploadImage, getUploadedImages, deleteImage } = require('../controllers/uploadController');

// All routes require authentication (admin or dealer)
router.use(protect, adminOrDealer);

// Upload single image
router.post('/', upload.single('image'), uploadImage);

// Get all uploaded images
router.get('/', getUploadedImages);

// Delete image
router.delete('/:filename', deleteImage);

module.exports = router;
