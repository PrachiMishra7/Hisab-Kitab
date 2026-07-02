// backend/routes/education.js
const express = require('express');
const router = express.Router();

// sample data (you can later move to DB)
const lessons = [
  {
    id: "why-save-money",
    title: "🌱 Why Save Money?",
    summary: "Learn the importance of saving for future needs.",
    content: "Saving money helps you build emergency funds, reach goals and gain financial freedom. (Full article text goes here...)",
    category: "Savings",
    difficulty: "Beginner",
    readTime: "3 min"
  },
  {
    id: "smart-spending",
    title: "🛒 Smart Spending",
    summary: "Tips to manage expenses wisely.",
    content: "Smart spending is tracking expenses, budgeting, and prioritizing needs. (Full article text goes here...)",
    category: "Budgeting",
    difficulty: "Beginner",
    readTime: "4 min"
  },
  {
    id: "gov-schemes",
    title: "🏛️ Government Schemes",
    summary: "Know about schemes available for women and families.",
    content: "Summary of common schemes, eligibility, and how to apply. (Full article text goes here...)",
    category: "Schemes",
    difficulty: "All",
    readTime: "5 min"
  }
];

router.get('/', (req, res) => {
  res.json(lessons);
});

module.exports = router;
