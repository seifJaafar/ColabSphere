const { consumer } = require("../config/kafka");
const { publishAvatarEvent } = require("../config/kafkaAvatarProducer");
const { uploadAvatar } = require("../services/uploadService");
const dotenv = require("dotenv");
dotenv.config();

const startFileConsumer = async () => {
  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      try {
        const event = JSON.parse(message.value.toString());

        const { userID, buffer, filename, mimetype } = event;
        if (!userID || !buffer) {
          console.error("❌ Invalid event data");
          return;
        }

        // Convert base64 buffer back to binary
        const fileBuffer = Buffer.from(buffer, "base64");

        // Upload to Cloudinary
        const avatarUrl = await uploadAvatar(fileBuffer, userID);
        console.log("✅ Avatar uploaded:", avatarUrl);
        if (!avatarUrl) {
          console.error("❌ Error uploading avatar");
          return;
        }
        await publishAvatarEvent(userID, avatarUrl);
        console.log("🔄 Notified User Service about avatar update");
      } catch (error) {
        console.error("❌ Error processing file upload event:", error);
      }
    },
  });
};

// Add shutdown logic for consumer
const shutdownConsumer = async () => {
  try {
    console.log("🚨 Shutting down consumer...");
    await consumer.disconnect();
    console.log("✅ Consumer disconnected successfully");
  } catch (error) {
    console.error("❌ Error shutting down consumer:", error);
  }
};

module.exports = { startFileConsumer, shutdownConsumer };
