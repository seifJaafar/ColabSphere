const { Kafka } = require("kafkajs");
const db = require("../models/index");
const { Team } = db;
const dotenv = require("dotenv");
dotenv.config();

// Initialize Kafka client configuration
const kafka = new Kafka({
  clientId: "project-service", // Unique client ID for the project service
  brokers: ["localhost:9092"], // List of Kafka brokers, adjust as needed
});

// Create a Kafka consumer
const consumer = kafka.consumer({ groupId: "project-service-group" });

// Function to consume messages from Kafka and insert into team table
const consumeTeamServiceTopic = async () => {
  await consumer.connect();
  await consumer.subscribe({
    topic: "team-service-topic", // Topic where user public data is sent
    fromBeginning: false,
  });
  await consumer.subscribe({
    topic: "team-service-invite-members", // Topic where user public data is sent
    fromBeginning: false,
  });
  await consumer.subscribe({
    topic: "google-data-topic",
    fromBeginning: false,
  });
  await consumer.subscribe({
    topic: "user-service-avatar-updated",
    fromBeginning: false,
  });
  await consumer.run({
    eachMessage: async ({ topic, message }) => {
      try {
        if (topic === "team-service-topic") {
          const {
            userId,
            projectId,
            email,
            username,
            avatar,
            roles,
            googleAccessToken,
            githubAccessToken,
          } = JSON.parse(message.value.toString());

          // Check if the entry already exists in the team table for the user and project
          const existingTeamMember = await Team.findOne({
            where: { userId, projectId },
            attributes: { exclude: ["id"] },
          });

          if (existingTeamMember) {
            console.log(
              `❌ Team member already exists for user ${userId} and project ${projectId}`
            );
            return;
          }

          // Create a new team entry
          const newTeamMember = {
            userId,
            projectId,
            email,
            username,
            avatar,
            roles: roles && roles.length > 0 ? roles : ["member"], // Default role, modify if necessary
            createdAt: new Date(),
            updatedAt: new Date(),
            googleaccesstoken: googleAccessToken || null,
            githubaccesstoken: githubAccessToken || null,
          };

          await Team.create(newTeamMember);

          console.log(`✅ Added new team member to project ${projectId}:`);
          const producer = kafka.producer();
          await producer.connect();
          await producer.send({
            topic: "user-joined-project",
            messages: [
              {
                value: JSON.stringify({
                  userID: newTeamMember.userId,
                  projectID: newTeamMember.projectId,
                  username: newTeamMember.username,
                  avatar: newTeamMember.avatar,
                }),
              },
            ],
          });
          console.log(
            `✅ Sent user public data to messaging service for project ${projectId}`
          );
          await producer.disconnect();
        }
        if (topic === "team-service-invite-members") {
          const { valid, invalid, projectId } = JSON.parse(
            message.value.toString()
          );
          for (let validUser of valid) {
            const member = await Team.findOne({
              where: { userId: validUser.id, projectId: projectId },
            });

            if (!member) {
              const { email, username, avatar } = validUser;
              const newTeamMember = {
                userId: validUser.id,
                projectId: projectId,
                email,
                username,
                avatar,
                roles: ["member"],
                createdAt: new Date(),
                updatedAt: new Date(),
              };
              await Team.create(newTeamMember);
              console.log(
                `✅ Added new team member to project ${validUser.projectId}:`,
                newTeamMember
              );
            }
          }
          const producer = kafka.producer();
          await producer.connect();
          await producer.send({
            topic: "user-invited-to-project",
            messages: [
              {
                value: JSON.stringify({
                  validUsers: valid,
                  projectId: projectId,
                }),
              },
            ],
          });
        }
        if (topic === "user-service-avatar-updated") {
          const { userId, avatarUrl } = JSON.parse(message.value.toString());
          const teamMember = await Team.findAll({
            where: { userId: userId },
          });
          if (teamMember) {
            for (const member of teamMember) {
              member.avatar = avatarUrl;
              await member.save();
              console.log(
                `✅ Updated avatar for team member ${userId} in project ${member.projectId}`
              );
            }
          } else {
            console.log(`❌ Team member not found for user ${userId}`);
          }
        }
        if (topic === "google-data-topic") {
          const { token, id, refreshToken } = JSON.parse(
            message.value.toString()
          );

          // Sequelize uses findAll with `where` clause
          const teamMembers = await Team.findAll({
            where: { userId: id },
          });

          for (const member of teamMembers) {
            if (member) {
              member.googleaccesstoken = token;
              member.googlerefreshtoken = refreshToken;
              await member.save();
              console.log(
                `✅ Updated Google access token for team member ${id}`
              );
            } else {
              console.log(`❌ Team member not found for user ${id}`);
            }
          }
        }
      } catch (error) {
        console.error(
          "❌ Error processing Kafka message in Project Service:",
          error
        );
      }
    },
  });
};

// Start consuming messages

// Graceful shutdown
const shutdownGracefully = async () => {
  console.log("❌ Shutting down gracefully...");

  try {
    // Disconnect from Kafka consumer
    await consumer.disconnect();
    console.log("✅ Kafka consumer disconnected.");
  } catch (error) {
    console.error("Error during shutdown:", error);
    process.exit(1); // Exit with error if something goes wrong
  }
};

// Handle termination signals for graceful shutdown
process.on("SIGINT", shutdownGracefully); // Ctrl+C
process.on("SIGTERM", shutdownGracefully); // Termination signal (e.g., from Docker or cloud environments)

// Export consumeTeamServiceTopic to be used elsewhere
module.exports = { consumeTeamServiceTopic };
