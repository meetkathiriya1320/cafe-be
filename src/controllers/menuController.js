import menuModel from "../models/menuModel.js";
import { RESPONSE } from "../helper/response/response.js";

const { getAllMenuItems, createMenuItem, updateMenuItem, deleteMenuItem } =
  menuModel;

const getMenu = async (req, res) => {
  try {
    const menuItems = await getAllMenuItems();
    return RESPONSE.success(res, null, menuItems);
  } catch (err) {
    console.error(err);
    return RESPONSE.error(res, 2999, 500, err);
  }
};

const addMenuItem = async (req, res) => {
  const { name, category, description, price, image_url } = req.body;
  try {
    const newItem = await createMenuItem({
      name,
      category,
      description,
      price,
      image_url,
    });
    return RESPONSE.success(res, null, newItem, 201);
  } catch (err) {
    console.error(err);
    return RESPONSE.error(res, 2999, 500, err);
  }
};

const updateMenuItemController = async (req, res) => {
  const { id } = req.params;
  const { name, category, description, price, image_url } = req.body;
  try {
    const updatedItem = await updateMenuItem(id, {
      name,
      category,
      description,
      price,
      image_url,
    });
    if (!updatedItem) {
      return RESPONSE.error(res, 2003, 404);
    }
    return RESPONSE.success(res, null, updatedItem);
  } catch (err) {
    console.error(err);
    return RESPONSE.error(res, 2999, 500, err);
  }
};

const deleteMenuItemController = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedItem = await deleteMenuItem(id);
    if (!deletedItem) {
      return RESPONSE.error(res, 2003, 404);
    }
    return RESPONSE.success(res, 1003);
  } catch (err) {
    console.error(err);
    return RESPONSE.error(res, 2999, 500, err);
  }
};

export {
  getMenu,
  addMenuItem,
  updateMenuItemController as updateMenuItem,
  deleteMenuItemController as deleteMenuItem,
};
