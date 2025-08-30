const acceptedTypes = [
  'image/jpeg',
  'image/png',
  'image/svg+xml',
  'image/x-icon',
];
export const multerValidations = {
  limits: {
    fileSize: 1024 * 1024 * 5, // 5MB
  },
  fileFilter: (_, file, callback) => {
    if (acceptedTypes.includes(file.mimetype)) {
      callback(null, true);
    } else {
      callback(null, false);
    }
  },
};
