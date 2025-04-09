
import express from "express";
import cors from "cors";
import connectDB from "./configs/mongodb.js";
import jwt from "jsonwebtoken";
import { authenticateToken } from "./configs/jsonwetoken.js";
import User from "./models/userModel.js";
import bcrypt from "bcrypt";
import dotenv from "dotenv";

dotenv.config(); // Make sure .env variables are loaded

const app = express();
app.use(express.json());
app.use(cors());

// Start database connection
connectDB();

// Default route
app.get("/", (req, res) => {
  res.send({ data: "Hello" });
});

// Create Account Route
app.post("/create-account", async (req, res) => {
  const { fullName, email, password } = req.body;

  if (!fullName || !email || !password) {
    return res.status(400).json({
      error: true,
      message: "Full name, email, and password are required",
    });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(409)
        .json({ error: true, message: "User already exists" });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    const accessToken = jwt.sign(
      { id: newUser._id },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "1h" }
    );

    res.status(201).json({
      error: false,
      message: "Registration successful",
      user: {
        id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
      },
      accessToken,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: true, message: "Server error" });
  }
});

// Login into Account
app.post("/login", async (req, res) => {
    const { email, password } = req.body;
  
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }
    if (!password) {
      return res.status(400).json({ message: "Password is required" });
    }
  
    try {
      const userInfo = await User.findOne({ email });
  
      if (!userInfo) {
        return res.status(404).json({ message: "User not found" });
      }
  
      // 👉 Compare plain password with hashed password
      const isPasswordValid = await bcrypt.compare(password, userInfo.password);
      if (!isPasswordValid) {
        return res.status(401).json({
          error: true,
          message: "Invalid credentials",
        });
      }
  
      const accessToken = jwt.sign(
        { id: userInfo._id },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "1h" }
      );
  
      return res.status(200).json({
        error: false,
        message: "Login successful",
        user: {
          id: userInfo._id,
          fullName: userInfo.fullName,
          email: userInfo.email,
        },
        accessToken,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: true, message: "Server error" });
    }
  });

// Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;
