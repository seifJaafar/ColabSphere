const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");
const dotenv = require("dotenv");
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Upload avatar to Cloudinary
 * @param {Buffer} fileBuffer - The file buffer
 * @param {String} userID - The user's ID
 * @returns {Promise<String>} - The uploaded image URL
 */
const uploadAvatar = (fileBuffer, userID) => {
  return new Promise((resolve, reject) => {
    const publicId = `${userID}-avatar`;

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "avatars",
        public_id: publicId,
        overwrite: true,
        resource_type: "image",
        format: "webp",
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result.secure_url);
      }
    );

    streamifier.createReadStream(fileBuffer).pipe(uploadStream);
  });
};

module.exports = { uploadAvatar };
