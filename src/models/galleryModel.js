import { GalleryImage } from "./index.js";

const getAllGalleryImages = async () => {
  return await GalleryImage.findAll({ order: [["createdAt", "DESC"]] });
};

const createGalleryImage = async (data) => {
  return await GalleryImage.create(data);
};

const updateGalleryImage = async (id, data) => {
  const [updatedRowsCount, updatedRows] = await GalleryImage.update(data, {
    where: { id },
    returning: true,
  });
  if (updatedRowsCount === 0) return null;
  return updatedRows[0];
};

const deleteGalleryImage = async (id) => {
  const deletedRowsCount = await GalleryImage.destroy({ where: { id } });
  return deletedRowsCount > 0;
};

export default {
  getAllGalleryImages,
  createGalleryImage,
  updateGalleryImage,
  deleteGalleryImage,
};
