import {
  getServicesModel,
  addServiceModel,
  updateServiceModel,
  deleteServiceModel,
  getServicesByCompanyModel,
  updateServiceByCompanyModel
} from "../models/servicesModel.js";

export const getServices = async (req, res) => {
  try {
    const services = await getServicesModel();
    res.status(200).json({ success: true, data: services });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch services" });
  }
};

export const getCompanyServices = async (req, res) => {
  try {
    const companyId = req.params.companyId;
    const services = await getServicesByCompanyModel(companyId);

    if (!services.length) {
      return res.status(404).json({ success: false, message: "No services found for this company" });
    }

    res.status(200).json({ success: true, data: services });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch services" });
  }
};

export const addService = async (req, res) => {
  try {
    await addServiceModel(req.body);
    res.status(201).json({ success: true, message: "Service added" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to add service" });
  }
};

export const updateService = async (req, res) => {
  try {
    await updateServiceModel(req.params.id, req.body);
    res.json({ success: true, message: "Service updated" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to update service" });
  }
};

export const updateServiceByCompany = async (req, res) => {
  const { serviceId, companyId } = req.params;
  const data = req.body;

  try {
    const updated = await updateServiceByCompanyModel(serviceId, companyId, data);
    if (updated === 0) {
      return res.status(404).json({
        success: false,
        message: "Service not found or does not belong to this company"
      });
    }
    res.json({ success: true, message: "Service updated successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to update service" });
  }
};


export const deleteService = async (req, res) => {
  try {
    await deleteServiceModel(req.params.id);
    res.json({ success: true, message: "Service deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to delete service" });
  }
};
