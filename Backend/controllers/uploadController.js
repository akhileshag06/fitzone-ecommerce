const path = require('path');
const fs = require('fs');

// ============ UPLOAD IMAGE ============
exports.uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please upload an image file' 
      });
    }

    // Return the URL of the uploaded image (same format as existing images)
    const imageUrl = `http://localhost:5000/images/${req.file.filename}`;
    
    res.json({
      success: true,
      imageUrl,
      filename: req.file.filename,
      message: 'Image uploaded successfully'
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// ============ GET ALL IMAGES (from Backend/public/images) ============
exports.getUploadedImages = async (req, res) => {
  try {
    const imagesDir = path.join(__dirname, '../public/images');
    
    // Create images directory if it doesn't exist
    if (!fs.existsSync(imagesDir)) {
      fs.mkdirSync(imagesDir, { recursive: true });
    }

    const files = fs.readdirSync(imagesDir);
    const images = files
      .filter(file => /\.(jpg|jpeg|png|gif|webp)$/i.test(file))
      .map(file => ({
        filename: file,
        url: `http://localhost:5000/images/${file}`,
        uploadedAt: fs.statSync(path.join(imagesDir, file)).mtime
      }))
      .sort((a, b) => b.uploadedAt - a.uploadedAt);

    res.json({
      success: true,
      images
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// ============ DELETE IMAGE ============
exports.deleteImage = async (req, res) => {
  try {
    const { filename } = req.params;
    const filePath = path.join(__dirname, '../public/images', filename);

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      res.json({
        success: true,
        message: 'Image deleted successfully'
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'Image not found'
      });
    }
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};
