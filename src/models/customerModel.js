import Customer from "./Customer.js";

const createCustomer = async (customerData) => {
    return await Customer.create(customerData);
};

const findCustomerByEmail = async (email) => {
    return await Customer.findOne({ where: { email } });
};

const findCustomerById = async (id) => {
    return await Customer.findByPk(id);
};

export { createCustomer, findCustomerByEmail, findCustomerById };