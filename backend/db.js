const { Pool } = require('pg');
require("dotenv").config();


let pool;

if (process.env.NODE_ENV === 'production') {
  // If running in production (Heroku), connect using DATABASE_URL
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  });
} else {
  // If running locally, connect using local DB credentials
  pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
  });
}

module.exports = pool;
