import pkg from 'pg';  // Importing pg as default to handle CommonJS export
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pkg;  // Destructure Pool from pg package

// Create a new pool instance for connection pooling
const pool = new Pool({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT,
});

// Event listener for pool errors
pool.on('error', (err, client) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

export { pool };
