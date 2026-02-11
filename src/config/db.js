import { Sequelize } from "sequelize";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from the project root
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

let sequelize;

if (process.env.DB_DIALECT === "sqlite") {
  sequelize = new Sequelize({
    dialect: "sqlite",
    storage: path.resolve(__dirname, "../../database.sqlite"),
    logging: false,
  });
} else {
  sequelize = new Sequelize(
    process.env.DB_NAME || "cafe",
    process.env.DB_USER || "postgres",
    process.env.DB_PASSWORD || process.env.DB_PASSWORD || "",
    {
      host: process.env.DB_HOST || "localhost",
      dialect: process.env.DB_DIALECT || "postgres",
      port: parseInt(process.env.DB_PORT) || 5432,
      logging: false,
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false,
        },
      },
    },
  );
}

export default sequelize;
