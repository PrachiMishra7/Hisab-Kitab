require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

const seedDB = require("./seed");

// connect DB
mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("MongoDB Connected");
    await seedDB(); // Automatically seed the database if it's empty
  })
  .catch(err => console.error("DB Error:", err));

// routes
app.use("/api/transactions", require("./routes/transactions"));

// mount kyc route
app.use('/api/kyc', require('./routes/kyc'));

app.use('/api/education', require('./routes/education'));
app.use('/api/schemes', require('./routes/schemes'));
app.use('/api/savings-plans', require('./routes/savings'));
app.use('/api/quiz', require('./routes/quiz'));

// Serve static files from uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Serve static frontend files (React build output)
app.use(express.static(path.join(__dirname, '../dist')));

// Fallback to index.html for React Router (SPA)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

app.listen(process.env.PORT || 5000, () =>
  console.log("Backend running on port", process.env.PORT || 5000)
);