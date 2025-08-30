import {
  getTransactionsModel,
  addTransactionModel,
  updateTransactionModel,
  deleteTransactionModel,
  getTransactionsByCompany,
  getTransactionById
} from "../Models/transactionsModel.js";

export const getTransactions = async (req, res) => {
  try {
    const transactions = await getTransactionsModel();
    res.status(200).json({ success: true, data: transactions });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch transactions" });
  }
};

export const fetchTransactionsByCompany = async (req, res) => {
  const { companyId } = req.params;
  try {
    const transactions = await getTransactionsByCompany(companyId);
    res.status(200).json({ success: true, data: transactions });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch transactions" });
  }
};

export const fetchTransactionById = async (req, res) => {
  const { transactionId } = req.params;

  try {
    const transaction = await getTransactionById(transactionId);
    if (!transaction) {
      return res.status(404).json({ success: false, message: "Transaction not found" });
    }
    res.status(200).json({ success: true, data: transaction });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch transaction" });
  }
};

export const addTransaction = async (req, res) => {
  try {
    await addTransactionModel(req.body);
    res.status(201).json({ success: true, message: "Transaction added" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to add transaction" });
  }
};

export const updateTransaction = async (req, res) => {
  try {
    await updateTransactionModel(req.params.id, req.body);
    res.json({ success: true, message: "Transaction updated" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to update transaction" });
  }
};

export const deleteTransaction = async (req, res) => {
  try {
    await deleteTransactionModel(req.params.id);
    res.json({ success: true, message: "Transaction deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to delete transaction" });
  }
};
