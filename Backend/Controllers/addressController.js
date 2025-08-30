import {
  getAddressesModel,
  getAddressesByCompanyModel,
  addAddressModel,
  updateAddressModel,
  deleteAddressModel
} from "../Models/addressModel.js";

export const getAddresses = async (req, res) => {
  try {
    const addresses = await getAddressesModel();
    res.status(200).json({ success: true, data: addresses });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch addresses" });
  }
};

export const getCompanyAddresses = async (req, res) => {
  try {
    const companyId = req.params.companyId;
    const addresses = await getAddressesByCompanyModel(companyId);

    if (!addresses.length) {
      return res.status(404).json({ success: false, message: "No addresses found for this company" });
    }

    res.status(200).json({ success: true, data: addresses });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch addresses" });
  }
};

export const addAddress = async (req, res) => {
  try {
    await addAddressModel(req.body);
    res.status(201).json({ success: true, message: "Address added" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to add address" });
  }
};

export const updateAddress = async (req, res) => {
  try {
    await updateAddressModel(req.params.id, req.body);
    res.json({ success: true, message: "Address updated" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to update address" });
  }
};

export const deleteAddress = async (req, res) => {
  try {
    await deleteAddressModel(req.params.id);
    res.json({ success: true, message: "Address deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to delete address" });
  }
};
