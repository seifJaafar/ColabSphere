const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");
const dotenv = require("dotenv");
dotenv.config();
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const UploadAvatar = async (req, res) => {
  try {
    const { userID } = req.body;
    if (!userID) {
      return res.status(400).json({ message: "User ID is required" });
    }
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }
    const publicId = `${userID}-avatar`;

    // Convert buffer to stream and upload to Cloudinary
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "avatars",
        public_id: publicId,
        overwrite: true,
        resource_type: "image",
        format: "webp",
      },
      (error, result) => {
        if (error)
          return res
            .status(500)
            .json({ message: "Cloudinary upload failed", error });

        return res.status(200).json({ url: result.secure_url });
      }
    );

    streamifier.createReadStream(req.file.buffer).pipe(uploadStream);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
module.exports = {
  UploadAvatar,
};
