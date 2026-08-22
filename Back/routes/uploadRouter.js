import express from 'express';
import upload from '../middleware/upload.js';
import { v2 as cloudinary } from 'cloudinary'; 

const uploadRouter = express.Router();

uploadRouter.post('/', upload.single('image'), async (req, res) => {
 
  try {

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Aucun fichier image fourni',
      });
    }

    let imageUrl;

    if (req.file.path && (req.file.path.startsWith('http://') || req.file.path.startsWith('https://'))) {
      imageUrl = req.file.path;
    } else {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'profile_images',
        allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp', 'tiff'],
        max_bytes: 10 * 1024 * 1024,
      });
      imageUrl = result.secure_url;
    }

    res.json({ success: true, url: imageUrl });

  } catch (error) {
    console.error('Erreur upload :', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

export default uploadRouter;