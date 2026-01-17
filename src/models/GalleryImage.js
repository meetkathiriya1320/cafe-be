import { DataTypes } from "sequelize";
import db from "../config/db.js";

const GalleryImage = db.define(
  "GalleryImage",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    image_url: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    alt_text: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    tableName: "gallery_images",
    timestamps: true,
  },
);

export default GalleryImage;
