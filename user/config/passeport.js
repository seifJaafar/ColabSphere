const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const GitHubStrategy = require("passport-github2").Strategy;
const dotenv = require("dotenv");

dotenv.config();

// **Google OAuth Strategy**
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:5001/auth/googleAuth/callback",
      passReqToCallback: true, // ✅ Requires `req` in callback function
      scope: ["profile", "email"],
      accessType: "offline", // ✅ Request refresh token
      prompt: "consent",
    },
    async (req, accessToken, refreshToken, profile, done) => {
      // 🔹 Added `req`
      try {
        if (!profile) {
          console.error("Profile is undefined!");
          return done(
            new Error("Failed to retrieve profile from Google"),
            null
          );
        }

        return done(null, {
          id: profile.id,
          email: profile.emails?.[0]?.value,
          displayName: profile.displayName,
          GoogleaccessToken: accessToken,
          GooglerefreshToken: refreshToken,
        });
      } catch (error) {
        console.error("Google OAuth Error:", error);
        return done(error, null);
      }
    }
  )
);

// **GitHub OAuth Strategy**
passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: "http://localhost:5001/auth/githubAuth/callback",
      scope: ["user:email"],
      accessType: "offline", // ✅ Request refresh token
      prompt: "consent",
    },
    async (req, accessToken, refreshToken, profile, done) => {
      try {
        if (!profile) {
          console.error("Profile is undefined!");
          return done(
            new Error("Failed to retrieve profile from Google"),
            null
          );
        }
        return done(null, {
          id: profile.id,
          email: profile.emails?.[0]?.value,
          username: profile.username,
          GithubaccessToken: refreshToken.access_token || null,
          GithubrefreshToken: refreshToken.refresh_token || null,
        });
      } catch (error) {
        console.error("GitHub OAuth Error:", error);
        return done(error, null);
      }
    }
  )
);

module.exports = passport;
