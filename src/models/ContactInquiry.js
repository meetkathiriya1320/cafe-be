import { DataTypes } from "sequelize";
import db from "../config/db.js";

const ContactInquiry = db.define(
  "ContactInquiry",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: true,
      },
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    tableName: "contact_inquiries",
    timestamps: true,
  },
);

export default ContactInquiry;
