const express = require('express');
const router = express.Router();
const Candidate = require('../models/Candidate');
const User = require('../models/User');
const authMiddleware = require('../middleware/authMiddleware');

// ✅ GET /api/vote/candidates — Fetch all candidates (used on Vote page)
router.get('/candidates', authMiddleware, async (req, res) => {
  console.log('🟢 /api/vote/candidates hit!');
  try {
    const candidates = await Candidate.find().select('name');
    res.json(candidates);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch candidates', error: err.message });
  }
});

// ✅ POST /api/vote — Submit a vote
router.post('/', authMiddleware, async (req, res) => {
  const userId = req.user.userId;
  const { candidateId } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (user.hasVoted) {
      return res.status(400).json({ message: 'You have already voted' });
    }

    const candidate = await Candidate.findById(candidateId);
    if (!candidate) return res.status(404).json({ message: 'Candidate not found' });

    if (typeof candidate.votes !== 'number') {
      candidate.votes = 0;
    }
    candidate.votes += 1;
    console.log(`✅ Vote added for candidate: ${candidate.name}, new vote count: ${candidate.votes}`);
    await candidate.save();

    user.hasVoted = true;
    await user.save();

    res.status(200).json({ message: 'Vote recorded successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
