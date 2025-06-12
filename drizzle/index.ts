import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
const databaseUrl = process.env.DATABASE_URL;
const poolConnection = mysql.createPool({
  uri: databaseUrl,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
  connectTimeout: 10000,
  maxIdle: 10,
  idleTimeout: 60000
});
const db = drizzle(poolConnection);

export default db;