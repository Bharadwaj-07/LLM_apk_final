
// Load environment variables from .env file

export const GLOBAL_CONFIG = {
  SYSTEM_IP: process.env.SYSTEM_IP || "10.25.67.62", // Default IP if not set
  PORT: process.env.PORT || 5000 // Default port 5000 if not set
};


