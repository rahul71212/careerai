require("dotenv").config();

console.log("Reset script started");

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User");

async function resetPassword() {
  try {
    console.log("Connecting to MongoDB...");

    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB connected!");

    const hashedPassword = await bcrypt.hash("Rahul@12345", 10);

    const user = await User.findOneAndUpdate(
      { email: "rahul@example.com" },
      {
        password: hashedPassword,
        role: "admin",
      },
      { new: true }
    );

    if (!user) {
      console.log("User not found: rahul@example.com");
    } else {
      console.log("Password reset successfully!");
      console.log("Email:", user.email);
      console.log("Role:", user.role);
    }

    await mongoose.connection.close();
    console.log("Done.");
  } catch (error) {
    console.error("ERROR:", error);
  }
}

resetPassword();