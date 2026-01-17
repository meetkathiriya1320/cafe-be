import bcrypt from "bcryptjs";
import { User } from "./src/models/index.js";

const createAdmin = async () => {
    try {
        const hashedPassword = await bcrypt.hash("admin123", 10);
        const user = await User.create({
            username: "admin",
            password_hash: hashedPassword,
        });
        console.log("Admin user created:", user.toJSON());
    } catch (error) {
        console.error("Error creating user:", error);
    }
};

createAdmin();