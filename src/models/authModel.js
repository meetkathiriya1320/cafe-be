import { User } from "./index.js";

const findUserByUsername = async (username) => {
  return await User.findOne({ where: { username } });
};

export default { findUserByUsername };
