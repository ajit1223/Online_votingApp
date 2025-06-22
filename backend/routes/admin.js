const express = require('express');
const router = express.Router();
const Candidate = require('../models/Candidate');
// const authMiddleware = require('../middleware/auth');
// const authMiddleware = require('../middleware/authMiddleware');
const verifyToken = require('../middleware/authMiddleware');



// Add a new candidate (protected)
router.post('/add', verifyToken, async (req, res) => {
  const { name } = req.body;

  try {
    const exists = await Candidate.findOne({ name });
    if (exists) return res.status(400).json({ message: 'Candidate already exists' });

    const newCandidate = new Candidate({ name });
    await newCandidate.save();

    res.status(201).json({ message: 'Candidate added successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get voting results (protected)
router.get('/results', verifyToken, async (req, res) => {
  try {
    const candidates = await Candidate.find().select('name votes');
    res.status(200).json(candidates);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;