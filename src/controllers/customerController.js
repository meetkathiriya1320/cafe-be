import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { createCustomer, findCustomerByEmail, findCustomerById } from "../models/customerModel.js";
import { RESPONSE } from "../helper/response/response.js";
import { generateOTP, sendOrderOTPEmail } from "../helper/emailService.js";

// In-memory storage for registration OTPs
const registrationOTPStore = new Map();

const initiateRegistration = async (req, res) => {
    const { name, email, phone, password } = req.body;

    if (!name || !email || !password) {
        return RESPONSE.error(res, "Name, email, and password are required", 400);
    }

    try {
        // Check if customer already exists
        const existingCustomer = await findCustomerByEmail(email);
        if (existingCustomer) {
            return RESPONSE.error(res, "Customer with this email already exists", 400);
        }

        // Generate OTP
        const otp = generateOTP();
        const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes for registration

        // Store registration data with OTP
        const registrationData = {
            name,
            email,
            phone,
            password,
            otp,
            expiresAt
        };
        registrationOTPStore.set(email, registrationData);

        // Send OTP email
        const emailResult = await sendOrderOTPEmail(email, otp);
        if (!emailResult.success) {
            return RESPONSE.error(res, 'Failed to send verification email', 500);
        }

        return RESPONSE.success(res, 'Verification code sent to your email', { email });
    } catch (error) {
        console.error("Error initiating registration:", error);
        return RESPONSE.error(res, 9999, 500, error);
    }
};

const verifyRegistrationOTP = async (req, res) => {
    const { email, otp } = req.body;

    if (!email || !otp) {
        return RESPONSE.error(res, 'Email and OTP are required', 400);
    }

    try {
        const storedData = registrationOTPStore.get(email);
        if (!storedData) {
            return RESPONSE.error(res, 'Registration session not found or expired', 400);
        }

        if (Date.now() > storedData.expiresAt) {
            registrationOTPStore.delete(email);
            return RESPONSE.error(res, 'Verification code expired', 400);
        }

        if (storedData.otp !== otp) {
            return RESPONSE.error(res, 'Invalid verification code', 400);
        }

        // OTP verified, create the customer account
        const { name, phone, password } = storedData;

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create customer
        const customer = await createCustomer({
            name,
            email,
            phone,
            password_hash: hashedPassword,
        });

        // Generate token
        const token = jwt.sign(
            { id: customer.id, email: customer.email, type: "customer" },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        // Clean up OTP
        registrationOTPStore.delete(email);

        return RESPONSE.success(res, "Account created successfully", {
            token,
            customer: {
                id: customer.id,
                name: customer.name,
                email: customer.email,
                phone: customer.phone,
            }
        });
    } catch (error) {
        console.error("Error verifying registration OTP:", error);
        return RESPONSE.error(res, 9999, 500, error);
    }
};

const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return RESPONSE.error(res, "Email and password are required", 400);
    }

    try {
        const customer = await findCustomerByEmail(email);
        if (!customer) {
            return RESPONSE.error(res, "Invalid credentials", 400);
        }

        const isMatch = await bcrypt.compare(password, customer.password_hash);
        if (!isMatch) {
            return RESPONSE.error(res, "Invalid credentials", 400);
        }

        const token = jwt.sign(
            { id: customer.id, email: customer.email, type: "customer" },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        return RESPONSE.success(res, "Login successful", {
            token,
            customer: {
                id: customer.id,
                name: customer.name,
                email: customer.email,
                phone: customer.phone,
            }
        });
    } catch (error) {
        console.error("Error logging in customer:", error);
        return RESPONSE.error(res, 9999, 500, error);
    }
};

const getProfile = async (req, res) => {
    try {
        const customer = await findCustomerById(req.customer.id);
        if (!customer) {
            return RESPONSE.error(res, "Customer not found", 404);
        }

        return RESPONSE.success(res, null, {
            id: customer.id,
            name: customer.name,
            email: customer.email,
            phone: customer.phone,
        });
    } catch (error) {
        console.error("Error fetching customer profile:", error);
        return RESPONSE.error(res, 9999, 500, error);
    }
};

export { initiateRegistration, verifyRegistrationOTP, login, getProfile };