const { google } = require("googleapis");
const db = require("../models/index");
const { Team } = db;

class DriveController {
  async initializeClient(accessToken, userId, refreshtoken) {
    try {
      const auth = new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET
      );

      auth.setCredentials({ access_token: accessToken });

      try {
        // First try to use the current access token
        await auth.getTokenInfo(accessToken);
      } catch (tokenError) {
        console.log("Access token invalid, attempting to refresh...");
        try {
          const { credentials } = await auth.refreshToken(refreshtoken);
          auth.setCredentials(credentials);
          accessToken = credentials.access_token;

          // Update the new access token in database
          if (userId) {
            await Team.update(
              { googleaccesstoken: accessToken },
              { where: { userId } }
            );
            console.log("Google access token updated in database");
          }
        } catch (refreshError) {
          console.error("Refresh failed:", refreshError);
          throw new Error(
            "Session expired. Please re-authenticate with Google."
          );
        }
      }

      return {
        drive: google.drive({
          version: "v3",
          auth,
          params: {
            supportsAllDrives: true,
            includeItemsFromAllDrives: true,
          },
        }),
        accessToken,
      };
    } catch (err) {
      console.error("Error initializing Google Drive client:", err);
      throw new Error("Failed to initialize Drive client: " + err.message);
    }
  }

  async listTopLevelFolders(accessToken, userId, refreshToken) {
    try {
      const { drive, accessToken: newAccessToken } =
        await this.initializeClient(accessToken, userId, refreshToken);
      let allFolders = [];
      let pageToken;

      do {
        const res = await drive.files.list({
          q: "mimeType='application/vnd.google-apps.folder' and trashed=false and 'root' in parents",
          fields: "files(id, name, webViewLink)",
          pageSize: 100,
          pageToken,
        });

        allFolders = allFolders.concat(res.data.files);
        pageToken = res.data.nextPageToken;
      } while (pageToken);

      return allFolders || [];
    } catch (err) {
      console.error(
        "Error listing folders:",
        err.response?.data || err.message
      );
      throw new Error("Failed to list folders: " + err.message);
    }
  }

  async setPublicSharing(accessToken, fileId, userId, refreshtoken) {
    try {
      const { drive, accessToken: newAccessToken } =
        await this.initializeClient(accessToken, userId, refreshtoken);

      await drive.permissions.create({
        fileId,
        requestBody: {
          role: "reader",
          type: "anyone",
          allowFileDiscovery: false,
        },
        fields: "id",
      });

      const file = await drive.files.get({
        fileId,
        fields: "webViewLink,webContentLink,permissions",
      });

      return {
        embedUrl: `https://drive.google.com/embeddedfolderview?id=${fileId}#grid`,
        directLink: file.data.webViewLink,
        permissions: file.data.permissions,
        accessToken: newAccessToken,
      };
    } catch (err) {
      console.error("Error sharing file:", err.response?.data || err.message);
      throw new Error("Failed to share file: " + err.message);
    }
  }
}

module.exports = new DriveController();
