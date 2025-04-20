const express = require("express");
const router = express.Router();
const { seedDatabase } = require("../controllers/seedController");

// Route to seed the database with dummy data
router.get("/seed", seedDatabase);

module.exports = router;
