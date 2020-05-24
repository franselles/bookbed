require('dotenv').config();

module.exports = {
  port: process.env.PORT || 8080,
  db: process.env.MONGODB_URI || process.env.DB_HOST,
};
