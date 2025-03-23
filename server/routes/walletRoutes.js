const express = require('express');
const router = express.Router();
const Wallet = require('../models/Wallet');

// Get wallet balance
router.get('/:userId', async (req, res) => {
  try {
    const wallet = await Wallet.findOne({ userId: req.params.userId });
    if (!wallet) {
      // Create a new wallet if it doesn't exist
      const newWallet = new Wallet({ userId: req.params.userId });
      await newWallet.save();
      return res.json(newWallet);
    }
    res.json(wallet);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add funds to wallet (dummy payment)
router.post('/deposit', async (req, res) => {
  try {
    const { userId, amount } = req.body;
    
    let wallet = await Wallet.findOne({ userId });
    if (!wallet) {
      wallet = new Wallet({ userId });
    }
    
    wallet.balance += parseFloat(amount);
    wallet.updatedAt = new Date();
    await wallet.save();
    
    res.json(wallet);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update wallet balance (for trades)
router.post('/update', async (req, res) => {
  try {
    const { userId, amount } = req.body;
    
    let wallet = await Wallet.findOne({ userId });
    if (!wallet) {
      return res.status(404).json({ message: 'Wallet not found' });
    }
    
    const newBalance = wallet.balance + parseFloat(amount);
    if (newBalance < 0) {
      return res.status(400).json({ message: 'Insufficient funds' });
    }
    
    wallet.balance = newBalance;
    wallet.updatedAt = new Date();
    await wallet.save();
    
    res.json(wallet);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 