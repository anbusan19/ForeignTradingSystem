const express = require('express');
const router = express.Router();
const Trade = require('../models/Trade');
const Wallet = require('../models/Wallet');

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

// Get user trades
router.get('/user/:userId', async (req, res) => {
  try {
    const trades = await Trade.find({ userId: req.params.userId }).sort({ createdAt: -1 });
    res.json(trades);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Execute a trade
router.post('/execute/:tradeId', async (req, res) => {
  try {
    const { tradeId } = req.params;
    const { userId } = req.body;

    const trade = await Trade.findById(tradeId);
    if (!trade) {
      return res.status(404).json({ message: 'Trade not found' });
    }

    if (trade.status !== 'pending') {
      return res.status(400).json({ message: 'Trade is no longer pending' });
    }

    const wallet = await Wallet.findOne({ userId });
    if (!wallet) {
      return res.status(404).json({ message: 'Wallet not found' });
    }

    const totalCost = trade.amount * trade.price;

    // Check if user has sufficient balance and update wallet
    if (trade.type === 'buy') {
      if (wallet.balance < totalCost) {
        return res.status(400).json({ message: 'Insufficient funds' });
      }
      wallet.balance -= totalCost;
    } else {
      if (wallet.balance < trade.amount) {
        return res.status(400).json({ message: 'Insufficient currency amount' });
      }
      wallet.balance += totalCost;
    }

    // Update wallet and trade status
    wallet.updatedAt = new Date();
    await wallet.save();

    trade.status = 'completed';
    await trade.save();

    res.json({ trade, wallet });
  } catch (error) {
    console.error('Error executing trade:', error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 