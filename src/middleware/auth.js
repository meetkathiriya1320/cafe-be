import jwt from "jsonwebtoken";
import { RESPONSE } from "../helper/response/response.js";

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return RESPONSE.error(res, 2009, 401);

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return RESPONSE.error(res, 2010, 403);
    req.user = user;
    next();
  });
};

const authenticateCustomer = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return RESPONSE.error(res, "Access token required", 401);

  jwt.verify(token, process.env.JWT_SECRET, (err, customer) => {
    if (err) return RESPONSE.error(res, "Invalid token", 403);
    if (customer.type !== "customer") return RESPONSE.error(res, "Customer access required", 403);
    req.customer = customer;
    next();
  });
};

export { authenticateToken, authenticateCustomer };
