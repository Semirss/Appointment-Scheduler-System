// Controllers/customizeController.js
import {
  getCustomizationsModel,
  getCustomizationByCompanyIdModel,
  addCustomizationModel,
  updateCustomizationModel,
  deleteCustomizationModel
} from "../Models/customizeModel.js";

export const getCustomizations = async (req, res) => {
  try {
    const customizations = await getCustomizationsModel();
    res.status(200).json({ success: true, data: customizations });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch customizations" });
  }
};

export const getCustomizationByCompanyId = async (req, res) => {
  try {
    const { companyId } = req.params;
    const customization = await getCustomizationByCompanyIdModel(companyId);
    res.status(200).json({ success: true, data: customization });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch customization" });
  }
};

export const addCustomization = async (req, res) => {
  try {
    await addCustomizationModel(req.body);
    res.status(201).json({ success: true, message: "Customization added" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to add customization" });
  }
};

export const updateCustomization = async (req, res) => {
  try {
    const { companyId } = req.params;
    await updateCustomizationModel(companyId, req.body);
    res.json({ success: true, message: "Customization updated" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to update customization" });
  }
};

export const deleteCustomization = async (req, res) => {
  try {
    await deleteCustomizationModel(req.params.id);
    res.json({ success: true, message: "Customization deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to delete customization" });
  }
};