import { MenuItem } from "./index.js";

const getAllMenuItems = async () => {
  return await MenuItem.findAll({
    order: [
      ["category", "ASC"],
      ["name", "ASC"],
    ],
  });
};

const createMenuItem = async (data) => {
  return await MenuItem.create(data);
};

const updateMenuItem = async (id, data) => {
  const [updatedRowsCount, updatedRows] = await MenuItem.update(data, {
    where: { id },
    returning: true,
  });
  if (updatedRowsCount === 0) return null;
  return updatedRows[0];
};

const deleteMenuItem = async (id) => {
  const deletedRowsCount = await MenuItem.destroy({ where: { id } });
  return deletedRowsCount > 0;
};

const getMenuItemById = async (id) => {
  return await MenuItem.findByPk(id);
};

export default {
  getAllMenuItems,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
  getMenuItemById,
};
