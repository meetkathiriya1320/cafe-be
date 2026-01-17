import { DataTypes } from "sequelize";
import db from "../config/db.js";

const Order = db.define(
  "Order",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    customer_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    customer_email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: true,
      },
    },
    customer_phone: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    total_amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM(
        "pending",
        "confirmed",
        "preparing",
        "ready",
        "completed",
      ),
      defaultValue: "pending",
    },
  },
  {
    tableName: "orders",
    timestamps: true,
  },
);

export default Order;
