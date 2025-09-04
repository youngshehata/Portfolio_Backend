import { HttpException } from '@nestjs/common';

const imagesAcceptedTypes = [
  'image/jpeg',
  'image/png',
  'image/svg+xml',
  'image/x-icon',
];

const documentsAcceptedTypes = ['application/pdf'];

export const multerValidations = {
  images: {
    limits: {
      fileSize: 1024 * 1024 * (Number(process.env.IMAGES_MAX_SIZE_MB) || 10), // 10MB default
    },
    fileFilter: (_, file, callback) => {
      if (imagesAcceptedTypes.includes(file.mimetype)) {
        callback(null, true);
      } else {
        callback(new HttpException('Invalid file type', 400), false);
      }
    },
  },
  documents: {
    limits: {
      fileSize: 1024 * 1024 * (Number(process.env.DOCUMENTS_MAX_SIZE_MB) || 20), // 20MB default
    },
    fileFilter: (_, file, callback) => {
      if (documentsAcceptedTypes.includes(file.mimetype)) {
        callback(null, true);
      } else {
        callback(new HttpException('Invalid file type', 400), false);
      }
    },
  },
};
