import { findAdminByEmail } from "../Models/adminModel.js";
import bcrypt from 'bcrypt';
import dotenv from "dotenv";
dotenv.config();

export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await findAdminByEmail(email);
    if (!admin) {
      return res.status(404).json({ success: false, message: "Admin not found" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    // const token = jwt.sign(
    //   { admin_id: admin.admin_id, email: admin.email },
    //   process.env.JWT_SECRET,
    //   { expiresIn: "1d" }
    // );

    // res.status(200).json({ success: true, token });
    res.status(200).json({ success: true, message: "Login Successful"});
  } catch (error) {
    res.status(500).json({ success: false, message: "Login failed" });
  }
};
