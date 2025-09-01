import { findAdminByEmail, createAdmin } from "../Models/adminModel.js";
import bcrypt from 'bcrypt';
import dotenv from "dotenv";
dotenv.config();

export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ 
        success: false, 
        message: "Email and password are required" 
      });
    }

    const admin = await findAdminByEmail(email);
    if (!admin) {
      return res.status(404).json({ 
        success: false, 
        message: "Admin not found" 
      });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ 
        success: false, 
        message: "Invalid credentials" 
      });
    }

    // Return success response without token
    res.status(200).json({ 
      success: true, 
      message: "Login successful",
      admin: {
        admin_id: admin.admin_id,
        email: admin.email
      }
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Internal server error during login" 
    });
  }
};

export const addAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ 
        success: false, 
        message: "Email and password are required" 
      });
    }

    // Check if admin already exists
    const existingAdmin = await findAdminByEmail(email);
    if (existingAdmin) {
      return res.status(409).json({ 
        success: false, 
        message: "Admin with this email already exists" 
      });
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create admin
    const newAdmin = await createAdmin({
      email,
      password: hashedPassword
    });

    res.status(201).json({ 
      success: true, 
      message: "Admin created successfully",
      admin: {
        admin_id: newAdmin.admin_id,
        email: newAdmin.email
      }
    });
  } catch (error) {
    console.error("Admin creation error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Internal server error during admin creation" 
    });
  }
};