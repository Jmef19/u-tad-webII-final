const path = require("path");
const fs = require("fs");
const { ValidationError } = require("../../domain/errors");

const UPLOAD_DIR = path.join(
  __dirname,
  "../../resources/uploads/profile_pictures"
);

// Ensure the upload folder exists
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

const uploadService = {
  async saveProfilePicture(file) {
    if (!file || typeof file !== "object") {
      throw new ValidationError("No file provided for upload.");
    }

    const ext = path.extname(file.name);
    const validExtensions = [".jpg", ".jpeg", ".png", ".webp"];
    if (!validExtensions.includes(ext.toLowerCase())) {
      throw new ValidationError("Unsupported file type.");
    }

    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      throw new ValidationError("File size exceeds the limit of 5MB.");
    }

    const fileName = `${Date.now()}-${Math.random()
      .toString(36)
      .substring(2)}${ext}`;
    const filePath = path.join(UPLOAD_DIR, fileName);

    try {
      await file.mv(filePath); // Provided by express-fileupload

      return {
        path: `${UPLOAD_DIR}/${fileName}`,
        mimetype: file.mimetype,
        size: file.size,
      };
    } catch (err) {
      throw new ValidationError("Failed to save uploaded file.");
    }
  },
};

module.exports = uploadService;
