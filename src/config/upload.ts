import path from 'path';
import crypto from 'crypto';
import multer from 'multer';

const tempDir = path.resolve(__dirname, '..', '..', 'tmp');

export default {
  tmpFolder: tempDir,
  uploadFolder: path.resolve(tempDir, 'upload'),
  storage: multer.diskStorage({
    destination: tempDir,
    filename(request, file, callback) {
      const fileHash = crypto.randomBytes(10).toString('hex');
      const fileName = `${fileHash}-${file.originalname}`;

      return callback(null, fileName);
    },
  }),
};
