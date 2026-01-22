import orderModel from "../models/orderModel.js";
import menuModel from "../models/menuModel.js";
import { RESPONSE } from "../helper/response/response.js";
import { generateOTP, sendOrderOTPEmail } from "../helper/emailService.js";

const {
  createOrder,
  createOrderItem,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  deleteOrder,
} = orderModel;
const { getMenuItemById } = menuModel;

// In-memory storage for OTPs (in production, use Redis or database)
const otpStore = new Map();

const initiateOrderController = async (req, res) => {
  const { customer_name, customer_email, customer_phone, items } = req.body;

  if (!customer_name || !customer_email || !items || items.length === 0) {
    return RESPONSE.error(res, 2006, 400);
  }

  try {
    // Validate items and calculate total
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

    // Generate OTP
    const otp = generateOTP();
    const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes

    // Store OTP with order data
    const orderData = {
      customer_name,
      customer_email,
      customer_phone,
      items,
      total_amount: totalAmount,
      otp,
      expiresAt
    };
    otpStore.set(customer_email, orderData);

    // Send OTP email
    const emailResult = await sendOrderOTPEmail(customer_email, otp);
    if (!emailResult.success) {
      return RESPONSE.error(res, 'Failed to send OTP email', 500);
    }

    return RESPONSE.success(res, 'OTP sent to email', { email: customer_email }, 200);
  } catch (error) {
    console.error("Error initiating order:", error);
    return RESPONSE.error(res, 9999, 500, error);
  }
};

const verifyOTPAndCreateOrder = async (req, res) => {
  const { customer_email, otp } = req.body;

  if (!customer_email || !otp) {
    return RESPONSE.error(res, 'Email and OTP are required', 400);
  }

  try {
    const storedData = otpStore.get(customer_email);
    if (!storedData) {
      return RESPONSE.error(res, 'OTP not found or expired', 400);
    }

    if (Date.now() > storedData.expiresAt) {
      otpStore.delete(customer_email);
      return RESPONSE.error(res, 'OTP expired', 400);
    }

    if (storedData.otp !== otp) {
      return RESPONSE.error(res, 'Invalid OTP', 400);
    }

    // OTP verified, create the order
    const { customer_name, customer_phone, items, total_amount } = storedData;

    // Check if customer is logged in (has customer auth token)
    let customer_id = null;
    if (req.customer && req.customer.id) {
      customer_id = req.customer.id;
    }

    // Insert order
    const order = await createOrder({
      customer_id,
      customer_name,
      customer_email,
      customer_phone,
      total_amount,
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

    // Clean up OTP
    otpStore.delete(customer_email);

    return RESPONSE.success(res, 'Order created successfully', order, 201);
  } catch (error) {
    console.error("Error verifying OTP and creating order:", error);
    return RESPONSE.error(res, 9999, 500, error);
  }
};

const getOrders = async (req, res) => {
  try {
    const orders = await getAllOrders();
    return RESPONSE.success(res, null, orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    return RESPONSE.error(res, 9999, 500, error);
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
    return RESPONSE.error(res, 9999, 500, error);
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
    return RESPONSE.error(res, 9999, 500, error);
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
    return RESPONSE.error(res, 9999, 500, error);
  }
};

const getCustomerOrders = async (req, res) => {
  try {
    const customerId = req.customer.id;
    const orders = await getAllOrders();
    const customerOrders = orders.filter(order => order.customer_id === customerId);

    return RESPONSE.success(res, null, customerOrders);
  } catch (error) {
    console.error("Error fetching customer orders:", error);
    return RESPONSE.error(res, 9999, 500, error);
  }
};

export {
  initiateOrderController as initiateOrder,
  verifyOTPAndCreateOrder as verifyOTP,
  getCustomerOrders,
  getOrders,
  getOrder,
  updateOrderStatusController as updateOrderStatus,
  deleteOrderController as deleteOrder,
};
