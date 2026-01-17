import orderModel from "../models/orderModel.js";
import menuModel from "../models/menuModel.js";
import { RESPONSE } from "../helper/response/response.js";

const {
  createOrder,
  createOrderItem,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  deleteOrder,
} = orderModel;
const { getMenuItemById } = menuModel;

const createOrderController = async (req, res) => {
  const { customer_name, customer_email, customer_phone, items } = req.body;

  if (!customer_name || !customer_email || !items || items.length === 0) {
    return RESPONSE.error(res, 2006, 400);
  }

  try {
    // Calculate total amount
    let totalAmount = 0;
    for (const item of items) {
      const menuItem = await getMenuItemById(item.menu_item_id);
      if (!menuItem) {
        return RESPONSE.error(
          res,
          `Menu item ${item.menu_item_id} not found`,
          400,
        );
      }
      totalAmount += menuItem.price * item.quantity;
    }

    // Insert order
    const order = await createOrder({
      customer_name,
      customer_email,
      customer_phone,
      total_amount: totalAmount,
    });

    // Insert order items
    for (const item of items) {
      const menuItem = await getMenuItemById(item.menu_item_id);
      await createOrderItem({
        order_id: order.id,
        menu_item_id: item.menu_item_id,
        quantity: item.quantity,
        price: menuItem.price,
      });
    }

    return RESPONSE.success(res, null, order, 201);
  } catch (error) {
    console.error("Error creating order:", error);
    return RESPONSE.error(res, 2999, 500, error);
  }
};

const getOrders = async (req, res) => {
  try {
    const orders = await getAllOrders();
    return RESPONSE.success(res, null, orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    return RESPONSE.error(res, 2999, 500, error);
  }
};

const getOrder = async (req, res) => {
  const { id } = req.params;

  try {
    const order = await getOrderById(id);
    if (!order) {
      return RESPONSE.error(res, 2007, 404);
    }
    return RESPONSE.success(res, null, order);
  } catch (error) {
    console.error("Error fetching order:", error);
    return RESPONSE.error(res, 2999, 500, error);
  }
};

const updateOrderStatusController = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!status) {
    return RESPONSE.error(res, 2008, 400);
  }

  try {
    const updatedOrder = await updateOrderStatus(id, status);
    if (!updatedOrder) {
      return RESPONSE.error(res, 2007, 404);
    }
    return RESPONSE.success(res, null, updatedOrder);
  } catch (error) {
    console.error("Error updating order:", error);
    return RESPONSE.error(res, 2999, 500, error);
  }
};

const deleteOrderController = async (req, res) => {
  const { id } = req.params;

  try {
    const deleted = await deleteOrder(id);
    if (!deleted) {
      return RESPONSE.error(res, 2007, 404);
    }
    return RESPONSE.success(res, null, null);
  } catch (error) {
    console.error("Error deleting order:", error);
    return RESPONSE.error(res, 2999, 500, error);
  }
};

export {
  createOrderController as createOrder,
  getOrders,
  getOrder,
  updateOrderStatusController as updateOrderStatus,
  deleteOrderController as deleteOrder,
};
