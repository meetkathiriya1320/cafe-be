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

export { authenticateToken };
