const requiredEnvs = [
  "ACCESS_TOKEN_SECRET",
  "REFRESH_TOKEN_SECRET",
  "USERS_SERVICE",
  "PROJECTS_SERVICE",
  "MESSAGES_SERVICE",
  "NOTIFS_SERVICE",
  "FILES_SERVICE",
  "CLIENT_URL",
];

requiredEnvs.forEach((env) => {
  if (!process.env[env]) {
    console.error(`❌ Missing environment variable: ${env}`);
    process.exit(1);
  }
});

export const services = {
  users: process.env.USERS_SERVICE,
  projects: process.env.PROJECTS_SERVICE,
  messages: process.env.MESSAGES_SERVICE,
  notifs: process.env.NOTIFS_SERVICE,
  files: process.env.FILES_SERVICE,
};
