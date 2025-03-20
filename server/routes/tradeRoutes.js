const express = require('express');
const router = express.Router();
const Trade = require('../models/Trade');

// Create a new trade
router.post('/', async (req, res) => {
  try {
    console.log('Creating new trade:', req.body);
    const trade = new Trade(req.body);
    const savedTrade = await trade.save();
    console.log('Trade created successfully:', savedTrade);
    res.status(201).json(savedTrade);
  } catch (error) {
    console.error('Error creating trade:', error);
    res.status(400).json({ message: error.message });
  }
});

// Get all trades
router.get('/', async (req, res) => {
  try {
    const trades = await Trade.find().sort({ createdAt: -1 });
    res.json(trades);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get trades by user ID
router.get('/user/:userId', async (req, res) => {
  try {
    const trades = await Trade.find({ userId: req.params.userId }).sort({ createdAt: -1 });
    res.json(trades);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update trade status
router.patch('/:id', async (req, res) => {
  try {
    const trade = await Trade.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    if (!trade) {
      return res.status(404).json({ message: 'Trade not found' });
    }
    res.json(trade);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router; 