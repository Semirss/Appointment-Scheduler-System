import {
  addUserModel,
  getAllUsersModel,
  getUserByIdModel
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

export const addUser = async (req, res) => {
  const { name, email, phone, telegram_id } = req.body;
  try {
    await addUserModel({ name, email, phone, telegram_id });
    res.status(201).json({ success: true, message: "User added successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to add user" });
  }
};

