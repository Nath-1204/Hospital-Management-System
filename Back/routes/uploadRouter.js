import express from 'express';
import upload from '../middleware/upload.js';
import cloudinary from '../configs/cloudinary.js';


const uploadRouter = express.Router();

uploadRouter.post('/', upload.single('image'), async (req, res) => {

  try {

    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'profile_images',
    });

    res.json({ success: true, url: result.secure_url });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default uploadRouter;