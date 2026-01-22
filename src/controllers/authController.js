import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import authModel from "../models/authModel.js";
import { RESPONSE } from "../helper/response/response.js";

const { findUserByUsername } = authModel;

const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await findUserByUsername(username);
    if (!user) {
      return RESPONSE.error(res, 2001, 400);
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return RESPONSE.error(res, 2001, 400);
    }

    const token = jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "1h" },
    );
    return RESPONSE.success(res, 1001, { token });
  } catch (err) {
    console.error(err);
    return RESPONSE.error(res, 9999, 500, err);
  }
};

export { login };
