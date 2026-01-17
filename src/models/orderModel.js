import { Order, OrderItem, MenuItem } from "./index.js";

const createOrder = async (data) => {
  return await Order.create(data);
};

const createOrderItem = async (data) => {
  return await OrderItem.create(data);
};

const getAllOrders = async () => {
  return await Order.findAll({
    include: [
      {
        model: OrderItem,
        as: "items",
        include: [
          {
            model: MenuItem,
            as: "menu_item",
            attributes: ["name", "category"],
          },
        ],
      },
    ],
    order: [["createdAt", "DESC"]],
  });
};

const getOrderById = async (id) => {
  return await Order.findByPk(id, {
    include: [
      {
        model: OrderItem,
        as: "items",
        include: [
          {
            model: MenuItem,
            as: "menu_item",
            attributes: ["name", "category", "description"],
          },
        ],
      },
    ],
  });
};

const updateOrderStatus = async (id, status) => {
  const [updatedRowsCount, updatedRows] = await Order.update(
    { status },
    { where: { id }, returning: true },
  );
  if (updatedRowsCount === 0) return null;
  return updatedRows[0];
};

const deleteOrder = async (id) => {
  const deletedRowsCount = await Order.destroy({ where: { id } });
  return deletedRowsCount > 0;
};

export default {
  createOrder,
  createOrderItem,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  deleteOrder,
};
