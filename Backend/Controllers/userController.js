import {
  addUserModel,
  getAllUsersModel,
  getUserByIdModel,
  getUserByPhoneModel
} from "../Models/userModel.js";

// Get all users
export const getUsers = async (req, res) => {
  try {
    const users = await getAllUsersModel();
    res.status(200).json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch users" });
  }
};

// Get user by ID
export const getUser = async (req, res) => {
  try {
    const user = await getUserByIdModel(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch user" });
  }
};
export const getUserByPhone = async (req, res) => {
  try {
    const user = await getUserByPhoneModel(req.params.phone);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch user by phone" });
  }
};

export const addUser = async (req, res) => {
  const { name, email, phone, telegram_id } = req.body;
  
  // Basic validation - now phone is required instead of email
  if (!name || !phone) {
    return res.status(400).json({ 
      success: false, 
      message: "Name and phone are required" 
    });
  }

  try {
    // First, check if user already exists by email
    const existingUser = await getUserByPhoneModel(phone);
    
    if (existingUser) {
      // User already exists - return the existing user's data
      return res.status(200).json({ 
        success: true, 
        data: existingUser, 
        message: "User already exists" 
      });
    }
    
    // User doesn't exist - create new user
    const result = await addUserModel({ 
      name, 
      email, 
      phone, 
      telegram_id
    });
    
    // Get the newly created user
    const newUser = await getUserByIdModel(result.insertId);
    
    res.status(201).json({ 
      success: true, 
      data: newUser, 
      message: "User added successfully" 
    });
  } catch (error) {
    console.error("Add user error:", error);
    
    res.status(500).json({ 
      success: false, 
      message: "Failed to add user",
      error: error.message 
    });
  }
};