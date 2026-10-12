require("dns").setServers(["8.8.8.8", "1.1.1.1"]);
require("dotenv").config();

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User");

const demoUsers = [
  {
    name: "Alex Rivera",
    email: "admin@system.com",
    password: "Admin@12345",
    role: "admin",
  },
  {
    name: "Jordan Lee",
    email: "manager@system.com",
    password: "Manager@12345",
    role: "manager",
  },
  {
    name: "Sam Taylor",
    email: "user@system.com",
    password: "User@12345",
    role: "user",
  },
];

async function seedUsers() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    for (const item of demoUsers) {
      const existingUser = await User.findOne({
        email: item.email,
      });

      if (existingUser) {
        console.log(`Already exists: ${item.email}`);
        continue;
      }

      const hashedPassword = await bcrypt.hash(item.password, 12);

      await User.create({
        name: item.name,
        email: item.email,
        password: hashedPassword,
        role: item.role,
      });

      console.log(`Created ${item.role}: ${item.email}`);
    }
  } catch (error) {
    console.error("Seeding failed:", error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

seedUsers();
