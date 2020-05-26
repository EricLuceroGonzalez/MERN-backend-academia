const multer = require("multer");
const { v4: uuidv4 } = require("uuid");

const MIME_TYPE_MAP = {
  "image/png": "png",
  "image/jpg": "jpg",
  "image/jpeg": "jpeg",
};

// Excecute Middleware as function that will be passed a configuration object
const fileUpload = multer({
  // Setting the multer saving
  limits: 500000,
  storage: multer.diskStorage({
    destination: (req, file, callback) => {
      callback(null, "uploads/images");
    },
    filename: (req, file, callback) => {
      // Extract the extension
      const ext = MIME_TYPE_MAP[file.mimetype];
      callback(null, uuidv4() + "." + ext);
    },
  }),
});

// We will use this in user-routes.js
module.exports = fileUpload;
