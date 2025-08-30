import {
  getCompaniesModel,
  addCompanyModel,
  updateCompanyModel,
  deleteCompanyModel,
  findCompanyByEmail,
} from "../Models/companiesModel.js";

import bcrypt from "bcrypt";

export const loginCompany = async (req, res) => {
  try {
    const { email, password } = req.body;

    const company = await findCompanyByEmail(email);
    if (!company) {
      return res.status(404).json({ success: false, message: "Company not found" });
    }

    const isMatch = await bcrypt.compare(password, company.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    // Optional: JWT token logic
    // const token = jwt.sign(
    //   { company_id: company.company_id, email: company.email },
    //   process.env.JWT_SECRET,
    //   { expiresIn: "1d" }
    // );

    // res.status(200).json({ success: true, token });
    res.status(200).json({ success: true, message: "Login successful" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Login failed" });
  }
};


export const getCompanies = async (req, res) => {
  try {
    const companies = await getCompaniesModel();
    res.status(200).json({ success: true, data: companies });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch companies" });
  }
};

export const addCompany = async (req, res) => {
  const { name, email, phone, category, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await addCompanyModel({ name, email, phone, category, password: hashedPassword });
    res.status(201).json({ success: true, message: "Company added" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to add company" });
  }
};

export const updateCompany = async (req, res) => {
  const { name, email, phone, category, password } = req.body;
  try {
    let hashedPassword = null;
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }
    await updateCompanyModel(req.params.id, { name, email, phone, category, password: hashedPassword });
    res.json({ success: true, message: "Company updated" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to update company" });
  }
};

export const deleteCompany = async (req, res) => {
  try {
    await deleteCompanyModel(req.params.id);
    res.json({ success: true, message: "Company deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to delete company" });
  }
};

