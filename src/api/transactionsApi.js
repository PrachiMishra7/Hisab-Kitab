// src/api/transactionsApi.js
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const client = axios.create({
  baseURL: API_BASE,
  headers: { "Content-Type": "application/json" },
  timeout: 8000,
});

export const getTransactions = async () => {
  const res = await client.get("/transactions");
  return res.data;
};

export const addTransaction = async (payload) => {
  try {
    const res = await client.post("/transactions", payload);
    return res.data;
  } catch (err) {
    // Normalize and rethrow useful info
    const message =
      err?.response?.data?.error ||
      err?.response?.data?.message ||
      err?.response?.data ||
      err.message ||
      "Unknown error";
    const status = err?.response?.status || null;
    throw { message, status, original: err };
  }
};

export const deleteTransaction = async (id) => {
  const res = await client.delete(`/transactions/${id}`);
  return res.data;
};
