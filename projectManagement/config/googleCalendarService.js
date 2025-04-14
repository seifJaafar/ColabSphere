const { google } = require("googleapis");
const db = require("../models/index");
const { Team } = db;

class CalendarController {
  // Initialize Google Calendar client (with token refresh)
  async initializeClient(accessToken, userId, refreshtoken) {
    const auth = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET
    );
    auth.setCredentials({ access_token: accessToken });

    try {
      // Verify/refresh token
      await auth.getTokenInfo(accessToken);
    } catch (tokenError) {
      const { credentials } = await auth.refreshToken(refreshtoken);
      auth.setCredentials(credentials);
      accessToken = credentials.access_token;
      if (userId) {
        await Team.update(
          { googleaccesstoken: accessToken },
          { where: { userId } }
        );
      }
    }

    return {
      calendar: google.calendar({ version: "v3", auth }),
      accessToken,
    };
  }

  // List all calendars (for the project manager to choose)
  async listCalendars(accessToken, userId, refreshtoken) {
    const { calendar, accessToken: newAccessToken } =
      await this.initializeClient(accessToken, userId, refreshtoken);
    const res = await calendar.calendarList.list();
    return {
      calendars: res.data.items.map((cal) => ({
        id: cal.id,
        name: cal.summary,
        isPublic: cal.accessRole === "reader" && cal.public,
      })),
      accessToken: newAccessToken,
    };
  }

  // Make a calendar public (anyone with link can view)
  async setPublicSharing(accessToken, userId, calendarId, refreshtoken) {
    const { calendar, accessToken: newAccessToken } =
      await this.initializeClient(accessToken, userId, refreshtoken);

    // Step 1: Update calendar ACL (Access Control List)
    await calendar.acl.insert({
      calendarId,
      requestBody: {
        role: "reader", // "reader" = view-only
        scope: {
          type: "default", // Makes calendar accessible to anyone with link
        },
      },
    });

    // Step 2: Enable public sharing
    await calendar.calendars.update({
      calendarId,
      requestBody: {
        summary: "Team Calendar (Public)",
        description: "Shared with the team",
        // Force public visibility
        conferenceProperties: {
          allowedConferenceSolutionTypes: ["hangoutsMeet"],
        },
      },
    });

    return {
      embedUrl: `https://calendar.google.com/calendar/embed?src=${calendarId}`,
      accessToken: newAccessToken,
    };
  }
}

module.exports = new CalendarController();
