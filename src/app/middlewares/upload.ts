import multer from 'multer';
import AppError from '../utils/AppError';

const storage = multer.memoryStorage();

const allowedMimeTypes = new Set(['image/jpeg', 'image/png', 'image/webp', 'application/pdf']);

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (!allowedMimeTypes.has(file.mimetype)) {
      return cb(new AppError(400, 'Only JPEG, PNG, WEBP, or PDF files are allowed'));
    }
    cb(null, true);
  },
});

export default upload;
