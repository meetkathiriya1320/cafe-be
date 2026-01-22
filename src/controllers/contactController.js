import contactModel from "../models/contactModel.js";
import { RESPONSE } from "../helper/response/response.js";

const { createContactInquiry } = contactModel;

const submitContact = async (req, res) => {
    try {
        const { name, email, message } = req.body;
        await createContactInquiry({
            name,
            email,
            message,
        });

        return RESPONSE.success(res, 1002, null, 201);
    } catch (err) {
        return RESPONSE.error(res, 9999, 500, err);
    }
};

export { submitContact };
