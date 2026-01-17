const MESSAGES = {
  // Success Messages
  1001: "Login successful",
  1002: "Message sent successfully",
  1003: "Menu item deleted",
  1004: "Gallery image deleted successfully",

  // Error Messages
  2001: "Invalid credentials",
  2002: "All fields are required",
  2003: "Menu item not found",
  2004: "Image URL is required",
  2005: "Gallery image not found",
  2006: "Customer details and items are required",
  2007: "Order not found",
  2008: "Status is required",
  2009: "Access token required",
  2010: "Invalid token",

  // Server Errors
  2999: "Internal server error",
};

const get_message = (message_code) => {
  if (isNaN(message_code)) {
    return message_code;
  }
  return message_code ? MESSAGES[message_code] : message_code;
};

export { get_message };
