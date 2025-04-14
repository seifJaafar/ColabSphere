const jwt = require("jsonwebtoken");
const dotenv = require("dotenv"); // Automatically loads .env variables

dotenv.config();

const SERVICE_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;

/**
 * Generate a JWT token for a service (never expires)
 * @param {string} serviceName - Name of the service (e.g., "messageService")
 * @param {string[]} [permissions] - Optional permissions array
 * @returns {string} JWT token
 */
const generateServiceToken = (serviceName) => {
  return jwt.sign(
    {
      _service: true, // Flag to identify this as a service token
      id: serviceName,
    },
    SERVICE_TOKEN_SECRET // No expiry (remove expiresIn)
  );
};

/**
 * Verify a service token (works for non-expiring tokens)
 * @param {string} token - JWT token to verify
 * @returns {object} Decoded token payload (or throws error if invalid)
 */
const verifyServiceToken = (token) => {
  return jwt.verify(token, SERVICE_TOKEN_SECRET);
};

// Rest of the file (validateServiceToken middleware) remains the same...
module.exports = {
  generateServiceToken,
};
