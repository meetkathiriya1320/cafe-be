import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from the project root
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const config = {
  development: {
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: process.env.DB_DIALECT,
    logging: false,
  },
};

if (process.env.DB_DIALECT === "sqlite") {
  config.development.storage = path.resolve(__dirname, "../../database.sqlite");
  delete config.development.username;
  delete config.development.password;
  delete config.development.database;
  delete config.development.host;
  delete config.development.port;
}

export default config;
