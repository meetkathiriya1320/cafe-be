import sequelize from "../config/db.js";
import User from "./User.js";
import Customer from "./Customer.js";
import MenuItem from "./MenuItem.js";
import GalleryImage from "./GalleryImage.js";
import ContactInquiry from "./ContactInquiry.js";
import Order from "./Order.js";
import OrderItem from "./OrderItem.js";
import Event from "./Event.js";

// Define associations
Order.hasMany(OrderItem, { foreignKey: "order_id", as: "items" });
OrderItem.belongsTo(Order, { foreignKey: "order_id" });

OrderItem.belongsTo(MenuItem, { foreignKey: "menu_item_id", as: "menu_item" });
MenuItem.hasMany(OrderItem, { foreignKey: "menu_item_id" });

Order.belongsTo(Customer, { foreignKey: "customer_id", as: "customer" });
Customer.hasMany(Order, { foreignKey: "customer_id" });

import bcrypt from "bcryptjs";

// Sync database and seed initial data
const syncDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log("Database connection established.");

    await sequelize.sync();
    console.log("Database synchronized.");

    // Seed initial data
    await seedInitialData();
  } catch (error) {
    console.error("Unable to connect to the database:", error);
    process.exit(1);
  }
};

const seedInitialData = async () => {
  try {
    // Create admin user
    const existingAdmin = await User.findOne({ where: { username: "admin" } });
    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash("admin123", 10);
      await User.create({
        username: "admin",
        password_hash: hashedPassword,
      });
      console.log("Admin user created: username=admin, password=admin123");
    }

    // Seed menu items
    const menuCount = await MenuItem.count();
    if (menuCount === 0) {
      const menuItems = [
        {
          category: "Coffee",
          name: "Espresso",
          description: "Rich and bold espresso shot",
          price: 3.5,
          image_url:
            "https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=400",
        },
        {
          category: "Coffee",
          name: "Cappuccino",
          description: "Espresso with steamed milk and foam",
          price: 4.5,
          image_url:
            "https://images.unsplash.com/photo-1534778101976-62847782c213?w=400",
        },
        {
          category: "Beverages",
          name: "Green Tea",
          description: "Refreshing green tea",
          price: 3.0,
          image_url:
            "https://images.unsplash.com/photo-1627435601361-ec25f5b1d0e3?w=400",
        },
        {
          category: "Snacks",
          name: "Croissant",
          description: "Buttery and flaky croissant",
          price: 2.5,
          image_url:
            "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400",
        },
        {
          category: "Desserts",
          name: "Chocolate Cake",
          description: "Decadent chocolate cake",
          price: 5.0,
          image_url:
            "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400",
        },
      ];
      await MenuItem.bulkCreate(menuItems);
      console.log("Sample menu items created");
    }

    // Seed gallery images
    const galleryCount = await GalleryImage.count();
    if (galleryCount === 0) {
      const galleryImages = [
        {
          title: "Cozy Café Interior",
          image_url:
            "https://images.unsplash.com/photo-1559496417-e7f25cb247f3?w=800",
        },
        {
          title: "Delicious Coffee",
          image_url:
            "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800",
        },
        {
          title: "Moonlit Ambiance",
          image_url:
            "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800",
        },
      ];
      await GalleryImage.bulkCreate(galleryImages);
      console.log("Sample gallery images created");
    }

    // Seed events
    const eventCount = await Event.count();
    if (eventCount === 0) {
      const events = [
        {
          name: "Jazz Night",
          description: "Live jazz performances with our special cocktails. Immerse yourself in smooth melodies and great vibes.",
          date: "2023-12-15",
          time: "20:00:00",
          image_url: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
        },
        {
          name: "Open Mic Night",
          description: "Showcase your talent or enjoy performances by local artists. A night of creativity and connection.",
          date: "2023-12-20",
          time: "19:00:00",
          image_url: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
        },
        {
          name: "Wine & Cheese Evening",
          description: "Pair exquisite wines with artisanal cheeses. A sophisticated evening for wine enthusiasts.",
          date: "2023-12-25",
          time: "18:00:00",
          image_url: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
        },
      ];
      await Event.bulkCreate(events);
      console.log("Sample events created");
    }
  } catch (error) {
    console.error("Error seeding initial data:", error);
  }
};

export {
  sequelize,
  User,
  MenuItem,
  GalleryImage,
  ContactInquiry,
  Order,
  OrderItem,
  Event,
  syncDatabase,
};
