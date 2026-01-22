import galleryModel from "../models/galleryModel.js";
import { RESPONSE } from "../helper/response/response.js";

const {
  getAllGalleryImages,
  createGalleryImage,
  updateGalleryImage,
  deleteGalleryImage,
} = galleryModel;

const getGallery = async (req, res) => {
  try {
    const images = await getAllGalleryImages();
    return RESPONSE.success(res, null, images);
  } catch (error) {
    console.error("Error fetching gallery images:", error);
    return RESPONSE.error(res, 9999, 500, error);
  }
};

const addGalleryImage = async (req, res) => {
  const { image_url, title, alt_text, description } = req.body;

  if (!image_url) {
    return RESPONSE.error(res, 2004, 400);
  }

  try {
    const newImage = await createGalleryImage({
      image_url,
      title,
      alt_text,
      description,
    });
    return RESPONSE.success(res, null, newImage, 201);
  } catch (error) {
    console.error("Error adding gallery image:", error);
    return RESPONSE.error(res, 9999, 500, error);
  }
};

const updateGalleryImageController = async (req, res) => {
  const { id } = req.params;
  const { image_url, title, alt_text, description } = req.body;

  if (!image_url) {
    return RESPONSE.error(res, 2004, 400);
  }

  try {
    const updatedImage = await updateGalleryImage(id, {
      image_url,
      title,
      alt_text,
      description,
    });

    if (!updatedImage) {
      return RESPONSE.error(res, 2005, 404);
    }
    return RESPONSE.success(res, null, updatedImage);
  } catch (error) {
    console.error("Error updating gallery image:", error);
    return RESPONSE.error(res, 9999, 500, error);
  }
};

const deleteGalleryImageController = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedImage = await deleteGalleryImage(id);

    if (!deletedImage) {
      return RESPONSE.error(res, 2005, 404);
    }

    return RESPONSE.success(res, 1004);
  } catch (error) {
    console.error("Error deleting gallery image:", error);
    return RESPONSE.error(res, 9999, 500, error);
  }
};

export {
  getGallery,
  addGalleryImage,
  updateGalleryImageController as updateGalleryImage,
  deleteGalleryImageController as deleteGalleryImage,
};
