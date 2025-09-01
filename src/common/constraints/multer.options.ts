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
      fileSize: 1024 * 1024 * 10, // 10MB
    },
    fileFilter: (_, file, callback) => {
      if (imagesAcceptedTypes.includes(file.mimetype)) {
        callback(null, true);
      } else {
        callback(null, false);
      }
    },
  },
  documents: {
    limits: {
      fileSize: 1024 * 1024 * 20, // MB
    },
    fileFilter: (_, file, callback) => {
      if (documentsAcceptedTypes.includes(file.mimetype)) {
        callback(null, true);
      } else {
        callback(null, false);
      }
    },
  },
};
