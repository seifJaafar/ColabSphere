const { createClient } = require("redis");

const client = createClient({
  username: "default",
  password: "OGFUCVnsPHMvXXOl7frzGnI1H2CdNPnO",
  socket: {
    host: "redis-13028.c339.eu-west-3-1.ec2.redns.redis-cloud.com",
    port: 13028,
  },
});

client.on("error", (err) => console.log("Redis Client Error", err));

(async () => {
  try {
    await client.connect();
    console.log("✅ Redis connected successfully!");
  } catch (error) {
    console.error("❌ Redis connection failed:", error);
  }
})();

module.exports = client;
