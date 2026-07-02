const express = require("express");
const router = express.Router();
const Transaction = require("../models/Transaction");

// GET all
router.get("/", async (req, res) => {
  const tx = await Transaction.find().sort({ date: -1 });
  res.json(tx);
});

// POST
router.post("/", async (req, res) => {
  const newTx = await Transaction.create(req.body);
  res.json(newTx);
});

// DELETE (optional)
router.delete("/:id", async (req, res) => {
  await Transaction.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

module.exports = router;
