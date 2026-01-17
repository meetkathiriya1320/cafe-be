import { ContactInquiry } from "./index.js";

const createContactInquiry = async (data) => {
  return await ContactInquiry.create(data);
};

export default { createContactInquiry };
