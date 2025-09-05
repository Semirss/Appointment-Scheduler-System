import {
  getCompaniesModel,
  addCompanyModel,
  updateCompanyModel,
  deleteCompanyModel,
  findCompanyByEmail,
  getCompanyBySubdomainModel,
} from "../Models/companiesModel.js";

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from 'dotenv';

dotenv.config();

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

    // Generate JWT token
    const token = jwt.sign(
      { company_id: company.company_id, email: company.email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // Set cookie
    res.cookie("company_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production" ? true : false, // HTTPS only in prod
      sameSite: "Strict",
      maxAge: 24 * 60 * 60 * 1000 // 1 day
    });


    // Send response
    res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        company_id: company.company_id,
        name: company.name,
        phone: company.phone,
        category: company.category
      }
    });
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


export const getCompanyBySubdomain = async (req, res) => {
  try {
    const { subdomain } = req.params;
    const company = await getCompanyBySubdomainModel(subdomain);

    if (!company) {
      return res.status(404).json({ success: false, message: "Company not found" });
    }

    res.status(200).json({ success: true, data: company });
  } catch (error) {
    console.error("Error fetching company by subdomain:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};


export const addCompany = async (req, res) => {
  const { name, email, phone, category, password, subdomain } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await addCompanyModel({ name, email, phone, category, password: hashedPassword, subdomain });
    res.status(201).json({ success: true, message: "Company added" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to add company" });
  }
};

export const updateCompany = async (req, res) => {
  const { name, email, phone, category, password ,subdomain } = req.body;
  try {
    let hashedPassword = null;
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }
    await updateCompanyModel(req.params.id, { name, email, phone, category, password: hashedPassword, subdomain });
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

